import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const role = user.user_metadata?.role as string
  const fullName = profile?.full_name ?? user.user_metadata?.full_name ?? 'User'
  const createdAt = profile?.created_at ?? user.created_at

  // Count classrooms
  let classroomCount = 0
  if (role === 'teacher') {
    const { count } = await supabase
      .from('classrooms')
      .select('id', { count: 'exact', head: true })
      .eq('teacher_id', user.id)
    classroomCount = count ?? 0
  } else {
    const { count } = await supabase
      .from('classroom_members')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    classroomCount = count ?? 0
  }

  return (
    <div className="p-6 sm:p-8 max-w-xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Profile</h1>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {initials(fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{fullName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              <Badge
                variant="secondary"
                className="mt-2 capitalize"
              >
                {role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">
                {role === 'teacher' ? 'Classrooms created' : 'Classrooms enrolled'}
              </dt>
              <dd className="mt-1 text-2xl font-bold text-foreground">{classroomCount}</dd>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <dt className="text-xs text-muted-foreground">Member since</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">
                {format(new Date(createdAt), 'dd MMM yyyy')}
              </dd>
            </div>
          </dl>

          <div className="border-t border-border pt-4">
            <form action={signOut}>
              <Button type="submit" variant="outline" className="gap-2 w-full sm:w-auto">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
