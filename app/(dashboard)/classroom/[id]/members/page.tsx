import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MembersClient } from '@/components/classroom/members-client'

interface PageProps {
  params: Promise<{ id: string }>
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
    <MembersClient
      classroom={classroom}
      classroomId={id}
      isTeacher={isTeacher}
      teacherProfile={teacherProfile}
      students={students}
    />
  )
}
