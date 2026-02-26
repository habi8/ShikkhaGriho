import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { deleteClassroom } from '@/lib/actions/classroom'
import { SettingsClient } from '@/components/classroom/settings-client'

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

  async function handleDelete() {
    'use server'
    await deleteClassroom(id)
  }

  return (
    <SettingsClient
      classroomId={id}
      classroom={classroom}
      updateClassroom={updateClassroom}
      deleteClassroom={handleDelete}
    />
  )
}
