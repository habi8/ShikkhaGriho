'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeNotifications, RealtimeNotification } from '@/hooks/use-realtime-notifications'
import { EmptyState } from '@/components/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const typeIcons: Record<string, string> = {
  announcement: '📢',
  attendance: '✅',
  comment: '💬',
  info: 'ℹ️',
}

export default function NotificationsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)

  // Get user ID on mount
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUserId(user.id)
    })
  }, [router])

  if (!userId) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <NotificationsContent userId={userId} />
}

function NotificationsContent({ userId }: { userId: string }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useRealtimeNotifications(userId)

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="gap-1.5 text-sm"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="You'll see classroom updates and announcements here."
          icon={<Bell className="h-7 w-7" />}
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                'group relative rounded-xl border p-4 transition-all',
                n.is_read
                  ? 'border-border bg-card'
                  : 'border-primary/20 bg-primary/5'
              )}
            >
              <div className="flex gap-3">
                {/* Type icon */}
                <span className="mt-0.5 text-lg shrink-0">
                  {typeIcons[n.type] ?? typeIcons.info}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      'text-sm leading-snug',
                      n.is_read ? 'text-muted-foreground' : 'font-semibold text-foreground'
                    )}>
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>

                  {n.body && (
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {n.body}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>

                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => { if (!n.is_read) markAsRead(n.id) }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Go to classroom →
                      </Link>
                    )}

                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Mark read
                      </button>
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
