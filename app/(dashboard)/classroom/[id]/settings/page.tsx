import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { deleteClassroom } from '@/lib/actions/classroom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { revalidatePath } from 'next/cache'
import { AlertTriangle } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

async function updateClassroom(formData: FormData) {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const id = formData.get('id') as string
  await supabase.from('classrooms').update({
    name: formData.get('name'),
    subject: formData.get('subject'),
    section: formData.get('section'),
    room: formData.get('room'),
    description: formData.get('description'),
  }).eq('id', id)
  revalidatePath(`/classroom/${id}`)
  revalidatePath('/teacher-dashboard')
}

export default async function SettingsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('*')
    .eq('id', id)
    .single()

  if (!classroom || classroom.teacher_id !== user.id) redirect(`/classroom/${id}`)

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-8">
      {/* Edit details */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 text-base font-semibold text-foreground">Classroom details</h2>
        <form action={updateClassroom} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <div className="space-y-1.5">
            <Label htmlFor="name">Class name</Label>
            <Input id="name" name="name" defaultValue={classroom.name} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" defaultValue={classroom.subject ?? ''} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="section">Section</Label>
              <Input id="section" name="section" defaultValue={classroom.section ?? ''} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="room">Room</Label>
              <Input id="room" name="room" defaultValue={classroom.room ?? ''} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={classroom.description ?? ''}
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">Save changes</Button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h2 className="text-base font-semibold text-destructive">Danger zone</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Deleting this classroom is permanent. All announcements, comments, attendance records,
          and member data will be removed. This action cannot be undone.
        </p>
        <form action={async () => { 'use server'; await deleteClassroom(id) }}>
          <Button type="submit" variant="destructive" size="sm">
            Delete classroom
          </Button>
        </form>
      </div>
    </div>
  )
}
