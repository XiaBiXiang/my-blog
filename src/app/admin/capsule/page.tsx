'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { TimeCapsule } from '@/components/features/TimeCapsule'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { PageWrapper } from '@/components/layout'

export default function AdminCapsulePage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/capsule')
    }
  }, [isAdmin, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <PageWrapper maxWidth="4xl" className="py-8 sm:py-12 md:py-16">
      <FadeIn>
        <div className="mb-8 sm:mb-12">
          <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold sm:text-4xl">Manage Time Capsules</h1>
            <Button onClick={() => router.push('/admin/capsule/new')} className="w-full sm:w-auto">
              Create New Capsule
            </Button>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">
            Create, edit, and manage your time capsule entries
          </p>
        </div>
      </FadeIn>

      <TimeCapsule isAdmin />
    </PageWrapper>
  )
}
