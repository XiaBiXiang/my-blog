import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectDetail } from '@/components/features/ProjectDetail'
import { PageTransition } from '@/components/animations/PageTransition'

export const revalidate = 60 // ISR

interface ProjectPageProps {
  params: {
    id: string
  }
}

// Note: generateStaticParams removed because it requires cookies at build time
// Using ISR (revalidate: 60) instead for on-demand generation with proper auth

export default async function ProjectPage({ params }: ProjectPageProps) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !project) {
    notFound()
  }

  // Check if project is published (unless user is admin)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  if (!project.published && !isAdmin) {
    notFound()
  }

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 md:py-16 lg:px-8">
        <ProjectDetail project={project} isAdmin={isAdmin} />
      </div>
    </PageTransition>
  )
}
