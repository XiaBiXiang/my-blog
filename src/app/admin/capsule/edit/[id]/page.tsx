'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { CapsuleEditor } from '@/components/features/CapsuleEditor'
import { FadeIn } from '@/components/animations/FadeIn'

export default function EditCapsulePage() {
  const { isAdmin, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const capsuleId = params.id as string

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
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <FadeIn>
        <CapsuleEditor capsuleId={capsuleId} />
      </FadeIn>
    </div>
  )
}
