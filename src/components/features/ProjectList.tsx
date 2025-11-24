'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/types/database.types'
import { GlassCard } from '@/components/animations/GlassCard'
import { FadeIn } from '@/components/animations/FadeIn'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectListProps {
  initialProjects: Project[]
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    initialProjects.forEach((project) => {
      const tags = project.tags || []
      tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [initialProjects])

  // Filter projects by selected tag
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return initialProjects
    return initialProjects.filter((project) => {
      const tags = project.tags || []
      return tags.includes(selectedTag)
    })
  }, [initialProjects, selectedTag])

  return (
    <div>
      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                selectedTag === null
                  ? 'text-primary-foreground bg-primary'
                  : 'bg-background/20 hover:bg-background/30'
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  selectedTag === tag
                    ? 'text-primary-foreground bg-primary'
                    : 'bg-background/20 hover:bg-background/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-foreground/70">
          {selectedTag ? `没有找到标签为 "${selectedTag}" 的项目` : '暂无项目'}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.1}>
              <Link href={`/projects/${project.id}`}>
                <GlassCard className="group h-full cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]">
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-background/20">
                    {project.thumbnail_url ? (
                      <Image
                        src={project.thumbnail_url}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                        unoptimized={project.thumbnail_url.includes('unsplash.com')}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-foreground/50">
                        <svg
                          className="h-12 w-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{project.title}</h3>
                    <p className="mb-4 line-clamp-2 text-sm text-foreground/70">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {(project.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/20 px-2 py-1 text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}
