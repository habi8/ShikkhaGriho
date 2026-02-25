import Link from 'next/link'
import { BookOpen, Users } from 'lucide-react'
import { Classroom } from '@/types'

interface ClassroomCardProps {
  classroom: Classroom
  role?: 'teacher' | 'student'
}

export function ClassroomCard({ classroom, role }: ClassroomCardProps) {
  return (
    <Link
      href={`/classroom/${classroom.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5"
    >
      {/* Cover */}
      <div
        className="relative flex h-36 items-end p-5"
        style={{ backgroundColor: classroom.cover_color }}
      >
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <h3 className="relative text-xl font-bold text-white leading-snug text-balance line-clamp-2 drop-shadow-sm">
          {classroom.name}
        </h3>
      </div>

      {/* Body */}
      <div className="p-5">
        {classroom.subject && (
          <p className="text-base font-medium text-foreground mb-0.5">{classroom.subject}</p>
        )}
        {classroom.section && (
          <p className="text-sm text-muted-foreground">{classroom.section}</p>
        )}
        {classroom.teacher && role === 'student' && (
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            {classroom.teacher.full_name}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{classroom.member_count ?? 0} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <BookOpen className="h-4 w-4" />
            <span>Open</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
