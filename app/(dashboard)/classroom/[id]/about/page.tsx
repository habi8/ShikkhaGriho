import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AboutClient } from '@/components/classroom/about-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AboutPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('*, profiles!classrooms_teacher_id_fkey(id, full_name)')
    .eq('id', id)
    .single()

  const { count: memberCount } = await supabase
    .from('classroom_members')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', id)

  if (!classroom) redirect('/teacher-dashboard')

  const isTeacher = classroom.teacher_id === user.id

  return (
    <AboutClient
      classroom={classroom}
      memberCount={memberCount ?? 0}
      isTeacher={isTeacher}
    />
  )
}
