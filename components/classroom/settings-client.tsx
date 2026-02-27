'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
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

export function SettingsClient({
  classroomId,
  classroom,
  updateClassroom,
  deleteClassroom,
}: {
  classroomId: string
  classroom: {
    name: string
    subject: string | null
    section: string | null
    room: string | null
    description: string | null
  }
  updateClassroom: (formData: FormData) => Promise<void>
  deleteClassroom: () => Promise<void>
}) {
  const { t } = useTranslation()
  const [deleting, setDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 text-base font-semibold text-foreground">{t('classroom.settings.title')}</h2>
        <form action={updateClassroom} className="space-y-4">
          <input type="hidden" name="id" value={classroomId} />
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('classroom.fields.name')}</Label>
            <Input id="name" name="name" defaultValue={classroom.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">{t('classroom.fields.subject')}</Label>
            <Input id="subject" name="subject" defaultValue={classroom.subject ?? ''} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="section">{t('classroom.fields.section')}</Label>
              <Input id="section" name="section" defaultValue={classroom.section ?? ''} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room">{t('classroom.fields.room')}</Label>
              <Input id="room" name="room" defaultValue={classroom.room ?? ''} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">{t('classroom.fields.description')}</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={classroom.description ?? ''}
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">{t('common.save_changes')}</Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h2 className="text-base font-semibold text-destructive">{t('classroom.settings.danger_zone')}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {t('classroom.settings.danger_body')}
        </p>
        <AlertDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            if (deleting) return
            setDeleteOpen(open)
          }}
        >
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              {t('classroom.settings.delete_classroom')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('classroom.settings.delete_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('classroom.settings.delete_description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>{t('common.cancel')}</AlertDialogCancel>
              <form action={deleteClassroom}>
                <AlertDialogAction asChild>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={(e) => {
                      e.preventDefault()
                      if (deleting) return
                      setDeleting(true)
                      setDeleteOpen(true)
                      const form = e.currentTarget.closest('form')
                      form?.requestSubmit()
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-all hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <Spinner className="text-destructive-foreground" />
                        {t('common.submitting')}
                      </>
                    ) : (
                      t('classroom.settings.delete_classroom')
                    )}
                  </button>
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
