import { PageWrapper } from '@/components/layout'
import { PageTransition } from '@/components/animations/PageTransition'
import { FadeIn } from '@/components/animations/FadeIn'
import { GlassCard } from '@/components/animations/GlassCard'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 300 // 5 minutes

export default async function SkillsPage() {
  const supabase = await createClient()

  // 获取技能数据
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('proficiency', { ascending: false })

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

  // 按类别分组技能
  type SkillType = NonNullable<typeof skills>[number]
  const skillsByCategory: Record<string, SkillType[]> = {}

  skills?.forEach((skill) => {
    const category = skill.category || '其他'
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = []
    }
    skillsByCategory[category].push(skill)
  })

  return (
    <PageTransition>
      <PageWrapper maxWidth="4xl" className="py-8 sm:py-12 md:py-16">
        <FadeIn>
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">技能</h1>
            <p className="text-base text-foreground/70 sm:text-lg">我的技术栈和专业技能</p>
          </div>
        </FadeIn>

        <div className="space-y-6">
          {skillsByCategory &&
            Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <GlassCard key={category} className="p-6 sm:p-8">
                <h2 className="mb-6 text-2xl font-bold">{category}</h2>
                <div className="space-y-4">
                  {categorySkills?.map((skill) => (
                    <div key={skill.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-foreground/70">{skill.proficiency}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                      {skill.description && (
                        <p className="mt-2 text-sm text-foreground/70">{skill.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}

          {(!skills || skills.length === 0) && (
            <GlassCard className="p-12 text-center">
              <p className="text-foreground/70">暂无技能数据</p>
            </GlassCard>
          )}

          {isAdmin && (
            <div className="flex justify-center">
              <Link
                href="/admin/skills"
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
              >
                管理技能
              </Link>
            </div>
          )}
        </div>
      </PageWrapper>
    </PageTransition>
  )
}
