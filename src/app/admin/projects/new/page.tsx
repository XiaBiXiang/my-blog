import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectEditor } from '@/components/features/ProjectEditor'

export default async function NewProjectPage() {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">创建新项目</h1>
      </div>
      <ProjectEditor />
    </div>
  )
}
