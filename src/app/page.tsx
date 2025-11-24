import { BentoGrid, GridItem, PageWrapper } from '@/components/layout'
import { HeroSection } from '@/components/features/HeroSection'
import { ProjectPreview } from '@/components/features/ProjectPreview'
import { SkillsPreview } from '@/components/features/SkillsPreview'
import { QuickLinks } from '@/components/features/QuickLinks'
import { StatusCard } from '@/components/features/StatusCard'
import { PageTransition } from '@/components/animations/PageTransition'

// Enable static generation for optimal performance
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default function Home() {
  const gridItems: GridItem[] = [
    {
      id: 'hero',
      title: '简介',
      size: 'large',
      content: <HeroSection />,
    },
    {
      id: 'status',
      title: '状态',
      size: 'small',
      content: <StatusCard />,
    },
    {
      id: 'projects',
      title: '项目',
      size: 'medium',
      content: <ProjectPreview />,
    },
    {
      id: 'skills',
      title: '技能',
      size: 'medium',
      content: <SkillsPreview />,
    },
    {
      id: 'links',
      title: '快速链接',
      size: 'wide',
      content: <QuickLinks />,
    },
  ]

  return (
    <PageTransition>
      <PageWrapper className="py-6 sm:py-8 md:py-12 lg:py-16">
        <BentoGrid items={gridItems} />
      </PageWrapper>
    </PageTransition>
  )
}
