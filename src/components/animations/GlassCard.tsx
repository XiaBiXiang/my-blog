import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface GlassCardProps {
  children: ReactNode
  className?: string
  blur?: number
  opacity?: number
}

export function GlassCard({ children, className, blur = 10, opacity = 0.1 }: GlassCardProps) {
  return (
    <div
      className={cn('glass-card rounded-2xl p-6', className)}
      style={{
        backdropFilter: `blur(${blur}px)`,
        background: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {children}
    </div>
  )
}
