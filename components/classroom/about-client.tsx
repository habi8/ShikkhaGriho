'use client'

import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Hash, Users, Calendar, MapPin } from 'lucide-react'
import { getDateLocale } from '@/lib/date-locale'

export function AboutClient({
  classroom,
  memberCount,
  isTeacher,
}: {
  classroom: {
    name: string
    description: string | null
    subject: string | null
    section: string | null
    room: string | null
    created_at: string
    invite_code: string | null
    profiles?: { full_name: string | null }
  }
  memberCount: number
  isTeacher: boolean
}) {
  const { t, i18n } = useTranslation()
  const locale = getDateLocale(i18n.language)

  const details = [
    { icon: <BookOpen className="h-4 w-4" />, label: t('classroom.fields.subject'), value: classroom.subject },
    { icon: <Hash className="h-4 w-4" />, label: t('classroom.fields.section'), value: classroom.section },
    { icon: <MapPin className="h-4 w-4" />, label: t('classroom.fields.room'), value: classroom.room },
    { icon: <Users className="h-4 w-4" />, label: t('classroom.about.students_enrolled'), value: memberCount.toString() },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: t('classroom.about.created'),
      value: format(new Date(classroom.created_at), 'dd MMM yyyy', { locale }),
    },
  ].filter((d) => d.value)

  return (
    <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">{classroom.name}</h1>
          {classroom.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {classroom.description}
            </p>
          )}
        </div>

        {details.length > 0 && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <span className="mt-0.5 text-muted-foreground">{d.icon}</span>
                <div>
                  <dt className="text-xs text-muted-foreground">{d.label}</dt>
                  <dd className="text-sm font-medium text-foreground">{d.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-1">{t('classroom.about.teacher')}</p>
          <p className="text-sm font-semibold text-foreground">
            {classroom.profiles?.full_name ?? t('common.unknown')}
          </p>
        </div>

        {isTeacher && classroom.invite_code && (
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-1">{t('classroom.about.invite_code')}</p>
            <div className="flex items-center gap-3">
              <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                {classroom.invite_code}
              </p>
              <Badge variant="secondary" className="text-xs">{t('classroom.about.share_with_students')}</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
