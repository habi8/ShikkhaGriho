'use client'

import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { removeMemberByForm } from '@/lib/actions/classroom'

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function MembersClient({
  classroom,
  classroomId,
  isTeacher,
  teacherProfile,
  students,
}: {
  classroom: { invite_code?: string | null }
  classroomId: string
  isTeacher: boolean
  teacherProfile?: { full_name?: string | null; avatar_url?: string | null }
  students: Array<{ id: string; student_id: string; profile?: { full_name?: string | null; avatar_url?: string | null } }>
}) {
  const { t } = useTranslation()

  return (
    <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto">
      {isTeacher && classroom?.invite_code && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('classroom.members.invite_code_label')}</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-primary">
              {classroom.invite_code}
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">{t('classroom.about.share_with_students')}</Badge>
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t('classroom.about.teacher')}</h2>
      {teacherProfile && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <Avatar className="h-10 w-10">
            {teacherProfile.avatar_url && (
              <AvatarImage src={teacherProfile.avatar_url} alt={teacherProfile.full_name ?? t('common.unknown')} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials(teacherProfile.full_name ?? null)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{teacherProfile.full_name}</p>
            <Badge variant="outline" className="text-xs mt-0.5">{t('roles.teacher')}</Badge>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('classroom.members.students_count', { count: students.length })}
        </h2>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title={t('classroom.members.empty_title')}
          description={t('classroom.members.empty_description')}
          icon={<Users className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-2">
          {students.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  {member.profile?.avatar_url && (
                    <AvatarImage src={member.profile.avatar_url} alt={member.profile.full_name ?? t('classroom.members.unknown_student')} />
                  )}
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                    {initials(member.profile?.full_name ?? null)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium text-foreground">
                  {member.profile?.full_name ?? t('classroom.members.unknown_student')}
                </p>
              </div>
              {isTeacher && (
                <form action={removeMemberByForm}>
                  <input type="hidden" name="student_id" value={member.student_id} />
                  <input type="hidden" name="classroom_id" value={classroomId} />
                  <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    {t('classroom.members.remove')}
                  </Button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
