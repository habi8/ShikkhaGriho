'use client'

import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/lib/actions/auth'
import { getDateLocale } from '@/lib/date-locale'

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function ProfileClient({
  fullName,
  email,
  role,
  classroomCount,
  createdAt,
}: {
  fullName: string
  email: string | null
  role: 'teacher' | 'student'
  classroomCount: number
  createdAt: string
}) {
  const { t, i18n } = useTranslation()
  const locale = getDateLocale(i18n.language)

  return (
    <div className="p-6 sm:p-8 max-w-xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-foreground">{t('profile.title')}</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {initials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{fullName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{email}</p>
              <Badge
                variant="secondary"
                className="mt-2 capitalize"
              >
                {role === 'teacher' ? t('roles.teacher') : t('roles.student')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">
                {role === 'teacher'
                  ? t('profile.classrooms_created')
                  : t('profile.classrooms_enrolled')}
              </dt>
              <dd className="mt-1 text-2xl font-bold text-foreground">{classroomCount}</dd>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">{t('profile.member_since')}</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {format(new Date(createdAt), 'dd MMM yyyy', { locale })}
              </dd>
            </div>
          </dl>

          <div className="border-t border-border pt-4">
            <form action={signOut}>
              <Button type="submit" variant="outline" className="gap-2 w-full sm:w-auto">
                <LogOut className="h-4 w-4" />
                {t('common.sign_out')}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
