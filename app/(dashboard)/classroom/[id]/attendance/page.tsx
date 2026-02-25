import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAttendanceSession, markAttendance, closeAttendanceSession } from '@/lib/actions/classroom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { ClipboardCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'

interface PageProps {
  params: Promise<{ id: string }>
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const statusColors: Record<string, string> = {
  present: 'bg-accent/15 text-accent border-accent/30',
  absent: 'bg-destructive/10 text-destructive border-destructive/20',
  late: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

export default async function AttendancePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('teacher_id')
    .eq('id', id)
    .single()

  const isTeacher = classroom?.teacher_id === user.id

  // Get sessions
  const { data: sessions } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('classroom_id', id)
    .order('date', { ascending: false })

  // Get members (students) for marking
  const { data: members } = await supabase
    .from('classroom_members')
    .select('user_id, profiles(id, full_name)')
    .eq('classroom_id', id)

  const students = (members ?? []).map((m: any) => ({
    user_id: m.user_id,
    full_name: m.profiles?.full_name ?? 'Unknown',
  }))

  // Get open session if any
  const openSession = (sessions ?? []).find((s: any) => s.is_open)

  // Get records for open session
  let openRecords: Record<string, string> = {}
  if (openSession) {
    const { data: records } = await supabase
      .from('attendance_records')
      .select('student_id, status')
      .eq('session_id', openSession.id)
    openRecords = Object.fromEntries((records ?? []).map((r: any) => [r.student_id, r.status]))
  }

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto space-y-8">
      {/* Teacher: create session */}
      {isTeacher && !openSession && (
        <form action={createAttendanceSession} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Start new attendance session</h2>
          <input type="hidden" name="classroom_id" value={id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="title">Session title</label>
              <Input id="title" name="title" placeholder="e.g. Class 1 - Chapter 3" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="date">Date</label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" size="sm" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Start session
            </Button>
          </div>
        </form>
      )}

      {/* Open session attendance marking */}
      {openSession && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-foreground">
                {openSession.title ?? 'Attendance Session'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(openSession.date), 'dd MMM yyyy')}
              </p>
            </div>
            <Badge className="bg-accent/15 text-accent border-accent/30">Live</Badge>
          </div>

          {isTeacher && students.length === 0 && (
            <p className="text-sm text-muted-foreground">No students enrolled yet.</p>
          )}

          {isTeacher && students.length > 0 && (
            <div className="space-y-2">
              {students.map((student) => {
                const currentStatus = openRecords[student.user_id]
                return (
                  <div key={student.user_id} className="flex items-center justify-between rounded-lg bg-card border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-xs">{initials(student.full_name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{student.full_name}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {(['present', 'late', 'absent'] as const).map((status) => (
                        <form key={status} action={markAttendance}>
                          <input type="hidden" name="session_id" value={openSession.id} />
                          <input type="hidden" name="student_id" value={student.user_id} />
                          <input type="hidden" name="status" value={status} />
                          <input type="hidden" name="classroom_id" value={id} />
                          <button
                            type="submit"
                            className={`rounded px-2.5 py-1 text-xs font-medium border transition-all ${
                              currentStatus === status
                                ? statusColors[status]
                                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                )
              })}
              <form action={async () => { 'use server'; await closeAttendanceSession(openSession.id, id) }}
                className="mt-4 flex justify-end"
              >
                <Button type="submit" variant="outline" size="sm">
                  Close session
                </Button>
              </form>
            </div>
          )}

          {!isTeacher && (
            <p className="text-sm text-muted-foreground">
              Attendance is being taken. Your teacher will mark your status shortly.
            </p>
          )}
        </div>
      )}

      {/* Past sessions */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Past sessions ({(sessions ?? []).filter((s: any) => !s.is_open).length})
        </h2>
        {(sessions ?? []).filter((s: any) => !s.is_open).length === 0 ? (
          <EmptyState
            title="No completed sessions yet"
            description={isTeacher ? 'Start a session and close it to see history here.' : 'No attendance has been recorded yet.'}
            icon={<ClipboardCheck className="h-7 w-7" />}
          />
        ) : (
          <div className="space-y-2">
            {(sessions ?? []).filter((s: any) => !s.is_open).map((session: any) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session.title ?? 'Attendance Session'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(session.date), 'dd MMM yyyy')}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Closed</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
