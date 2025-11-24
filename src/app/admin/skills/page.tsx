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

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  description?: string
}

export default function AdminSkillsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50,
    description: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      checkAdmin()
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
    loadSkills()
  }

  const loadSkills = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category')
      .order('proficiency', { ascending: false })

    if (!error && data) {
      setSkills(data)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      if (editingSkill) {
        // 更新技能
        const { error } = await supabase
          .from('skills')
          .update({
            name: formData.name,
            category: formData.category,
            proficiency: formData.proficiency,
            description: formData.description || null,
          })
          .eq('id', editingSkill.id)

        if (error) throw error
        setMessage('技能更新成功！')
      } else {
        // 添加新技能
        const { error } = await supabase.from('skills').insert({
          name: formData.name,
          category: formData.category,
          proficiency: formData.proficiency,
          description: formData.description || null,
        })

        if (error) throw error
        setMessage('技能添加成功！')
      }

      // 重新加载技能列表
      await loadSkills()

      // 重置表单
      setFormData({ name: '', category: '', proficiency: 50, description: '' })
      setEditingSkill(null)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error saving skill:', error)
      setMessage('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      description: skill.description || '',
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个技能吗？')) return

    setIsSaving(true)
    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (!error) {
      setMessage('技能删除成功！')
      await loadSkills()
    } else {
      setMessage('删除失败，请重试')
    }
    setIsSaving(false)
  }

  const handleCancel = () => {
    setFormData({ name: '', category: '', proficiency: 50, description: '' })
    setEditingSkill(null)
    setShowAddForm(false)
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">管理技能</h1>
            <p className="text-foreground/70">添加、编辑或删除你的技能</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>添加技能</Button>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.includes('成功')
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {/* 添加/编辑表单 */}
        {showAddForm && (
          <GlassCard className="mb-6 p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold">{editingSkill ? '编辑技能' : '添加新技能'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="技能名称"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="例如: React"
              />
              <Input
                label="类别"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="例如: 前端开发"
              />
              <div>
                <label className="mb-2 block text-sm font-medium">
                  熟练度: {formData.proficiency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) =>
                    setFormData({ ...formData, proficiency: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">描述（可选）</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="简短描述这个技能..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" isLoading={isSaving}>
                  {editingSkill ? '更新' : '添加'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  取消
                </Button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* 技能列表 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : skills.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p className="text-foreground/70">还没有添加任何技能</p>
            </GlassCard>
          ) : (
            skills.map((skill) => (
              <GlassCard key={skill.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-bold">{skill.name}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
                        {skill.category}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      <span className="text-sm text-foreground/70">{skill.proficiency}%</span>
                    </div>
                    {skill.description && (
                      <p className="text-sm text-foreground/70">{skill.description}</p>
                    )}
                  </div>
                  <div className="ml-4 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(skill)}>
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(skill.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="ghost" onClick={() => router.push('/skills')}>
            返回技能页面
          </Button>
        </div>
      </PageWrapper>
    </PageTransition>
  )
}
