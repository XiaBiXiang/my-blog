'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state
  useAuth()

  return <>{children}</>
}
