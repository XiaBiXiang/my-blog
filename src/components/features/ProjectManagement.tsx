'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/lib/types/database.types'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/animations/GlassCard'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/lib/hooks/useToast'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectManagementProps {
  initialProjects: Project[]
}

export function ProjectManagement({ initialProjects }: ProjectManagementProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('projects').delete().eq('id', projectToDelete.id)

      if (error) throw error

      setProjects(projects.filter((p) => p.id !== projectToDelete.id))
      showToast('项目已删除', 'success')
      setDeleteModalOpen(false)
      setProjectToDelete(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
      showToast('删除失败，请重试', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleTogglePublish = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ published: !project.published })
        .eq('id', project.id)

      if (error) throw error

      setProjects(
        projects.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
      )
      showToast(project.published ? '项目已设为未发布' : '项目已发布', 'success')
      router.refresh()
    } catch (error) {
      console.error('Error toggling publish status:', error)
      showToast('操作失败，请重试', 'error')
    }
  }

  return (
    <div>
      {/* Create New Button */}
      <div className="mb-6">
        <Link href="/admin/projects/new">
          <Button>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            创建新项目
          </Button>
        </Link>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <GlassCard className="py-12 text-center text-foreground/70">
          暂无项目，点击上方按钮创建第一个项目
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <GlassCard key={project.id} className="overflow-hidden">
              <div className="flex flex-col gap-4 p-6 sm:flex-row">
                {/* Thumbnail */}
                <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold">{project.title}</h3>
                      <p className="text-sm text-foreground/70">{project.description}</p>
                    </div>
                    <span
                      className={`ml-4 shrink-0 rounded-full px-3 py-1 text-xs ${
                        project.published
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}
                    >
                      {project.published ? '已发布' : '未发布'}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/20 px-2 py-1 text-xs text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        查看
                      </Button>
                    </Link>
                    <Link href={`/admin/projects/edit/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        编辑
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(project)}>
                      {project.published ? '取消发布' : '发布'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setProjectToDelete(project)
                        setDeleteModalOpen(true)
                      }}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setProjectToDelete(null)
        }}
        title="确认删除"
      >
        <div className="space-y-4">
          <p>确定要删除项目 &ldquo;{projectToDelete?.title}&rdquo; 吗？此操作无法撤销。</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteModalOpen(false)
                setProjectToDelete(null)
              }}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? '删除中...' : '确认删除'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
