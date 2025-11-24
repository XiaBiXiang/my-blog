'use client'

import Link from 'next/link'
import { GlassCard } from '@/components/animations/GlassCard'

const skillCategories = [
  {
    category: '前端开发',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    proficiency: 95,
  },
  {
    category: '后端开发',
    skills: ['Node.js', 'Supabase', 'PostgreSQL'],
    proficiency: 85,
  },
  {
    category: '工具链',
    skills: ['Git', 'Docker', 'Vercel'],
    proficiency: 90,
  },
]

export function SkillsPreview() {
  return (
    <GlassCard className="flex h-full flex-col p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h2 className="text-xl font-bold sm:text-2xl">技能概览</h2>
        <Link
          href="/skills"
          className="text-xs text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          查看技能树 →
        </Link>
      </div>
      <div className="flex-1 space-y-3 sm:space-y-4">
        {skillCategories.map((category) => (
          <div key={category.category}>
            <div className="mb-1.5 flex items-center justify-between sm:mb-2">
              <h3 className="text-xs font-semibold sm:text-sm">{category.category}</h3>
              <span className="text-xs text-foreground/60">{category.proficiency}%</span>
            </div>
            <div className="mb-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background/30 sm:mb-2 sm:h-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                style={{ width: `${category.proficiency}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-background/20 px-1.5 py-0.5 text-xs text-foreground/80 sm:px-2 sm:py-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
