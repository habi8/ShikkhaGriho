'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Classroom } from '@/types'

interface ClassroomHeaderProps {
  classroom: Classroom
  isTeacher: boolean
  currentUserId: string
}

const tabs = (id: string, isTeacher: boolean) => [
  { label: 'Announcements', href: `/classroom/${id}` },
  { label: 'Resources', href: `/classroom/${id}/resources` },
  { label: 'Members', href: `/classroom/${id}/members` },
  { label: 'Attendance', href: `/classroom/${id}/attendance` },
  { label: 'About', href: `/classroom/${id}/about` },
  ...(isTeacher ? [{ label: 'Settings', href: `/classroom/${id}/settings` }] : []),
]

export function ClassroomHeader({ classroom, isTeacher }: ClassroomHeaderProps) {
  const pathname = usePathname()

  return (
    <div>
      {/* Cover banner */}
      <div
        className="px-6 pt-8 pb-5 sm:px-10"
        style={{ backgroundColor: classroom.cover_color }}
      >
        <h1 className="text-xl font-bold text-white sm:text-2xl">{classroom.name}</h1>
        {classroom.section && (
          <p className="mt-0.5 text-sm text-white/75">
            {classroom.subject && `${classroom.subject} · `}Section {classroom.section}
          </p>
        )}
        {classroom.teacher && !isTeacher && (
          <p className="mt-1 text-xs text-white/70">{classroom.teacher.full_name}</p>
        )}
      </div>

      {/* Tabs */}
      <nav className="border-b border-border bg-card px-4 sm:px-8">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {tabs(classroom.id, isTeacher).map((tab) => {
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
        </div>
      </nav>
    </div>
  )
}
