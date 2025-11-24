import { PageWrapper } from '@/components/layout'
import { PageTransition } from '@/components/animations/PageTransition'
import { FadeIn } from '@/components/animations/FadeIn'
import { GlassCard } from '@/components/animations/GlassCard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 300 // 5 minutes

export default async function AboutPage() {
  const supabase = await createClient()

  // 检查是否是管理员
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

  return (
    <PageTransition>
      <PageWrapper maxWidth="4xl" className="py-8 sm:py-12 md:py-16">
        <FadeIn>
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">关于我</h1>
            <p className="text-base text-foreground/70 sm:text-lg">了解更多关于我的信息</p>
          </div>
        </FadeIn>

        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold">个人简介</h2>
            <div className="space-y-4 text-foreground/80">
              <p>你好！我是一名充满热情的开发者，专注于创建优雅且功能强大的 Web 应用程序。</p>
              <p>
                我热爱学习新技术，并将它们应用到实际项目中。这个作品集网站展示了我的技能和项目经验。
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold">技术栈</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[
                'React',
                'Next.js',
                'TypeScript',
                'Tailwind CSS',
                'Node.js',
                'Supabase',
                'Framer Motion',
                'Git',
              ].map((tech) => (
                <div
                  key={tech}
                  className="rounded-lg bg-primary/10 px-4 py-2 text-center text-sm font-medium"
                >
                  {tech}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <h2 className="mb-4 text-2xl font-bold">联系方式</h2>
            <div className="space-y-3 text-foreground/80">
              <p>📧 Email: your@email.com</p>
              <p>🐙 GitHub: github.com/yourusername</p>
              <p>💼 LinkedIn: linkedin.com/in/yourusername</p>
            </div>
          </GlassCard>

          {isAdmin && (
            <div className="flex justify-center">
              <Link
                href="/admin/about"
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
              >
                编辑关于页面
              </Link>
            </div>
          )}
        </div>
      </PageWrapper>
    </PageTransition>
  )
}
