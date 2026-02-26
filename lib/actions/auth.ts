'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '../supabase/admin'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()

  // Clean up user-linked data first to avoid orphaned rows.
  await admin.from('classroom_members').delete().eq('student_id', user.id)
  await admin.from('classrooms').delete().eq('teacher_id', user.id)
  await admin.from('profiles').delete().eq('id', user.id)

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    throw error
  }

  redirect('/')
}
