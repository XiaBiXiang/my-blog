'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Database } from '@/lib/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/animations/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/lib/hooks/useToast'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectEditorProps {
  project?: Project
}

export function ProjectEditor({ project }: ProjectEditorProps) {
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')
  const [content, setContent] = useState(project?.content || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail_url || '')
  const [tags, setTags] = useState<string[]>(project?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '')
  const [demoUrl, setDemoUrl] = useState(project?.demo_url || '')
  const [published, setPublished] = useState(project?.published || false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { showToast } = useToast()
  const supabase = createClient()

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('请上传图片文件', 'error')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过 5MB', 'error')
      return
    }

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('images').getPublicUrl(filePath)

      setThumbnailUrl(publicUrl)
      showToast('图片上传成功', 'success')
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast('图片上传失败，请重试', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      showToast('请输入项目标题', 'error')
      return
    }
    if (!description.trim()) {
      showToast('请输入项目描述', 'error')
      return
    }
    if (!content.trim()) {
      showToast('请输入项目内容', 'error')
      return
    }
    if (!thumbnailUrl) {
      showToast('请上传缩略图', 'error')
      return
    }

    setIsSaving(true)
    try {
      const projectData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        thumbnail_url: thumbnailUrl,
        tags,
        github_url: githubUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        published,
        updated_at: new Date().toISOString(),
      }

      if (project) {
        // Update existing project
        const { error } = await supabase.from('projects').update(projectData).eq('id', project.id)

        if (error) throw error
        showToast('项目已更新', 'success')
      } else {
        // Create new project
        const { error } = await supabase.from('projects').insert([projectData])

        if (error) throw error
        showToast('项目已创建', 'success')
      }

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
      showToast('保存失败，请重试', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Simple rich text toolbar actions
  const insertFormatting = (before: string, after: string = before) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText =
      content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            项目标题 <span className="text-red-500">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入项目标题"
            maxLength={200}
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            项目描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述项目（最多 500 字符）"
            maxLength={500}
            rows={3}
            className="w-full rounded-lg border border-border bg-background/50 px-4 py-2 text-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            缩略图 <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {thumbnailUrl && (
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
                <Image src={thumbnailUrl} alt="Thumbnail preview" fill className="object-cover" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? '上传中...' : thumbnailUrl ? '更换图片' : '上传图片'}
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium">标签</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="输入标签后按回车"
              />
              <Button variant="secondary" onClick={handleAddTag}>
                添加
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-sm text-primary"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary/70">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">
              项目内容 <span className="text-red-500">*</span>
            </label>
            <Button variant="ghost" size="sm" onClick={() => setPreviewMode(!previewMode)}>
              {previewMode ? '编辑' : '预览'}
            </Button>
          </div>

          {!previewMode ? (
            <>
              {/* Simple Toolbar */}
              <div className="mb-2 flex flex-wrap gap-2 rounded-lg border border-border bg-background/50 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<h2>', '</h2>')}
                  title="标题"
                >
                  H2
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<h3>', '</h3>')}
                  title="小标题"
                >
                  H3
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<strong>', '</strong>')}
                  title="粗体"
                >
                  <strong>B</strong>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<em>', '</em>')}
                  title="斜体"
                >
                  <em>I</em>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<p>', '</p>')}
                  title="段落"
                >
                  P
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<ul>\n<li>', '</li>\n</ul>')}
                  title="列表"
                >
                  UL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<a href="URL">', '</a>')}
                  title="链接"
                >
                  Link
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertFormatting('<code>', '</code>')}
                  title="代码"
                >
                  Code
                </Button>
              </div>

              <textarea
                id="content-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入项目详细内容（支持 HTML）"
                rows={15}
                className="w-full rounded-lg border border-border bg-background/50 px-4 py-2 font-mono text-sm text-foreground placeholder:text-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </>
          ) : (
            <div
              className="prose prose-invert max-w-none rounded-lg border border-border bg-background/50 p-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">GitHub 链接</label>
            <Input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              type="url"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">在线演示链接</label>
            <Input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>
        </div>

        {/* Published Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border bg-background/50 text-primary focus:ring-2 focus:ring-primary/20"
          />
          <label htmlFor="published" className="text-sm font-medium">
            发布项目（取消勾选则保存为草稿）
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '保存中...' : project ? '更新项目' : '创建项目'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/projects')}
            disabled={isSaving}
          >
            取消
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}
