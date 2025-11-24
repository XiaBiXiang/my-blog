'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/animations/GlassCard'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface TimeCapsule {
  id: string
  title: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
}

interface TimeCapsuleProps {
  isAdmin?: boolean
}

export function TimeCapsule({ isAdmin = false }: TimeCapsuleProps) {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const { isAdmin: userIsAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    loadCapsules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCapsules = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('time_capsule')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCapsules(data || [])
    } catch (err) {
      console.error('Error loading capsules:', err)
      setError('加载时间胶囊失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个时间胶囊吗？')) return

    try {
      const { error } = await supabase.from('time_capsule').delete().eq('id', id)

      if (error) throw error
      setCapsules(capsules.filter((c) => c.id !== id))
    } catch (err) {
      console.error('Error deleting capsule:', err)
      alert('删除时间胶囊失败，请稍后重试')
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/capsule/edit/${id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground text-lg">Loading time capsules...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="text-lg text-red-500">{error}</div>
          <Button onClick={loadCapsules} variant="secondary">
            重试
          </Button>
        </div>
      </div>
    )
  }

  if (capsules.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4 text-lg">No time capsules yet</p>
          {userIsAdmin && (
            <Button onClick={() => router.push('/admin/capsule/new')}>Create First Capsule</Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {capsules.map((capsule, index) => (
        <FadeIn key={capsule.id} delay={index * 0.1}>
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl font-bold">{capsule.title}</h2>
                  <p className="text-muted-foreground text-sm">
                    {new Date(capsule.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {isAdmin && userIsAdmin && (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(capsule.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(capsule.id)}
                      className="bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {capsule.image_url && (
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <Image
                    src={capsule.image_url}
                    alt={capsule.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: capsule.content }}
              />
            </div>
          </GlassCard>
        </FadeIn>
      ))}
    </div>
  )
}
