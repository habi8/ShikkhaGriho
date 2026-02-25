'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Announcement } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AnnouncementCardProps {
  announcement: Announcement
  classroomId: string
  currentUserId: string
  isTeacher: boolean
  onDelete: (id: string, classroom_id: string) => Promise<void>
  onComment: (formData: FormData) => Promise<void>
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function AnnouncementCard({
  announcement,
  classroomId,
  currentUserId,
  isTeacher,
  onDelete,
  onComment,
}: AnnouncementCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const canDelete = isTeacher || announcement.author_id === currentUserId
  const comments = announcement.comments ?? []

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Author row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials(announcement.author?.full_name ?? null)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {announcement.author?.full_name ?? 'Unknown'}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {canDelete && (
          <button
            aria-label="Delete announcement"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true)
              await onDelete(announcement.id, classroomId)
            }}
            className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="mt-4 text-sm text-foreground leading-relaxed whitespace-pre-line">
        {announcement.content}
      </p>

      {/* Comments toggle */}
      <div className="mt-4 border-t border-border pt-3">
        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
          {showComments ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {showComments && (
          <div className="mt-3 space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {initials(comment.author?.full_name ?? null)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-lg bg-muted px-3 py-2">
                  <p className="text-xs font-semibold text-foreground">
                    {comment.author?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Add comment */}
            <form action={onComment} className="flex gap-2 mt-2">
              <input type="hidden" name="announcement_id" value={announcement.id} />
              <input type="hidden" name="classroom_id" value={classroomId} />
              <Input
                name="content"
                placeholder="Add a comment..."
                required
                className="h-8 text-xs"
              />
              <Button type="submit" size="sm" className="h-8 text-xs px-3">
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
