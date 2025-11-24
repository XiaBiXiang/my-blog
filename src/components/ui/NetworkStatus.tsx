'use client'

import { useNetworkStatus } from '@/lib/hooks/useNetworkStatus'
import { useEffect, useState } from 'react'

/**
 * Network status indicator
 * Shows a banner when user goes offline
 */
export function NetworkStatus() {
  const { isOnline, wasOffline } = useNetworkStatus()
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    if (isOnline && wasOffline) {
      // Show reconnected message briefly
      setShowReconnected(true)
      const timer = setTimeout(() => setShowReconnected(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (isOnline && !showReconnected) {
    return null
  }

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-50 px-4 py-3 text-center text-sm font-medium transition-all duration-300 ${
        isOnline ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
      }`}
    >
      {isOnline ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          网络已恢复连接
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="h-5 w-5 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          网络连接已断开，请检查您的网络
        </div>
      )}
    </div>
  )
}
