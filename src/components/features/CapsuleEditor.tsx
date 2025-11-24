'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/animations/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface CapsuleEditorProps {
  capsuleId?: string
}

interface CapsuleData {
  title: string
  content: string
  image_url: string | null
}

export function CapsuleEditor({ capsuleId }: CapsuleEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (capsuleId) {
      loadCapsule()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capsuleId])

  const loadCapsule = async () => {
    if (!capsuleId) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('time_capsule')
        .select('*')
        .eq('id', capsuleId)
        .single()

      if (error) throw error

      setTitle(data.title)
      setContent(data.content)
      setImageUrl(data.image_url || '')
    } catch (err) {
      console.error('Error loading capsule:', err)
      setError('Failed to load time capsule')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `capsule-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from('public').upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('public').getPublicUrl(filePath)

      setImageUrl(publicUrl)
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const capsuleData: CapsuleData = {
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl || null,
      }

      if (capsuleId) {
        // Update existing capsule
        const { error } = await supabase
          .from('time_capsule')
          .update({ ...capsuleData, updated_at: new Date().toISOString() })
          .eq('id', capsuleId)

        if (error) throw error
      } else {
        // Create new capsule
        const { error } = await supabase.from('time_capsule').insert([capsuleData])

        if (error) throw error
      }

      router.push('/admin/capsule')
    } catch (err) {
      console.error('Error saving capsule:', err)
      setError('Failed to save time capsule')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/capsule')
  }

  if (loading && capsuleId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <GlassCard className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            {capsuleId ? 'Edit Time Capsule' : 'Create New Time Capsule'}
          </h2>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter capsule title"
            maxLength={200}
            required
          />
          <p className="text-muted-foreground text-xs">{title.length}/200 characters</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            rows={10}
            className="w-full resize-none rounded-lg border border-border bg-background/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-muted-foreground text-xs">Supports plain text and HTML formatting</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Image (Optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="text-muted-foreground file:text-primary-foreground block w-full text-sm file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-primary/90"
          />
          {uploading && <p className="text-muted-foreground text-sm">Uploading...</p>}
          {imageUrl && (
            <div className="relative mt-4 h-48 w-full max-w-md overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || uploading}>
            {loading ? 'Saving...' : capsuleId ? 'Update Capsule' : 'Create Capsule'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
