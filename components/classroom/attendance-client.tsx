'use client'

import { useTranslation } from 'react-i18next'
import { createAttendanceSession, markAttendance, closeAttendanceSessionByForm } from '@/lib/actions/classroom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/empty-state'
import { Check, ClipboardCheck, Clock, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { getDateLocale } from '@/lib/date-locale'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

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
  summaryRecords,
}: {
  classroomId: string
  isTeacher: boolean
  sessions: any[]
  students: Array<{ student_id: string; full_name: string; avatar_url?: string | null }>
  openSession: any | null
  openRecords: Record<string, string>
  summaryRecords: Record<string, Record<string, string>>
}) {
  const { t, i18n } = useTranslation()
  const locale = getDateLocale(i18n.language)
  const closedSessions = (sessions ?? []).filter((s: any) => !s.is_open)
  const summarySessions = (sessions ?? []).slice().reverse()
  const [editCell, setEditCell] = useState<{
    session: any
    student: { student_id: string; full_name: string; avatar_url?: string | null }
    status: 'present' | 'absent' | 'late' | null
  } | null>(null)
  const [selectedSession, setSelectedSession] = useState<any | null>(null)

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
            <Button type="submit" size="sm" className="gap-2 cursor-pointer">
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
            <Badge className="live-badge cursor-pointer">{t('common.live')}</Badge>
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
                            style={{ cursor: 'pointer' }}
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
                <Button type="submit" variant="outline" size="sm" className="cursor-pointer">
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

      {isTeacher && sessions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {t('attendance.summary_title')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-card px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border">
                    {t('common.students', { count: students.length })}
                  </th>
                  {summarySessions.map((session: any) => (
                    <th
                      key={session.id}
                      className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b border-border"
                    >
                      <div className="flex flex-col">
                        <span className="text-[11px] text-foreground">
                          {format(new Date(session.date), 'dd MMM', { locale })}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {session.title ?? t('attendance.default_session_title')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const displayName = student.full_name || t('common.unknown')
                  return (
                    <tr key={student.student_id} className="border-b border-border/60">
                      <td className="sticky left-0 z-10 bg-card px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            {student.avatar_url && (
                              <AvatarImage src={student.avatar_url} alt={displayName} />
                            )}
                            <AvatarFallback className="bg-muted text-[10px]">{initials(displayName)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-foreground">{displayName}</span>
                        </div>
                      </td>
                      {summarySessions.map((session: any) => {
                        const status = summaryRecords[session.id]?.[student.student_id] ?? null
                        return (
                          <td key={session.id} className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setEditCell({ session, student, status })}
                              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${status === 'present'
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : status === 'absent'
                                  ? 'bg-destructive/10 text-destructive border-destructive/30'
                                  : status === 'late'
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                } cursor-pointer`}
                            >
                              {status === 'present' && <Check className="h-3.5 w-3.5" />}
                              {status === 'absent' && <X className="h-3.5 w-3.5" />}
                              {status === 'late' && <Clock className="h-3.5 w-3.5" />}
                              {!status && <span className="text-[10px] font-semibold">·</span>}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
              <button
                key={session.id}
                type="button"
                onClick={() => setSelectedSession(session)}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:shadow-sm cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session.title ?? t('attendance.default_session_title')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(session.date), 'dd MMM yyyy', { locale })}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">{t('common.closed')}</Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedSession} onOpenChange={(open) => { if (!open) setSelectedSession(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">{t('attendance.past_sessions', { count: 1 })}</DialogTitle>
          {selectedSession && (
            <div className="space-y-4">
              <div>
                <p className="text-base font-semibold text-foreground">
                  {selectedSession.title ?? t('attendance.default_session_title')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(selectedSession.date), 'dd MMM yyyy', { locale })}
                </p>
              </div>
              <div className="space-y-2">
                {students.map((student) => {
                  const status = summaryRecords[selectedSession.id]?.[student.student_id] ?? 'absent'
                  const displayName = student.full_name || t('common.unknown')
                  return (
                    <div
                      key={student.student_id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {student.avatar_url && (
                            <AvatarImage src={student.avatar_url} alt={displayName} />
                          )}
                          <AvatarFallback className="bg-muted text-xs">{initials(displayName)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{displayName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        {status === 'present' && (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                        {status === 'absent' && (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                        {status === 'late' && (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {t(`attendance.status.${status}`)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

        <Dialog open={!!editCell} onOpenChange={(open) => { if (!open) setEditCell(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogTitle className="sr-only">{t('attendance.summary_title')}</DialogTitle>
          {editCell && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {editCell.student.full_name || t('common.unknown')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {editCell.session.title ?? t('attendance.default_session_title')} • {format(new Date(editCell.session.date), 'dd MMM yyyy', { locale })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form action={markAttendance} onSubmit={() => setEditCell(null)}>
                  <input type="hidden" name="session_id" value={editCell.session.id} />
                  <input type="hidden" name="student_id" value={editCell.student.student_id} />
                  <input type="hidden" name="classroom_id" value={classroomId} />
                  <input type="hidden" name="status" value="present" />
                  <Button type="submit" variant="outline" size="sm" className="gap-2 cursor-pointer">
                    <Check className="h-4 w-4 text-emerald-600" />
                    {t('attendance.status.present')}
                  </Button>
                </form>
                <form action={markAttendance} onSubmit={() => setEditCell(null)}>
                  <input type="hidden" name="session_id" value={editCell.session.id} />
                  <input type="hidden" name="student_id" value={editCell.student.student_id} />
                  <input type="hidden" name="classroom_id" value={classroomId} />
                  <input type="hidden" name="status" value="absent" />
                  <Button type="submit" variant="outline" size="sm" className="gap-2 cursor-pointer">
                    <X className="h-4 w-4 text-destructive" />
                    {t('attendance.status.absent')}
                  </Button>
                </form>
                <form action={markAttendance} onSubmit={() => setEditCell(null)}>
                  <input type="hidden" name="session_id" value={editCell.session.id} />
                  <input type="hidden" name="student_id" value={editCell.student.student_id} />
                  <input type="hidden" name="classroom_id" value={classroomId} />
                  <input type="hidden" name="status" value="late" />
                  <Button type="submit" variant="outline" size="sm" className="gap-2 cursor-pointer">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    {t('attendance.status.late')}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
