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

export function JoinClassroomDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const result = await joinClassroom(formData)
        if (result?.error) {
          setError(result.error)
        }
        // if redirect() is called inside, it throws NEXT_REDIRECT which propagates correctly
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        setError(err?.message ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setError(null) }}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base font-semibold px-5 py-2.5">
          <Plus className="h-5 w-5" />
          Join Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">Join a classroom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="invite_code" className="text-base">Class code</Label>
            <Input
              id="invite_code"
              name="invite_code"
              placeholder="e.g. ABC1234"
              required
              maxLength={10}
              className="uppercase tracking-widest text-center text-lg font-mono h-12"
              onChange={e => { e.target.value = e.target.value.toUpperCase() }}
            />
            <p className="text-sm text-muted-foreground">
              Ask your teacher for the 7-character class code.
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="text-base gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Joining...' : 'Join'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
