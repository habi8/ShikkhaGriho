import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AttendanceClient } from '@/components/classroom/attendance-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AttendancePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const [
    { data: { user } },
    { data: classroom },
    { data: sessions },
    { data: members }
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('classrooms').select('teacher_id').eq('id', id).single(),
    supabase.from('attendance_sessions').select('*').eq('classroom_id', id).order('date', { ascending: false }),
    supabase.from('classroom_members').select('student_id, profiles(id, full_name, avatar_url)').eq('classroom_id', id)
  ])

  if (!user) redirect('/auth/login')

  const isTeacher = classroom?.teacher_id === user.id

  const students = (members ?? []).map((m: any) => ({
    student_id: m.student_id,
    full_name: m.profiles?.full_name ?? '',
    avatar_url: m.profiles?.avatar_url ?? null,
  }))

  const openSession = (sessions ?? []).find((s: any) => s.is_open)

  const sessionIds = (sessions ?? []).map((s: any) => s.id)

  let summaryRecords: Record<string, Record<string, string>> = {}
  if (sessionIds.length) {
    const { data: records } = await supabase
      .from('attendance_records')
      .select('session_id, student_id, status')
      .in('session_id', sessionIds)

    summaryRecords = (records ?? []).reduce((acc: Record<string, Record<string, string>>, record: any) => {
      if (!acc[record.session_id]) acc[record.session_id] = {}
      acc[record.session_id][record.student_id] = record.status
      return acc
    }, {})
  }

  let openRecords: Record<string, string> = {}
  if (openSession) {
    const { data: records } = await supabase
      .from('attendance_records')
      .select('student_id, status')
      .eq('session_id', openSession.id)
    openRecords = Object.fromEntries((records ?? []).map((r: any) => [r.student_id, r.status]))
  }

  return (
    <AttendanceClient
      classroomId={id}
      isTeacher={isTeacher}
      sessions={sessions ?? []}
      students={students}
      openSession={openSession ?? null}
      openRecords={openRecords}
      summaryRecords={summaryRecords}
    />
  )
}
