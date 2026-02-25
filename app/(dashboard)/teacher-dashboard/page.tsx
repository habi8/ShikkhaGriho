import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ClassroomCard } from '@/components/classroom-card'
import { CreateClassroomDialog } from '@/components/create-classroom-dialog'
import { EmptyState } from '@/components/empty-state'
import { Classroom } from '@/types'
import { Plus } from 'lucide-react'

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = user.user_metadata?.role
  if (role !== 'teacher') redirect('/student-dashboard')

  // Fetch classrooms with member counts
  const { data: classrooms } = await supabase
    .from('classrooms')
    .select(`
      *,
      classroom_members(count)
    `)
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  const enriched: Classroom[] = (classrooms ?? []).map((c: any) => ({
    ...c,
    member_count: c.classroom_members?.[0]?.count ?? 0,
  }))

  const profile = user.user_metadata
  const firstName = (profile?.full_name as string)?.split(' ')[0] ?? 'Teacher'

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Colored header banner */}
      <div className="mb-8 rounded-2xl px-7 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ background: 'linear-gradient(120deg, #1E3A8A 0%, #1D4ED8 100%)' }}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Teacher Dashboard</p>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
            You have {enriched.length} classroom{enriched.length !== 1 ? 's' : ''}
          </p>
        </div>
        <CreateClassroomDialog />
      </div>

      {/* Classrooms grid */}
      {enriched.length === 0 ? (
        <EmptyState
          title="No classrooms yet"
          description="Create your first classroom to start sharing announcements, taking attendance, and managing students."
          action={<CreateClassroomDialog />}
          icon={<Plus className="h-7 w-7" />}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enriched.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} role="teacher" />
          ))}
        </div>
      )}
    </div>
  )
}
