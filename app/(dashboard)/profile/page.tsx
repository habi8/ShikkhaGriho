import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileClient } from '@/components/dashboard/profile-client'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = user.user_metadata?.role as string

  // Parallelize fetching profile data and computing classroom count
  const [profileRes, countRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    role === 'teacher'
      ? supabase.from('classrooms').select('id', { count: 'exact', head: true }).eq('teacher_id', user.id)
      : supabase.from('classroom_members').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
  ])

  const profile = profileRes.data
  const classroomCount = countRes.count ?? 0

  const fullName = profile?.full_name ?? user.user_metadata?.full_name ?? 'User'
  const createdAt = profile?.created_at ?? user.created_at

  return (
    <ProfileClient
      fullName={fullName}
      email={user.email}
      role={role as 'teacher' | 'student'}
      classroomCount={classroomCount}
      createdAt={createdAt}
    />
  )
}
