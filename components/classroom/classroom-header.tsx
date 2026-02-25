'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Classroom } from '@/types'
import { leaveClassroom } from '@/lib/actions/classroom'
import { LogOut } from 'lucide-react'

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
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{classroom.name}</h1>
        {classroom.section && (
          <p className="mt-1 text-base text-white/80">
            {classroom.subject && `${classroom.subject} · `}Section {classroom.section}
          </p>
        )}
        {classroom.teacher && !isTeacher && (
          <p className="mt-1.5 text-sm font-medium text-white/90">{classroom.teacher.full_name}</p>
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

          {/* Leave classroom for students, anchored to the right */}
          {!isTeacher && (
            <form action={leaveClassroom} onSubmit={(e) => {
              if (!confirm('Are you sure you want to leave this classroom?')) e.preventDefault()
            }} className="ml-auto mt-1 mr-2 flex">
              <input type="hidden" name="classroom_id" value={classroom.id} />
              <button type="submit" className="shrink-0 px-4 py-2 text-base font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2 m-1">
                <LogOut className="h-4 w-4" />
                Leave Classroom
              </button>
            </form>
          )}
        </div>
      </nav>
    </div>
  )
}
