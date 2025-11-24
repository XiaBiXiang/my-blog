'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { PageTransition } from '@/components/animations/PageTransition'
import { GlassCard } from '@/components/animations/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

interface AboutContent {
  introduction: string
  email: string
  github: string
  linkedin: string
  technologies: string[]
}

export default function AdminAboutPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const [content, setContent] = useState<AboutContent>({
    introduction: '',
    email: '',
    github: '',
    linkedin: '',
    technologies: [],
  })

  const [newTech, setNewTech] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      checkAdmin()
      loadContent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const checkAdmin = async () => {
    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/')
      return
    }

    setIsAdmin(true)
  }

  const loadContent = async () => {
    // 这里可以从数据库加载内容
    // 暂时使用默认值
    setContent({
      introduction:
        '你好！我是一名充满热情的开发者，专注于创建优雅且功能强大的 Web 应用程序。\n\n我热爱学习新技术，并将它们应用到实际项目中。这个作品集网站展示了我的技能和项目经验。',
      email: 'your@email.com',
      github: 'github.com/yourusername',
      linkedin: 'linkedin.com/in/yourusername',
      technologies: [
        'React',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'Node.js',
        'Supabase',
        'Framer Motion',
        'Git',
      ],
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      // 这里可以保存到数据库
      // 暂时只显示成功消息
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage('保存成功！')
      setTimeout(() => {
        router.push('/about')
      }, 1500)
    } catch {
      setMessage('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !content.technologies.includes(newTech.trim())) {
      setContent({
        ...content,
        technologies: [...content.technologies, newTech.trim()],
      })
      setNewTech('')
    }
  }

  const removeTechnology = (tech: string) => {
    setContent({
      ...content,
      technologies: content.technologies.filter((t) => t !== tech),
    })
  }

  if (loading || !isAdmin) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </PageWrapper>
    )
  }

  return (
    <PageTransition>
      <PageWrapper maxWidth="4xl" className="py-8 sm:py-12 md:py-16">
        <div className="mb-8">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">编辑关于页面</h1>
          <p className="text-foreground/70">管理你的个人信息和简介</p>
        </div>

        <div className="space-y-6">
          {/* 个人简介 */}
          <GlassCard className="p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold">个人简介</h2>
            <textarea
              value={content.introduction}
              onChange={(e) => setContent({ ...content, introduction: e.target.value })}
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="输入你的个人简介..."
            />
          </GlassCard>

          {/* 联系方式 */}
          <GlassCard className="p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold">联系方式</h2>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={content.email}
                onChange={(e) => setContent({ ...content, email: e.target.value })}
                placeholder="your@email.com"
              />
              <Input
                label="GitHub"
                type="text"
                value={content.github}
                onChange={(e) => setContent({ ...content, github: e.target.value })}
                placeholder="github.com/yourusername"
              />
              <Input
                label="LinkedIn"
                type="text"
                value={content.linkedin}
                onChange={(e) => setContent({ ...content, linkedin: e.target.value })}
                placeholder="linkedin.com/in/yourusername"
              />
            </div>
          </GlassCard>

          {/* 技术栈 */}
          <GlassCard className="p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold">技术栈</h2>
            <div className="mb-4 flex gap-2">
              <Input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                placeholder="添加技术..."
              />
              <Button onClick={addTechnology}>添加</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {content.technologies.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm"
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => removeTechnology(tech)}
                    className="text-foreground/50 hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/about')}>
              取消
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              保存更改
            </Button>
          </div>

          {message && (
            <div
              className={`rounded-lg p-4 text-center ${
                message.includes('成功')
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </PageWrapper>
    </PageTransition>
  )
}
