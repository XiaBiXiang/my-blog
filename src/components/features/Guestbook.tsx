'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { GuestbookForm } from './GuestbookForm'
import { GuestbookMessage } from './GuestbookMessage'
import { Database } from '@/lib/types/database.types'

type GuestbookRow = Database['public']['Tables']['guestbook']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export interface GuestbookMessageWithUser extends GuestbookRow {
  profiles: Pick<ProfileRow, 'email' | 'avatar_url' | 'display_name' | 'role'> | null
}

export function Guestbook() {
  const { user, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<GuestbookMessageWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<'user' | 'admin'>('user')
  const supabase = createClient()

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select(
          `
          *,
          profiles:user_id (
            email,
            avatar_url,
            display_name,
            role
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data as GuestbookMessageWithUser[])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('无法加载留言')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchMessages()

    // Fetch current user's role if logged in
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setCurrentUserRole(data.role)
          }
        })
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel('guestbook-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guestbook',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the new message with user data
            supabase
              .from('guestbook')
              .select(
                `
                *,
                profiles:user_id (
                  email,
                  avatar_url,
                  display_name,
                  role
                )
              `
              )
              .eq('id', payload.new.id)
              .single()
              .then(({ data }) => {
                if (data) {
                  setMessages((prev) => [data as GuestbookMessageWithUser, ...prev])
                }
              })
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchMessages, user])

  const handleSubmit = async (content: string) => {
    if (!user) {
      throw new Error('必须登录才能发表留言')
    }

    const { error } = await supabase.from('guestbook').insert({
      user_id: user.id,
      content,
    })

    if (error) throw error
  }

  const handleDelete = async (messageId: string) => {
    const { error } = await supabase.from('guestbook').delete().eq('id', messageId)

    if (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            setError(null)
            setLoading(true)
            fetchMessages()
          }}
          className="mt-4 text-primary hover:underline"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {user ? (
        <GuestbookForm onSubmit={handleSubmit} />
      ) : (
        <div className="rounded-lg bg-muted/50 py-4 text-center sm:py-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            请先{' '}
            <a href="/login" className="text-primary hover:underline">
              登录
            </a>{' '}
            后再发表留言
          </p>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm sm:py-12 sm:text-base">
            还没有留言，来发表第一条吧！
          </div>
        ) : (
          messages.map((message) => (
            <GuestbookMessage
              key={message.id}
              message={message}
              currentUserId={user?.id}
              currentUserRole={currentUserRole}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
