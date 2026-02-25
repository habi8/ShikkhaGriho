import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { UserRole } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const role = user.user_metadata?.role as UserRole
  const userId = user.id

  // Fetch classrooms for the sidebar
  let classrooms: { id: string; name: string; cover_color: string }[] = []

  if (role === 'teacher') {
    const { data } = await supabase
      .from('classrooms')
      .select('id, name, cover_color')
      .eq('teacher_id', userId)
      .order('created_at', { ascending: false })
    classrooms = data ?? []
  } else {
    const { data } = await supabase
      .from('classroom_members')
      .select('classrooms(id, name, cover_color)')
      .eq('student_id', userId)
    classrooms = (data ?? [])
      .map((m: any) => m.classrooms)
      .filter(Boolean)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar role={role} userId={userId} classrooms={classrooms} />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  )
}
