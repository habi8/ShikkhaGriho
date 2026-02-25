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
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Cover */}
      <div
        className="flex h-28 items-end p-4"
        style={{ backgroundColor: classroom.cover_color }}
      >
        <h3 className="text-lg font-bold text-white leading-snug text-balance line-clamp-2">
          {classroom.name}
        </h3>
      </div>

      {/* Body */}
      <div className="p-4">
        {classroom.subject && (
          <p className="text-sm text-muted-foreground mb-1">{classroom.subject}</p>
        )}
        {classroom.section && (
          <p className="text-xs text-muted-foreground">{classroom.section}</p>
        )}
        {classroom.teacher && role === 'student' && (
          <p className="mt-2 text-xs text-muted-foreground">
            {classroom.teacher.full_name}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{classroom.member_count ?? 0} students</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Open</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
