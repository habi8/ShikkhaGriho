'use client'

import { useState, useTransition } from 'react'
import { joinClassroom } from '@/lib/actions/classroom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function JoinClassroomDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { t } = useTranslation()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const result = await joinClassroom(formData)
        if (result?.errorKey) {
          setError(t(result.errorKey))
        }
        // if redirect() is called inside, it throws NEXT_REDIRECT which propagates correctly
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        setError(t('errors.generic_try_again'))
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setError(null) }}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base font-semibold px-5 py-2.5">
          <Plus className="h-5 w-5" />
          {t('classroom.join_title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('classroom.join_dialog_title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="invite_code" className="text-base">{t('classroom.fields.invite_code')}</Label>
            <Input
              id="invite_code"
              name="invite_code"
              placeholder={t('classroom.placeholders.invite_code')}
              required
              maxLength={10}
              className="uppercase tracking-widest text-center text-lg font-mono h-12"
              onChange={e => { e.target.value = e.target.value.toUpperCase() }}
            />
            <p className="text-sm text-muted-foreground">
              {t('classroom.invite_help')}
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-base">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isPending} className="text-base gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? t('classroom.joining') : t('common.join')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
