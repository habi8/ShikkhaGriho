'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Classroom } from '@/types'
import { leaveClassroom } from '@/lib/actions/classroom'
import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ClassroomHeaderProps {
  classroom: Classroom
  isTeacher: boolean
  currentUserId: string
}

export function ClassroomHeader({ classroom, isTeacher }: ClassroomHeaderProps) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const tabs = [
    { label: t('classroom.tabs.announcements'), href: `/classroom/${classroom.id}` },
    { label: t('classroom.tabs.resources'), href: `/classroom/${classroom.id}/resources` },
    { label: t('classroom.tabs.members'), href: `/classroom/${classroom.id}/members` },
    { label: t('classroom.tabs.attendance'), href: `/classroom/${classroom.id}/attendance` },
    { label: t('classroom.tabs.about'), href: `/classroom/${classroom.id}/about` },
    ...(isTeacher ? [{ label: t('classroom.tabs.settings'), href: `/classroom/${classroom.id}/settings` }] : []),
  ]

  return (
    <div>
      {/* Cover banner */}
      <div
        className="mt-3 overflow-hidden rounded-2xl px-6 pt-8 pb-5 sm:px-10"
        style={{ background: classroom.cover_color }}
      >
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{classroom.name}</h1>
        {classroom.section && (
          <p className="mt-1 text-base text-white/80">
            {classroom.subject && `${classroom.subject} · `}{t('classroom.section_label')} {classroom.section}
          </p>
        )}
        {classroom.teacher && !isTeacher && (
          <p className="mt-1.5 text-sm font-medium text-white/90">{classroom.teacher.full_name}</p>
        )}
      </div>

      {/* Tabs */}
      <nav className="mt-4 rounded-2xl border border-border bg-card px-4 sm:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive =
              tab.href === `/classroom/${classroom.id}`
                ? pathname === tab.href
                : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'shrink-0 border-b-2 px-5 py-4 text-base font-medium transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </Link>
            )
          })}

          {/* Leave classroom for students, anchored to the right */}
          {!isTeacher && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="ml-auto mt-1 mr-2 shrink-0 px-4 py-2 text-base font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2 m-1"
                >
                  <LogOut className="h-4 w-4" />
                  {t('classroom.leave_button')}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('classroom.leave_title')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('classroom.leave_confirm')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <form action={leaveClassroom}>
                    <input type="hidden" name="classroom_id" value={classroom.id} />
                    <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {t('classroom.leave_button')}
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </nav>
    </div>
  )
}
