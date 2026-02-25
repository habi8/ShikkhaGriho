import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { postAnnouncement, deleteAnnouncement, postComment } from '@/lib/actions/classroom'
import { AnnouncementCard } from '@/components/classroom/announcement-card'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AnnouncementsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const isTeacher =
    (await supabase.from('classrooms').select('teacher_id').eq('id', id).single())
      .data?.teacher_id === user.id

  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      *,
      profiles!announcements_author_id_fkey(id, full_name, avatar_url, role, created_at),
      comments(
        *,
        profiles!comments_author_id_fkey(id, full_name, avatar_url, role, created_at)
      )
    `)
    .eq('classroom_id', id)
    .order('created_at', { ascending: false })

  const enriched = (announcements ?? []).map((a: any) => ({
    ...a,
    author: a.profiles,
    comments: (a.comments ?? []).map((c: any) => ({ ...c, author: c.profiles })),
  }))

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-6">
      {/* Post announcement (teacher only) */}
      {isTeacher && (
        <form action={postAnnouncement} className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <input type="hidden" name="classroom_id" value={id} />
          <Textarea
            name="content"
            placeholder="Share something with your class..."
            required
            rows={3}
            className="mb-3 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm">Post</Button>
          </div>
        </form>
      )}

      {/* Announcement list */}
      {enriched.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description={isTeacher ? 'Post your first announcement above.' : 'Your teacher has not posted anything yet.'}
          icon={<Megaphone className="h-7 w-7" />}
        />
      ) : (
        enriched.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            classroomId={id}
            currentUserId={user.id}
            isTeacher={isTeacher}
            onDelete={deleteAnnouncement}
            onComment={postComment}
          />
        ))
      )}
    </div>
  )
}
