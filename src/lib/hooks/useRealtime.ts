'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'

interface UseRealtimeOptions<T> {
  table: string
  onInsert?: (record: T) => void
  onUpdate?: (record: T) => void
  onDelete?: (record: { id: string }) => void
  onError?: (error: Error) => void
}

export function useRealtime<T>({
  table,
  onInsert,
  onUpdate,
  onDelete,
  onError,
}: UseRealtimeOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>(
    'connecting'
  )
  const [retryCount, setRetryCount] = useState(0)
  const supabase = createClient()

  const connect = useCallback(() => {
    const realtimeChannel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        (payload) => {
          try {
            if (payload.eventType === 'INSERT' && onInsert) {
              onInsert(payload.new as T)
            } else if (payload.eventType === 'UPDATE' && onUpdate) {
              onUpdate(payload.new as T)
            } else if (payload.eventType === 'DELETE' && onDelete) {
              onDelete(payload.old as { id: string })
            }
          } catch (error) {
            console.error('Error handling realtime event:', error)
            onError?.(error instanceof Error ? error : new Error('Unknown realtime error'))
          }
        }
      )
      .subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          setStatus('connected')
          setRetryCount(0)
        } else if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
          setStatus('error')
          const error = new Error('Realtime channel error')
          console.error('Realtime subscription error:', error)
          onError?.(error)

          // Retry with exponential backoff
          if (retryCount < 5) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)
            setTimeout(() => {
              setRetryCount((prev) => prev + 1)
              supabase.removeChannel(realtimeChannel)
              connect()
            }, delay)
          }
        } else if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
          setStatus('disconnected')
          const error = new Error('Realtime connection timed out')
          console.error('Realtime timeout:', error)
          onError?.(error)

          // Retry connection
          if (retryCount < 5) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1)
              supabase.removeChannel(realtimeChannel)
              connect()
            }, 2000)
          }
        } else if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
          setStatus('disconnected')
        }
      })

    setChannel(realtimeChannel)
    return realtimeChannel
  }, [table, onInsert, onUpdate, onDelete, onError, supabase, retryCount])

  useEffect(() => {
    const realtimeChannel = connect()

    return () => {
      supabase.removeChannel(realtimeChannel)
    }
  }, [connect, supabase])

  return { channel, status, retryCount }
}
