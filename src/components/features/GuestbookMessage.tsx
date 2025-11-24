'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GuestbookMessageWithUser } from './Guestbook'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/animations/FadeIn'

interface GuestbookMessageProps {
  message: GuestbookMessageWithUser
  currentUserId?: string
  currentUserRole?: 'user' | 'admin'
  onDelete: (messageId: string) => Promise<void>
}

export function GuestbookMessage({
  message,
  currentUserId,
  currentUserRole = 'user',
  onDelete,
}: GuestbookMessageProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthor = currentUserId === message.user_id
  const isCurrentUserAdmin = currentUserRole === 'admin'
  const canDelete = isAuthor || isCurrentUserAdmin

  const handleDelete = async () => {
    if (!confirm('确定要删除这条留言吗？')) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      await onDelete(message.id)
    } catch (err) {
      console.error('Error deleting message:', err)
      setError('删除失败，请重试')
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return '刚刚'
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} 分钟前`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} 小时前`
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} 天前`
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  const displayName = message.profiles?.display_name || message.profiles?.email || '匿名用户'
  const avatarUrl = message.profiles?.avatar_url

  return (
    <FadeIn>
      <div className="rounded-lg border border-border bg-background/30 p-3 backdrop-blur-sm transition-colors hover:border-primary/50 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 sm:h-10 sm:w-10">
                <span className="text-base font-semibold text-primary sm:text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-col gap-1 sm:mb-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium sm:text-base">{displayName}</span>
                {message.profiles?.role === 'admin' && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-xs text-primary sm:px-2">
                    管理员
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-xs sm:text-sm">
                {formatDate(message.created_at)}
              </span>
            </div>

            <p className="whitespace-pre-wrap break-words text-sm text-foreground sm:text-base">
              {message.content}
            </p>

            {error && <p className="mt-2 text-xs text-red-500 sm:text-sm">{error}</p>}
          </div>

          {/* Delete button */}
          {canDelete && (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 sm:text-sm"
              >
                {isDeleting ? '删除中...' : '删除'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  )
}
