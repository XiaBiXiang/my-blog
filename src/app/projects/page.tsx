import { createClient } from '@/lib/supabase/server'
import { ProjectList } from '@/components/features/ProjectList'
import { PageWrapper } from '@/components/layout'
import { PageTransition } from '@/components/animations/PageTransition'

export const revalidate = 60 // ISR: revalidate every 60 seconds

export default async function ProjectsPage() {
  const supabase = await createClient()

  // Fetch published projects
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <PageTransition>
      <PageWrapper className="py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">项目展示</h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            探索我的作品集，了解我的技术栈和项目经验
          </p>
        </div>
        <ProjectList initialProjects={projects || []} />
      </PageWrapper>
    </PageTransition>
  )
}
