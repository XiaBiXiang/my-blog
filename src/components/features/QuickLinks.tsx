'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/animations/GlassCard'

const links = [
  { href: '/guestbook', label: '📝 留言板', description: '留下你的足迹' },
  { href: '/about', label: '👤 关于我', description: '了解更多' },
]

export function QuickLinks() {
  return (
    <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <GlassCard className="flex h-full flex-col items-center justify-center p-4 text-center transition-transform duration-300 active:scale-95 sm:p-6 md:hover:scale-105">
            <div className="mb-2 text-2xl sm:text-3xl">{link.label.split(' ')[0]}</div>
            <h3 className="mb-1 text-sm font-semibold sm:text-base">{link.label.split(' ')[1]}</h3>
            <p className="text-xs text-foreground/60 sm:text-sm">{link.description}</p>
          </GlassCard>
        </Link>
      ))}
    </div>
  )
}
