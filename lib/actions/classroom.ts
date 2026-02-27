'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function generateInviteCode(length = 7): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createClassroom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const subject = formData.get('subject') as string
  const section = formData.get('section') as string
  const room = formData.get('room') as string
  const customColor = formData.get('cover_color') as string
  const colors = [
    '#FFF3E0',
    '#E5E7EB',
    '#F1F5F9',
    '#EADBC8',
    '#EDE9FE',
    '#FCE7F3',
    '#FFE8D6',
    '#E0F2FE',
    '#FDE68A',
    '#FBCFE8',
    '#C7D2FE',
    '#BFDBFE',
    '#A7F3D0',
    '#F5D0A9',
    '#D8B4FE',
    '#C4B5FD',
  ]
  const cover_color = customColor || colors[Math.floor(Math.random() * colors.length)]
  const invite_code = generateInviteCode()

  const { data, error } = await supabase
    .from('classrooms')
    .insert({ name, description, subject, section, room, cover_color, invite_code, teacher_id: user.id })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/teacher-dashboard')
  redirect(`/classroom/${data.id}`)
}

export async function joinClassroom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const invite_code = (formData.get('invite_code') as string).toUpperCase().trim()

  // Use RPC to bypass RLS – students aren't members yet so they can't
  // query the classrooms table directly.
  const { data: classroomId, error: lookupError } = await supabase
    .rpc('lookup_classroom_by_invite', { p_invite_code: invite_code })

  if (lookupError || !classroomId) {
    return { errorKey: 'errors.invalid_invite_code' }
  }

  const { error: memberError } = await supabase
    .from('classroom_members')
    .insert({ classroom_id: classroomId, student_id: user.id })

  if (memberError && memberError.code !== '23505') {
    return { errorKey: 'errors.already_member' }
  }

  revalidatePath('/student-dashboard')
  redirect(`/classroom/${classroomId}`)
}

export async function postAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const classroom_id = formData.get('classroom_id') as string
  const content = formData.get('content') as string

  const { error } = await supabase
    .from('announcements')
    .insert({ classroom_id, content, author_id: user.id })

  if (error) throw error
  revalidatePath(`/classroom/${classroom_id}`)
}

export async function deleteAnnouncement(id: string, classroom_id: string) {
  const supabase = await createClient()
  const { error: commentsError } = await supabase
    .from('comments')
    .delete()
    .eq('announcement_id', id)
  if (commentsError) throw commentsError

  const { error } = await supabase.from('announcements').delete().eq('id', id)
  if (error) throw error
  revalidatePath(`/classroom/${classroom_id}`)
}

export async function postComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const announcement_id = formData.get('announcement_id') as string
  const classroom_id = formData.get('classroom_id') as string
  const content = formData.get('content') as string

  await supabase.from('comments').insert({ announcement_id, content, author_id: user.id })
  revalidatePath(`/classroom/${classroom_id}`)
}

export async function createAttendanceSession(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const classroom_id = formData.get('classroom_id') as string
  const title = formData.get('title') as string
  const date = formData.get('date') as string

  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({ classroom_id, title, date, created_by: user.id, teacher_id: user.id, is_open: true })
    .select()
    .single()

  if (error) throw error
  revalidatePath(`/classroom/${classroom_id}`)
  return data
}

export async function markAttendance(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const session_id = formData.get('session_id') as string
  const student_id = formData.get('student_id') as string
  const status = formData.get('status') as 'present' | 'absent' | 'late'
  const classroom_id = formData.get('classroom_id') as string

  await supabase
    .from('attendance_records')
    .upsert({ session_id, student_id, status }, { onConflict: 'session_id,student_id' })

  revalidatePath(`/classroom/${classroom_id}`)
}

export async function closeAttendanceSession(session_id: string, classroom_id: string) {
  const supabase = await createClient()
  await supabase.from('attendance_sessions').update({ is_open: false }).eq('id', session_id)
  revalidatePath(`/classroom/${classroom_id}`)
}

export async function closeAttendanceSessionByForm(formData: FormData) {
  const session_id = formData.get('session_id') as string
  const classroom_id = formData.get('classroom_id') as string
  await closeAttendanceSession(session_id, classroom_id)
}

export async function removeMember(user_id: string, classroom_id: string) {
  const supabase = await createClient()
  await supabase
    .from('classroom_members')
    .delete()
    .eq('student_id', user_id)
    .eq('classroom_id', classroom_id)
  revalidatePath(`/classroom/${classroom_id}`)
}

export async function removeMemberByForm(formData: FormData) {
  const user_id = formData.get('student_id') as string
  const classroom_id = formData.get('classroom_id') as string
  await removeMember(user_id, classroom_id)
}

async function purgeClassroomData(classroom_id: string) {
  const admin = createAdminClient()

  const { data: resources } = await admin
    .from('resources')
    .select('id, file_path')
    .eq('classroom_id', classroom_id)

  if (resources?.length) {
    const paths = resources.map((r) => r.file_path).filter(Boolean) as string[]
    if (paths.length) {
      await admin.storage.from('resources').remove(paths)
    }
  }

  const { data: announcements } = await admin
    .from('announcements')
    .select('id')
    .eq('classroom_id', classroom_id)

  if (announcements?.length) {
    const announcementIds = announcements.map((a) => a.id)
    await admin.from('comments').delete().in('announcement_id', announcementIds)
  }

  const { data: sessions } = await admin
    .from('attendance_sessions')
    .select('id')
    .eq('classroom_id', classroom_id)

  if (sessions?.length) {
    const sessionIds = sessions.map((s) => s.id)
    await admin.from('attendance_records').delete().in('session_id', sessionIds)
  }

  await admin.from('attendance_sessions').delete().eq('classroom_id', classroom_id)
  await admin.from('announcements').delete().eq('classroom_id', classroom_id)
  await admin.from('resources').delete().eq('classroom_id', classroom_id)
  await admin.from('classroom_members').delete().eq('classroom_id', classroom_id)
  await admin.from('classrooms').delete().eq('id', classroom_id)
}

export async function deleteClassroom(classroom_id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: classroom, error } = await supabase
    .from('classrooms')
    .select('id, teacher_id')
    .eq('id', classroom_id)
    .single()

  if (error || !classroom || classroom.teacher_id !== user.id) {
    throw new Error('Not authorized to delete this classroom.')
  }

  await purgeClassroomData(classroom_id)
  revalidatePath('/teacher-dashboard')
  redirect('/teacher-dashboard')
}

export async function purgeClassroomForAccount(classroom_id: string) {
  await purgeClassroomData(classroom_id)
}
export async function leaveClassroom(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const classroom_id = formData.get('classroom_id') as string

  await supabase
    .from('classroom_members')
    .delete()
    .eq('student_id', user.id)
    .eq('classroom_id', classroom_id)

  revalidatePath('/student-dashboard')
  redirect('/student-dashboard')
}
