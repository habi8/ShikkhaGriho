'use client'

import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const typeIcons: Record<string, string> = {
    announcement: '📢',
    attendance: '✅',
    comment: '💬',
    info: 'ℹ️',
}

interface NotificationBellProps {
    userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useRealtimeNotifications(userId)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="relative flex items-center justify-center rounded-xl p-2.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
                    aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-in zoom-in-50">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent
                side="right"
                align="start"
                sideOffset={12}
                className="w-80 p-0 rounded-xl shadow-2xl border-border/50"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Notification list */}
                <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.slice(0, 20).map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        'group relative px-4 py-3 transition-colors hover:bg-muted/50',
                                        !n.is_read && 'bg-primary/[0.03]'
                                    )}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <span className="mt-0.5 text-base shrink-0">
                                            {typeIcons[n.type] ?? typeIcons.info}
                                        </span>

                                        <div className="flex-1 min-w-0">
                                            {/* Title */}
                                            <p className={cn(
                                                'text-sm leading-snug',
                                                n.is_read ? 'text-muted-foreground' : 'font-semibold text-foreground'
                                            )}>
                                                {n.title}
                                            </p>

                                            {/* Body */}
                                            {n.body && (
                                                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {n.body}
                                                </p>
                                            )}

                                            {/* Footer: time + actions */}
                                            <div className="mt-1.5 flex items-center gap-2">
                                                <span className="text-[11px] text-muted-foreground/70">
                                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                </span>

                                                {n.link && (
                                                    <Link
                                                        href={n.link}
                                                        onClick={() => { if (!n.is_read) markAsRead(n.id) }}
                                                        className="text-[11px] font-medium text-primary hover:underline"
                                                    >
                                                        View →
                                                    </Link>
                                                )}

                                                {!n.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(n.id)}
                                                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Unread dot */}
                                        {!n.is_read && (
                                            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t border-border px-4 py-2.5">
                        <Link href="/notifications" className="block">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs font-medium text-muted-foreground hover:text-foreground"
                            >
                                View all notifications
                            </Button>
                        </Link>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
