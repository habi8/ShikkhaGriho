'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
  const colors = ['#1e40af','#15803d','#b45309','#9f1239','#6d28d9','#0e7490']
  const cover_color = colors[Math.floor(Math.random() * colors.length)]
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

  const { data: classroom, error: classroomError } = await supabase
    .from('classrooms')
    .select('id')
    .eq('invite_code', invite_code)
    .single()

  if (classroomError || !classroom) {
    return { error: 'Invalid invite code. Please check and try again.' }
  }

  const { error: memberError } = await supabase
    .from('classroom_members')
    .insert({ classroom_id: classroom.id, user_id: user.id })

  if (memberError && memberError.code !== '23505') {
    return { error: 'Could not join classroom. You may already be a member.' }
  }

  revalidatePath('/student-dashboard')
  redirect(`/classroom/${classroom.id}`)
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
  await supabase.from('announcements').delete().eq('id', id)
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
    .insert({ classroom_id, title, date, created_by: user.id, is_open: true })
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

export async function removeMember(user_id: string, classroom_id: string) {
  const supabase = await createClient()
  await supabase
    .from('classroom_members')
    .delete()
    .eq('user_id', user_id)
    .eq('classroom_id', classroom_id)
  revalidatePath(`/classroom/${classroom_id}`)
}

export async function deleteClassroom(classroom_id: string) {
  const supabase = await createClient()
  await supabase.from('classrooms').delete().eq('id', classroom_id)
  revalidatePath('/teacher-dashboard')
  redirect('/teacher-dashboard')
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  revalidatePath('/notifications')
}
