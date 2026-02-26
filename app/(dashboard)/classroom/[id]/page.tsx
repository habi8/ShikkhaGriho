import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnnouncementsClient } from '@/components/classroom/announcements-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AnnouncementsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Run all three queries in parallel
  const [
    { data: { user } },
    { data: classroom },
    { data: announcements },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('classrooms').select('teacher_id').eq('id', id).single(),
    supabase
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
      .order('created_at', { ascending: false }),
  ])

  if (!user) redirect('/auth/login')

  const isTeacher = classroom?.teacher_id === user.id

  const enriched = (announcements ?? []).map((a: any) => ({
    ...a,
    author: a.profiles,
    comments: (a.comments ?? []).map((c: any) => ({ ...c, author: c.profiles })),
  }))

  return (
    <AnnouncementsClient
      classroomId={id}
      isTeacher={isTeacher}
      currentUserId={user.id}
      announcements={enriched}
    />
  )
}
