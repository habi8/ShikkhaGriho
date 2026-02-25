import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { BookOpen, Hash, Users, Calendar, MapPin } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AboutPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: classroom } = await supabase
    .from('classrooms')
    .select('*, profiles!classrooms_teacher_id_fkey(id, full_name)')
    .eq('id', id)
    .single()

  const { count: memberCount } = await supabase
    .from('classroom_members')
    .select('id', { count: 'exact', head: true })
    .eq('classroom_id', id)

  if (!classroom) redirect('/teacher-dashboard')

  const isTeacher = classroom.teacher_id === user.id

  const details = [
    { icon: <BookOpen className="h-4 w-4" />, label: 'Subject', value: classroom.subject },
    { icon: <Hash className="h-4 w-4" />, label: 'Section', value: classroom.section },
    { icon: <MapPin className="h-4 w-4" />, label: 'Room', value: classroom.room },
    { icon: <Users className="h-4 w-4" />, label: 'Students enrolled', value: memberCount?.toString() },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: 'Created',
      value: format(new Date(classroom.created_at), 'dd MMM yyyy'),
    },
  ].filter((d) => d.value)

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">{classroom.name}</h1>
          {classroom.description && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {classroom.description}
            </p>
          )}
        </div>

        {details.length > 0 && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <span className="mt-0.5 text-muted-foreground">{d.icon}</span>
                <div>
                  <dt className="text-xs text-muted-foreground">{d.label}</dt>
                  <dd className="text-sm font-medium text-foreground">{d.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-1">Teacher</p>
          <p className="text-sm font-semibold text-foreground">
            {classroom.profiles?.full_name ?? 'Unknown'}
          </p>
        </div>

        {isTeacher && classroom.invite_code && (
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-1">Invite code</p>
            <div className="flex items-center gap-3">
              <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                {classroom.invite_code}
              </p>
              <Badge variant="secondary" className="text-xs">Share with students</Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
