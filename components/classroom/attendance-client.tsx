'use client'

import { useTranslation } from 'react-i18next'
import { createAttendanceSession, markAttendance, closeAttendanceSessionByForm } from '@/lib/actions/classroom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { ClipboardCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { getDateLocale } from '@/lib/date-locale'

const statusColors: Record<string, string> = {
  present: 'bg-accent/15 text-accent border-accent/30',
  absent: 'bg-destructive/10 text-destructive border-destructive/20',
  late: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function AttendanceClient({
  classroomId,
  isTeacher,
  sessions,
  students,
  openSession,
  openRecords,
}: {
  classroomId: string
  isTeacher: boolean
  sessions: any[]
  students: Array<{ student_id: string; full_name: string; avatar_url?: string | null }>
  openSession: any | null
  openRecords: Record<string, string>
}) {
  const { t, i18n } = useTranslation()
  const locale = getDateLocale(i18n.language)
  const closedSessions = (sessions ?? []).filter((s: any) => !s.is_open)

  return (
    <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-8">
      {isTeacher && !openSession && (
        <form action={createAttendanceSession} className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">{t('attendance.start_title')}</h2>
          <input type="hidden" name="classroom_id" value={classroomId} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="title">{t('attendance.session_title')}</label>
              <Input id="title" name="title" placeholder={t('attendance.session_placeholder')} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="date">{t('attendance.date')}</label>
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
              {t('attendance.start_button')}
            </Button>
          </div>
        </form>
      )}

      {openSession && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-foreground">
                {openSession.title ?? t('attendance.default_session_title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(new Date(openSession.date), 'dd MMM yyyy', { locale })}
              </p>
            </div>
            <Badge className="bg-accent/15 text-accent border-accent/30">{t('common.live')}</Badge>
          </div>

          {isTeacher && students.length === 0 && (
            <p className="text-sm text-muted-foreground">{t('attendance.no_students')}</p>
          )}

          {isTeacher && students.length > 0 && (
            <div className="space-y-2">
              {students.map((student) => {
                const currentStatus = openRecords[student.student_id]
                const displayName = student.full_name || t('common.unknown')
                return (
                  <div key={student.student_id} className="flex items-center justify-between rounded-lg bg-card border border-border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {student.avatar_url && (
                          <AvatarImage src={student.avatar_url} alt={displayName} />
                        )}
                        <AvatarFallback className="bg-muted text-xs">{initials(displayName)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{displayName}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {(['present', 'late', 'absent'] as const).map((status) => (
                        <form key={status} action={markAttendance}>
                          <input type="hidden" name="session_id" value={openSession.id} />
                          <input type="hidden" name="student_id" value={student.student_id} />
                          <input type="hidden" name="status" value={status} />
                          <input type="hidden" name="classroom_id" value={classroomId} />
                          <button
                            type="submit"
                            className={`rounded px-2.5 py-1 text-xs font-medium border transition-all ${currentStatus === status
                              ? statusColors[status]
                              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                              }`}
                          >
                            {t(`attendance.status.${status}`)}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                )
              })}
              <form action={closeAttendanceSessionByForm} className="mt-4 flex justify-end">
                <input type="hidden" name="session_id" value={openSession.id} />
                <input type="hidden" name="classroom_id" value={classroomId} />
                <Button type="submit" variant="outline" size="sm">
                  {t('attendance.close_session')}
                </Button>
              </form>
            </div>
          )}

          {!isTeacher && (
            <p className="text-sm text-muted-foreground">
              {t('attendance.student_notice')}
            </p>
          )}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('attendance.past_sessions', { count: closedSessions.length })}
        </h2>
        {closedSessions.length === 0 ? (
          <EmptyState
            title={t('attendance.empty_title')}
            description={isTeacher ? t('attendance.empty_teacher') : t('attendance.empty_student')}
            icon={<ClipboardCheck className="h-7 w-7" />}
          />
        ) : (
          <div className="space-y-2">
            {closedSessions.map((session: any) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session.title ?? t('attendance.default_session_title')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(session.date), 'dd MMM yyyy', { locale })}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">{t('common.closed')}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
