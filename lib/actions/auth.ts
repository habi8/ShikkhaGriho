'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '../supabase/admin'
import { purgeClassroomForAccount } from '@/lib/actions/classroom'

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
  const { data: teacherClassrooms } = await admin
    .from('classrooms')
    .select('id')
    .eq('teacher_id', user.id)

  if (teacherClassrooms?.length) {
    for (const classroom of teacherClassrooms) {
      await purgeClassroomForAccount(classroom.id)
    }
  }

  await admin.from('classroom_members').delete().eq('student_id', user.id)
  await admin.from('profiles').delete().eq('id', user.id)

  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    throw error
  }

  redirect('/')
}
