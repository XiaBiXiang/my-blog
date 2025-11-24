'use client'

import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { cn } from '@/lib/utils/cn'

interface PageWrapperProps {
  children: ReactNode
  className?: string
  includeHeader?: boolean
  includeFooter?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '4xl': 'max-w-4xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

export function PageWrapper({
  children,
  className,
  includeHeader = true,
  includeFooter = true,
  maxWidth = '7xl',
}: PageWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {includeHeader && <Header />}

      <main className={cn('flex-1', className)}>
        <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthClasses[maxWidth])}>
          {children}
        </div>
      </main>

      {includeFooter && <Footer />}
    </div>
  )
}
