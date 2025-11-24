'use client'

import { Suspense } from 'react'
import { Guestbook } from '@/components/features/Guestbook'
import { FadeIn } from '@/components/animations/FadeIn'
import { GlassCard } from '@/components/animations/GlassCard'
import { PageWrapper } from '@/components/layout'
import { PageTransition } from '@/components/animations/PageTransition'

export default function GuestbookPage() {
  return (
    <PageTransition>
      <PageWrapper maxWidth="4xl" className="py-8 sm:py-12 md:py-16">
        <FadeIn>
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">留言板</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              欢迎在这里留下你的想法和问候
            </p>
          </div>
        </FadeIn>

        <GlassCard className="p-4 sm:p-6 md:p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            }
          >
            <Guestbook />
          </Suspense>
        </GlassCard>
      </PageWrapper>
    </PageTransition>
  )
}
