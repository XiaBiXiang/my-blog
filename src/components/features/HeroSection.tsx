'use client'

import { GlassCard } from '@/components/animations/GlassCard'

export function HeroSection() {
  return (
    <GlassCard className="flex h-full flex-col justify-center p-6 sm:p-8 md:p-10">
      <h1 className="mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-3xl font-bold text-transparent sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl">
        你好，我是开发者
      </h1>
      <p className="mb-4 text-base text-foreground/80 sm:mb-6 sm:text-lg md:text-xl">
        全栈开发者 · 设计爱好者 · 技术探索者
      </p>
      <p className="text-sm text-foreground/60 sm:text-base">
        专注于构建现代化的 Web 应用，热衷于探索新技术和创造优雅的用户体验。
      </p>
    </GlassCard>
  )
}
