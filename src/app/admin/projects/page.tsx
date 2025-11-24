import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectManagement } from '@/components/features/ProjectManagement'
import { PageWrapper } from '@/components/layout'

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Fetch all projects (including unpublished)
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <PageWrapper className="py-8 sm:py-12 md:py-16">
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl">项目管理</h1>
        <p className="text-base text-foreground/70 sm:text-lg">创建、编辑和管理你的项目</p>
      </div>
      <ProjectManagement initialProjects={projects || []} />
    </PageWrapper>
  )
}
