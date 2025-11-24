'use client'

import { useState } from 'react'
import { Button, Input, Card, Modal, ThemeToggle } from '@/components/ui'
import { GlassCard, FadeIn } from '@/components/animations'
import { BentoGrid } from '@/components/layout'

export default function UIDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">UI 组件库演示</h1>
          <ThemeToggle />
        </div>

        {/* Buttons */}
        <FadeIn>
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">按钮组件</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">主要按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="primary" size="sm">
                小按钮
              </Button>
              <Button variant="primary" size="lg">
                大按钮
              </Button>
              <Button variant="primary" isLoading>
                加载中
              </Button>
              <Button variant="primary" disabled>
                禁用按钮
              </Button>
            </div>
          </Card>
        </FadeIn>

        {/* Inputs */}
        <FadeIn delay={100}>
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">输入框组件</h2>
            <div className="space-y-4">
              <Input
                label="用户名"
                placeholder="请输入用户名"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input label="邮箱" type="email" placeholder="请输入邮箱" />
              <Input label="密码" type="password" placeholder="请输入密码" />
              <Input label="禁用输入" placeholder="禁用状态" disabled />
              <Input label="错误状态" placeholder="输入内容" error="这是一个错误提示" />
            </div>
          </Card>
        </FadeIn>

        {/* Cards */}
        <FadeIn delay={200}>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <h3 className="mb-2 text-xl font-semibold">普通卡片</h3>
              <p className="text-muted-foreground">
                这是一个普通的卡片组件，具有默认的背景和边框样式。
              </p>
            </Card>
            <Card variant="glass">
              <h3 className="mb-2 text-xl font-semibold">玻璃态卡片</h3>
              <p className="text-muted-foreground">
                这是一个玻璃态卡片组件，具有半透明背景和模糊效果。
              </p>
            </Card>
          </div>
        </FadeIn>

        {/* Glass Card with custom props */}
        <FadeIn delay={300}>
          <GlassCard blur={20} opacity={0.15}>
            <h2 className="mb-4 text-2xl font-semibold">自定义玻璃态卡片</h2>
            <p className="text-muted-foreground mb-4">
              这个玻璃态卡片使用了自定义的模糊度（20px）和透明度（0.15）。
            </p>
            <Button onClick={() => setIsModalOpen(true)}>打开模态框</Button>
          </GlassCard>
        </FadeIn>

        {/* Animation Demo */}
        <FadeIn delay={400}>
          <Card>
            <h2 className="mb-4 text-2xl font-semibold">动画演示</h2>
            <p className="text-muted-foreground">
              所有卡片都使用了 FadeIn 组件，具有交错的入场动画效果。滚动页面可以看到动画触发。
            </p>
          </Card>
        </FadeIn>

        {/* Bento Grid Demo */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Bento Grid 布局演示</h2>
          <p className="text-muted-foreground">
            响应式网格布局，支持不同尺寸的卡片，具有交错入场动画和悬停提升效果。
          </p>
          <BentoGrid
            items={[
              {
                id: 'demo-1',
                title: '大卡片',
                size: 'large',
                content: (
                  <GlassCard className="h-full">
                    <h3 className="mb-2 text-xl font-semibold">Large (2x2)</h3>
                    <p className="text-muted-foreground text-sm">
                      占据 2 列 2 行的大卡片，适合展示重要内容
                    </p>
                  </GlassCard>
                ),
              },
              {
                id: 'demo-2',
                title: '小卡片',
                size: 'small',
                content: (
                  <GlassCard className="h-full">
                    <h3 className="mb-2 text-lg font-semibold">Small (1x1)</h3>
                    <p className="text-muted-foreground text-xs">小卡片</p>
                  </GlassCard>
                ),
              },
              {
                id: 'demo-3',
                title: '中等卡片',
                size: 'medium',
                content: (
                  <GlassCard className="h-full">
                    <h3 className="mb-2 text-lg font-semibold">Medium (1x2)</h3>
                    <p className="text-muted-foreground text-sm">占据 1 列 2 行的中等卡片</p>
                  </GlassCard>
                ),
              },
              {
                id: 'demo-4',
                title: '宽卡片',
                size: 'wide',
                content: (
                  <GlassCard className="h-full">
                    <h3 className="mb-2 text-lg font-semibold">Wide (2x1)</h3>
                    <p className="text-muted-foreground text-sm">
                      占据 2 列 1 行的宽卡片，适合展示横向内容
                    </p>
                  </GlassCard>
                ),
              },
              {
                id: 'demo-5',
                title: '小卡片 2',
                size: 'small',
                content: (
                  <GlassCard className="h-full">
                    <h3 className="mb-2 text-lg font-semibold">Small (1x1)</h3>
                    <p className="text-muted-foreground text-xs">另一个小卡片</p>
                  </GlassCard>
                ),
              },
            ]}
          />
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="模态框标题">
          <div className="space-y-4">
            <p>这是一个模态框组件，具有以下特性：</p>
            <ul className="list-inside list-disc space-y-2 text-sm">
              <li>玻璃态背景效果</li>
              <li>按 ESC 键关闭</li>
              <li>点击外部区域关闭</li>
              <li>平滑的入场和出场动画</li>
              <li>自动锁定页面滚动</li>
            </ul>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                确认
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
