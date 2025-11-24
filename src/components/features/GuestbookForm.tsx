'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface GuestbookFormProps {
  onSubmit: (content: string) => Promise<void>
}

export function GuestbookForm({ onSubmit }: GuestbookFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateContent = (text: string): string | null => {
    // Check if content is empty or only whitespace
    if (!text.trim()) {
      return '留言内容不能为空'
    }

    // Check length (max 500 characters as per database constraint)
    if (text.length > 500) {
      return '留言内容不能超过 500 个字符'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate content
    const validationError = validateContent(content)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(content)
      setContent('') // Clear form on success
    } catch (err) {
      console.error('Error submitting message:', err)
      setError(err instanceof Error ? err.message : '发表留言失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const remainingChars = 500 - content.length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="写下你的想法..."
          className="min-h-[120px] w-full resize-none rounded-lg border border-border bg-background/50 px-4 py-3 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSubmitting}
          maxLength={500}
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            {remainingChars < 100 && (
              <span className={remainingChars < 20 ? 'text-orange-500' : ''}>
                还可以输入 {remainingChars} 个字符
              </span>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? '发表中...' : '发表留言'}
      </Button>
    </form>
  )
}
