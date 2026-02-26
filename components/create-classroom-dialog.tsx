'use client'

import { useState, useTransition } from 'react'
import { createClassroom } from '@/lib/actions/classroom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const CLASSROOM_COLORS = [
  '#1e40af', // Blue
  '#15803d', // Green
  '#b45309', // Orange
  '#9f1239', // Red
  '#6d28d9', // Purple
  '#0e7490', // Cyan
  '#be185d', // Pink
  '#0f766e', // Teal
  // Gradients
  'linear-gradient(135deg, #16A34A 0%, #22C55E 55%, #86EFAC 100%)',
  'linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #93C5FD 100%)',
  'linear-gradient(135deg, #9F1239 0%, #DB2777 55%, #FBCFE8 100%)',
  'linear-gradient(135deg, #0F766E 0%, #14B8A6 55%, #99F6E4 100%)',
  'linear-gradient(135deg, #92400E 0%, #F59E0B 55%, #FDE68A 100%)',
  'linear-gradient(135deg, #4C1D95 0%, #7C3AED 55%, #C4B5FD 100%)',
  'linear-gradient(135deg, #14532D 0%, #22C55E 60%, #ECFDF5 100%)',
]

export function CreateClassroomDialog({ triggerClassName, triggerVariant = "default" }: { triggerClassName?: string, triggerVariant?: "default" | "secondary" | "outline" | "ghost" }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [selectedColor, setSelectedColor] = useState(CLASSROOM_COLORS[0])
  const { t } = useTranslation()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await createClassroom(formData)
        // redirect() in the action throws — if we reach here it somehow failed silently
      } catch (err: any) {
        // Next.js redirect() throws a special NEXT_REDIRECT error — let it propagate
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        setError(t('errors.generic_try_again'))
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={cn("gap-2 text-base font-semibold px-5 py-2.5 transition-all hover:scale-[1.02]", triggerClassName)}>
          <Plus className="h-5 w-5" />
          {t('classroom.create_title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('classroom.create_new')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-base">{t('classroom.fields.name')}</Label>
            <Input id="name" name="name" placeholder={t('classroom.placeholders.name')} required className="text-base h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-base">{t('classroom.fields.subject')}</Label>
            <Input id="subject" name="subject" placeholder={t('classroom.placeholders.subject')} className="text-base h-10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="section" className="text-base">{t('classroom.fields.section')}</Label>
              <Input id="section" name="section" placeholder={t('classroom.placeholders.section')} className="text-base h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room" className="text-base">{t('classroom.fields.room')}</Label>
              <Input id="room" name="room" placeholder={t('classroom.placeholders.room')} className="text-base h-10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-base">{t('classroom.fields.description')}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder={t('classroom.placeholders.description')}
              rows={2}
              className="text-base"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <Label className="text-base">{t('classroom.fields.theme_color')}</Label>
            <div className="flex flex-wrap gap-3">
              {CLASSROOM_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition-all hover:scale-110",
                    selectedColor === color ? "ring-2 ring-primary scale-110 shadow-md" : "hover:ring-2 hover:ring-border opacity-90"
                  )}
                  style={{ background: color }}
                  aria-label={t('classroom.select_color', { color })}
                >
                  {selectedColor === color && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
            <input type="hidden" name="cover_color" value={selectedColor} />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-base">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isPending} className="text-base gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? t('classroom.creating') : t('common.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
