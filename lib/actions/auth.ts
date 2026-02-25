'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/types'

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as UserRole

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
      data: { full_name, role },
    },
  })

  if (error) {
    return redirect(`/auth/error?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/auth/sign-up-success')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect(`/auth/error?message=${encodeURIComponent(error.message)}`)
  }

  const role = data.user?.user_metadata?.role as UserRole
  if (role === 'teacher') {
    redirect('/teacher-dashboard')
  } else {
    redirect('/student-dashboard')
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
