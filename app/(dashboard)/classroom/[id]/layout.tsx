import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ClassroomHeader } from '@/components/classroom/classroom-header'

interface ClassroomLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function ClassroomLayout({ children, params }: ClassroomLayoutProps) {
  const { id } = await params
  const supabase = await createClient()

  // Run auth + classroom fetch in parallel
  const [{ data: { user } }, { data: classroom }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('classrooms')
      .select('*, profiles!classrooms_teacher_id_fkey(id, full_name, avatar_url, role, created_at)')
      .eq('id', id)
      .single(),
  ])

  if (!user) redirect('/auth/login')
  if (!classroom) notFound()

  const isTeacher = classroom.teacher_id === user.id

  // Verify student membership (only if not teacher)
  if (!isTeacher) {
    const { data: member } = await supabase
      .from('classroom_members')
      .select('id')
      .eq('classroom_id', id)
      .eq('student_id', user.id)
      .single()
    if (!member) redirect('/student-dashboard')
  }

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-8">
      <ClassroomHeader
        classroom={{ ...classroom, teacher: classroom.profiles }}
        isTeacher={isTeacher}
        currentUserId={user.id}
      />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
