'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import { FadeIn } from '@/components/animations/FadeIn'

export interface GridItem {
  id: string
  title: string
  description?: string
  content: ReactNode
  size?: 'small' | 'medium' | 'large' | 'wide'
  className?: string
}

interface BentoGridProps {
  items: GridItem[]
  className?: string
}

// Responsive size classes for different breakpoints
const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-1 md:row-span-2',
  large: 'col-span-1 row-span-1 md:col-span-2 md:row-span-2',
  wide: 'col-span-1 row-span-1 md:col-span-2 md:row-span-1',
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        // Responsive grid configuration
        'grid gap-4 md:gap-6 lg:gap-8',
        // Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        // Responsive row heights
        'auto-rows-[180px] sm:auto-rows-[200px] md:auto-rows-[220px] lg:auto-rows-[240px]',
        className
      )}
    >
      {items.map((item, index) => (
        <FadeIn
          key={item.id}
          delay={index * 100}
          className={cn(
            sizeClasses[item.size || 'small'],
            'group cursor-pointer',
            'transition-all duration-300 ease-out',
            // Responsive hover effects - only on larger screens
            'md:hover:scale-[1.02] md:hover:shadow-2xl',
            // Touch-friendly on mobile
            'active:scale-[0.98]',
            item.className
          )}
        >
          {item.content}
        </FadeIn>
      ))}
    </div>
  )
}
