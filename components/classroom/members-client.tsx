'use client'

import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, User, Users, X } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { removeMemberByForm } from '@/lib/actions/classroom'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

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
  teacherProfile?: { full_name?: string | null; avatar_url?: string | null; email?: string | null; phone?: string | null; role?: 'teacher' | 'student' }
  students: Array<{ id: string; student_id: string; profile?: { full_name?: string | null; avatar_url?: string | null; email?: string | null; phone?: string | null; role?: 'teacher' | 'student' } }>
}) {
  const { t } = useTranslation()
  const [selectedMember, setSelectedMember] = useState<{
    full_name?: string | null
    avatar_url?: string | null
    email?: string | null
    phone?: string | null
    role?: 'teacher' | 'student'
  } | null>(null)

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
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSelectedMember(teacherProfile)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMember(teacherProfile) }}
          className="mb-6 flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:shadow-sm cursor-pointer"
        >
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
              role="button"
              tabIndex={0}
              onClick={() => setSelectedMember(member.profile ?? null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMember(member.profile ?? null) }}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-left transition-shadow hover:shadow-sm cursor-pointer"
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
                <form action={removeMemberByForm} onClick={(e) => e.stopPropagation()}>
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

      <Dialog open={!!selectedMember} onOpenChange={(open) => { if (!open) setSelectedMember(null) }}>
        <DialogContent className="sm:max-w-sm p-0 overflow-hidden" showCloseButton={false}>
          <DialogTitle className="sr-only">{t('classroom.members.profile_title')}</DialogTitle>
          {selectedMember && (
            <div className="flex flex-col">
              <div className="relative aspect-square w-full bg-[#F8FAFC]">
                <DialogClose className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground shadow-md transition hover:bg-white hover:text-foreground">
                  <X className="h-4 w-4" />
                </DialogClose>
                {selectedMember.avatar_url ? (
                  <img
                    src={selectedMember.avatar_url}
                    alt={selectedMember.full_name ?? t('common.unknown')}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
                      {initials(selectedMember.full_name ?? null)}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 px-5 py-5">
                <Badge variant="secondary" className="w-fit capitalize">
                  {selectedMember.role === 'teacher' ? t('roles.teacher') : t('roles.student')}
                </Badge>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {selectedMember.full_name ?? t('common.unknown')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{selectedMember.email ?? t('classroom.members.not_provided')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{selectedMember.phone ?? t('classroom.members.not_provided')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
