import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeacherDashboardClient } from '@/components/dashboard/teacher-dashboard-client'
import { Classroom } from '@/types'

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

  return <TeacherDashboardClient firstName={firstName} classrooms={enriched} />
}
