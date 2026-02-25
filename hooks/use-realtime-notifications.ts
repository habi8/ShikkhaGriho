'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface RealtimeNotification {
    id: string
    user_id: string
    title: string
    body: string | null
    type: string
    is_read: boolean
    classroom_id: string | null
    link: string | null
    created_at: string
}

export function useRealtimeNotifications(userId: string) {
    const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    // Fetch initial notifications
    const fetchNotifications = useCallback(async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)

        const items = (data ?? []) as RealtimeNotification[]
        setNotifications(items)
        setUnreadCount(items.filter((n) => !n.is_read).length)
    }, [userId])

    useEffect(() => {
        fetchNotifications()

        const supabase = createClient()

        // Subscribe to realtime INSERT events on the notifications table
        const channel = supabase
            .channel('notifications-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Realtime INSERT received:', payload)
                    const newNotification = payload.new as RealtimeNotification
                    setNotifications((prev) => [newNotification, ...prev])
                    setUnreadCount((prev) => prev + 1)
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const updated = payload.new as RealtimeNotification
                    setNotifications((prev) =>
                        prev.map((n) => (n.id === updated.id ? updated : n))
                    )
                    // Recalculate unread count
                    setNotifications((prev) => {
                        setUnreadCount(prev.filter((n) => !n.is_read).length)
                        return prev
                    })
                }
            )
            .subscribe((status, err) => {
                console.log('Realtime Channel Status:', status, err)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, fetchNotifications])

    const markAsRead = useCallback(async (id: string) => {
        const supabase = createClient()
        await supabase.from('notifications').update({ is_read: true }).eq('id', id)
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
    }, [])

    const markAllAsRead = useCallback(async () => {
        const supabase = createClient()
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false)
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
    }, [userId])

    return { notifications, unreadCount, markAsRead, markAllAsRead, refetch: fetchNotifications }
}
