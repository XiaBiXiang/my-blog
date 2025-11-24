'use client'

import { GlassCard } from '@/components/animations/GlassCard'

export function StatusCard() {
  return (
    <GlassCard className="flex h-full flex-col justify-center p-4 sm:p-6">
      <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500 sm:h-3 sm:w-3" />
        <span className="text-xs font-medium sm:text-sm">当前状态</span>
      </div>
      <p className="text-sm text-foreground/80 sm:text-base">🚀 正在开发新功能</p>
      <p className="mt-1.5 text-xs text-foreground/60 sm:mt-2 sm:text-sm">
        探索 Glassmorphism 设计的无限可能
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-foreground/40 sm:mt-4 sm:gap-2">
        <span>💡 提示：按</span>
        <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">⌘K</kbd>
        <span>打开命令面板</span>
      </div>
    </GlassCard>
  )
}
