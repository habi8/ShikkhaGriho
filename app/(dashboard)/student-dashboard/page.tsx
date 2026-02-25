import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ClassroomCard } from '@/components/classroom-card'
import { JoinClassroomDialog } from '@/components/join-classroom-dialog'
import { EmptyState } from '@/components/empty-state'
import { Classroom } from '@/types'
import { Plus } from 'lucide-react'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = user.user_metadata?.role
  if (role !== 'student') redirect('/teacher-dashboard')

  // Fetch joined classrooms with teacher info and member count
  const { data: memberships } = await supabase
    .from('classroom_members')
    .select(`
      classrooms(
        *,
        profiles!classrooms_teacher_id_fkey(id, full_name, avatar_url, role, created_at),
        classroom_members(count)
      )
    `)
    .eq('user_id', user.id)

  const classrooms: Classroom[] = (memberships ?? [])
    .map((m: any) => {
      const c = m.classrooms
      if (!c) return null
      return {
        ...c,
        teacher: c.profiles,
        member_count: c.classroom_members?.[0]?.count ?? 0,
      }
    })
    .filter(Boolean)

  const firstName = (user.user_metadata?.full_name as string)?.split(' ')[0] ?? 'Student'

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Colored header banner */}
      <div className="mb-8 rounded-2xl px-7 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: 'linear-gradient(120deg, #16A34A 0%, #22C55E 100%)' }}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Student Dashboard</p>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            You are enrolled in {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <JoinClassroomDialog />
      </div>

      {/* Classrooms grid */}
      {classrooms.length === 0 ? (
        <EmptyState
          title="Not enrolled in any classrooms"
          description="Ask your teacher for a class code and join your first classroom."
          action={<JoinClassroomDialog />}
          icon={<Plus className="h-7 w-7" />}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} role="student" />
          ))}
        </div>
      )}
    </div>
  )
}
