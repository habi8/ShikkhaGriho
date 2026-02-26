import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StudentDashboardClient } from '@/components/dashboard/student-dashboard-client'
import { Classroom } from '@/types'

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
    .eq('student_id', user.id)

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

  return <StudentDashboardClient firstName={firstName} classrooms={classrooms} />
}
