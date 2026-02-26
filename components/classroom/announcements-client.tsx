'use client'

import { useTranslation } from 'react-i18next'
import { Announcement } from '@/types'
import { postAnnouncement, deleteAnnouncement, postComment } from '@/lib/actions/classroom'
import { AnnouncementCard } from '@/components/classroom/announcement-card'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone } from 'lucide-react'

export function AnnouncementsClient({
  classroomId,
  isTeacher,
  currentUserId,
  announcements,
}: {
  classroomId: string
  isTeacher: boolean
  currentUserId: string
  announcements: Announcement[]
}) {
  const { t } = useTranslation()

  return (
    <div className="p-6 sm:p-8 max-w-5xl flex-1 mx-auto space-y-6 w-full">
      {isTeacher && (
        <form action={postAnnouncement} className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <input type="hidden" name="classroom_id" value={classroomId} />
          <Textarea
            name="content"
            placeholder={t('classroom.announcements.placeholder')}
            required
            rows={3}
            className="mb-3 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm">{t('common.post')}</Button>
          </div>
        </form>
      )}

      {announcements.length === 0 ? (
        <EmptyState
          title={t('classroom.announcements.empty_title')}
          description={isTeacher
            ? t('classroom.announcements.empty_teacher')
            : t('classroom.announcements.empty_student')}
          icon={<Megaphone className="h-7 w-7" />}
        />
      ) : (
        announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            classroomId={classroomId}
            currentUserId={currentUserId}
            isTeacher={isTeacher}
            onDelete={deleteAnnouncement}
            onComment={postComment}
          />
        ))
      )}
    </div>
  )
}
