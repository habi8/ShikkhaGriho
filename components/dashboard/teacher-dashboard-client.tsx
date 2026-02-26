'use client'

import { useTranslation } from 'react-i18next'
import { Classroom } from '@/types'
import { ClassroomCard } from '@/components/classroom-card'
import { CreateClassroomDialog } from '@/components/create-classroom-dialog'
import { EmptyState } from '@/components/empty-state'
import { Plus } from 'lucide-react'

export function TeacherDashboardClient({
  firstName,
  classrooms,
}: {
  firstName: string
  classrooms: Classroom[]
}) {
  const { t } = useTranslation()
  const count = classrooms.length

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <div
        className="mb-8 rounded-2xl px-7 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between fade-in-up"
        style={{ background: 'linear-gradient(120deg, #2E8B57 0%, #228B22 100%)' }}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {t('dashboard.teacher.title')}
          </p>
          <h1 className="text-3xl font-bold text-white">
            {t('dashboard.teacher.welcome', { name: firstName })}
          </h1>
          <p className="mt-1.5 text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {t('dashboard.teacher.classroom_count', { count })}
          </p>
        </div>
        <CreateClassroomDialog triggerClassName="bg-white text-[#2E8B57] hover:bg-white/90 shadow-sm" />
      </div>

      {count === 0 ? (
        <EmptyState
          title={t('dashboard.teacher.empty_title')}
          description={t('dashboard.teacher.empty_description')}
          action={<CreateClassroomDialog />}
          icon={<Plus className="h-7 w-7" />}
          className="fade-in-up"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom, index) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              role="teacher"
              animationDelayMs={80 + index * 70}
            />
          ))}
        </div>
      )}
    </div>
  )
}
