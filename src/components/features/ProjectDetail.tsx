'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/lib/types/database.types'
import { GlassCard } from '@/components/animations/GlassCard'
import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/Button'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectDetailProps {
  project: Project
  isAdmin: boolean
}

export function ProjectDetail({ project, isAdmin }: ProjectDetailProps) {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-12">
      <FadeIn>
        <GlassCard className="overflow-hidden">
          {/* Header */}
          <div className="relative aspect-[21/9] w-full bg-background/20">
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
                unoptimized={project.thumbnail_url.includes('unsplash.com')}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-foreground/50">
                <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="p-8">
            {/* Title and Status */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold">{project.title}</h1>
                <p className="text-lg text-foreground/70">{project.description}</p>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      project.published
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-yellow-500/20 text-yellow-500'
                    }`}
                  >
                    {project.published ? '已发布' : '未发布'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                  >
                    编辑
                  </Button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {(project.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            {(project.github_url || project.demo_url) && (
              <div className="mb-8 flex gap-4">
                {project.github_url && (
                  <Link href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary">
                      <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </Button>
                  </Link>
                )}
                {project.demo_url && (
                  <Link href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <Button>
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      在线演示
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  )
}
