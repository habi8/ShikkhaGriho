import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { removeMember } from '@/lib/actions/classroom'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

interface PageProps {
  params: Promise<{ id: string }>
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default async function MembersPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const [
    { data: { user } },
    { data: classroom },
    { data: members }
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('classrooms')
      .select('teacher_id, invite_code, name, profiles!classrooms_teacher_id_fkey(*)')
      .eq('id', id)
      .single(),
    supabase
      .from('classroom_members')
      .select('*, profiles(*)')
      .eq('classroom_id', id)
      .order('joined_at', { ascending: true })
  ])

  if (!user) redirect('/auth/login')

  const isTeacher = classroom?.teacher_id === user.id
  const teacherProfile = classroom?.profiles as any

  const students = (members ?? []).map((m: any) => ({ ...m, profile: m.profiles }))

  return (
    <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto">
      {/* Invite code (teacher only) */}
      {isTeacher && classroom?.invite_code && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Class invite code</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-primary">
              {classroom.invite_code}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">Share with students</Badge>
        </div>
      )}

      {/* Teacher */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Teacher</h2>
      {teacherProfile && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials(teacherProfile.full_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{teacherProfile.full_name}</p>
            <Badge variant="outline" className="text-xs mt-0.5">Teacher</Badge>
          </div>
        </div>
      )}

      {/* Students */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Students ({students.length})
        </h2>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="No students yet"
          description="Share the invite code with students to let them join."
          icon={<Users className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-2">
          {students.map((member: any) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                    {initials(member.profile?.full_name ?? null)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-foreground">
                  {member.profile?.full_name ?? 'Unknown student'}
                </p>
              </div>
              {isTeacher && (
                <form
                  action={async () => {
                    'use server'
                    await removeMember(member.student_id, id)
                  }}
                >
                  <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    Remove
                  </Button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
