'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/animations/GlassCard'

const featuredProjects = [
  {
    id: '1',
    title: '作品集网站',
    description: '现代化的个人作品集，采用 Glassmorphism 设计',
    tags: ['Next.js', 'Supabase', 'Tailwind'],
  },
  {
    id: '2',
    title: '实时聊天应用',
    description: '基于 WebSocket 的实时通讯平台',
    tags: ['React', 'Node.js', 'Socket.io'],
  },
]

export function ProjectPreview() {
  return (
    <GlassCard className="flex h-full flex-col p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h2 className="text-xl font-bold sm:text-2xl">精选项目</h2>
        <Link
          href="/projects"
          className="text-xs text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          查看全部 →
        </Link>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto sm:space-y-4">
        {featuredProjects.map((project) => (
          <div
            key={project.id}
            className="cursor-pointer rounded-lg bg-background/20 p-3 transition-colors hover:bg-background/30 sm:p-4"
          >
            <h3 className="mb-1.5 text-sm font-semibold sm:mb-2 sm:text-base">{project.title}</h3>
            <p className="mb-2 text-xs text-foreground/70 sm:mb-3 sm:text-sm">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
