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
import { Plus, Loader2 } from 'lucide-react'

export function CreateClassroomDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
        setError(err?.message ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 text-base font-semibold px-5 py-2.5">
          <Plus className="h-5 w-5" />
          Create Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a new classroom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-base">Class name *</Label>
            <Input id="name" name="name" placeholder="e.g. Mathematics Grade 10" required className="text-base h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-base">Subject</Label>
            <Input id="subject" name="subject" placeholder="e.g. Mathematics" className="text-base h-10" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="section" className="text-base">Section</Label>
              <Input id="section" name="section" placeholder="e.g. A" className="text-base h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room" className="text-base">Room</Label>
              <Input id="room" name="room" placeholder="e.g. 101" className="text-base h-10" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of this class..."
              rows={2}
              className="text-base"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="text-base gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
