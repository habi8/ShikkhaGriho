import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { markNotificationRead } from '@/lib/actions/classroom'
import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const items = notifications ?? []
  const unreadCount = items.filter((n: any) => !n.is_read).length

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        {unreadCount > 0 && (
          <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="You'll see classroom updates and announcements here."
          icon={<Bell className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-2">
          {items.map((n: any) => (
            <div
              key={n.id}
              className={cn(
                'relative rounded-xl border p-4 transition-colors',
                n.is_read
                  ? 'border-border bg-card'
                  : 'border-primary/20 bg-primary/5'
              )}
            >
              {!n.is_read && (
                <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary" />
              )}
              <div className="flex items-start justify-between gap-3 pr-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                    {n.link && (
                      <Link href={n.link} className="text-xs text-primary hover:underline">
                        View
                      </Link>
                    )}
                    {!n.is_read && (
                      <form action={async () => { 'use server'; await markNotificationRead(n.id) }}>
                        <button type="submit" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                          Mark read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
