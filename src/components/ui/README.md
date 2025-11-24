# UI 组件库

这是一个现代化的 UI 组件库，采用 Glassmorphism（玻璃态）设计风格，支持深色/浅色主题切换。

## 组件列表

### Button（按钮）

支持多种变体和尺寸的按钮组件。

```tsx
import { Button } from '@/components/ui'

// 基础用法
<Button>点击我</Button>

// 变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="ghost">幽灵按钮</Button>

// 尺寸
<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>

// 加载状态
<Button isLoading>加载中...</Button>

// 禁用状态
<Button disabled>禁用按钮</Button>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'ghost' (默认: 'primary')
- `size`: 'sm' | 'md' | 'lg' (默认: 'md')
- `isLoading`: boolean (默认: false)
- 继承所有 HTML button 属性

### Input（输入框）

带标签和错误提示的输入框组件。

```tsx
import { Input } from '@/components/ui'

// 基础用法
<Input placeholder="请输入内容" />

// 带标签
<Input label="用户名" placeholder="请输入用户名" />

// 错误状态
<Input label="邮箱" error="邮箱格式不正确" />

// 不同类型
<Input type="email" label="邮箱" />
<Input type="password" label="密码" />
```

**Props:**

- `label`: string (可选)
- `error`: string (可选)
- 继承所有 HTML input 属性

### Card（卡片）

通用卡片容器组件。

```tsx
import { Card } from '@/components/ui'

// 默认卡片
<Card>
  <h3>标题</h3>
  <p>内容</p>
</Card>

// 玻璃态卡片
<Card variant="glass">
  <h3>玻璃态卡片</h3>
  <p>具有半透明背景和模糊效果</p>
</Card>
```

**Props:**

- `variant`: 'default' | 'glass' (默认: 'default')
- 继承所有 HTML div 属性

### Modal（模态框）

功能完整的模态框组件。

```tsx
import { Modal } from '@/components/ui'
import { useState } from 'react'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>打开模态框</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="模态框标题">
        <p>模态框内容</p>
      </Modal>
    </>
  )
}
```

**Props:**

- `isOpen`: boolean (必需)
- `onClose`: () => void (必需)
- `title`: string (可选)
- `className`: string (可选)
- `children`: ReactNode (必需)

**特性:**

- 按 ESC 键关闭
- 点击外部区域关闭
- 自动锁定页面滚动
- 玻璃态背景效果
- 平滑动画

### ThemeToggle（主题切换）

主题切换按钮组件。

```tsx
import { ThemeToggle } from '@/components/ui'

// 基础用法
<ThemeToggle />

// 自定义样式
<ThemeToggle className="my-custom-class" />
```

**Props:**

- `className`: string (可选)

## 动画组件

### GlassCard（玻璃态卡片）

可自定义模糊度和透明度的玻璃态卡片。

```tsx
import { GlassCard } from '@/components/animations'

// 基础用法
<GlassCard>
  <h3>内容</h3>
</GlassCard>

// 自定义模糊度和透明度
<GlassCard blur={20} opacity={0.15}>
  <h3>自定义玻璃态效果</h3>
</GlassCard>
```

**Props:**

- `blur`: number (默认: 10) - 模糊度（px）
- `opacity`: number (默认: 0.1) - 透明度（0-1）
- `className`: string (可选)
- `children`: ReactNode (必需)

### FadeIn（淡入动画）

滚动触发的淡入动画组件。

```tsx
import { FadeIn } from '@/components/animations'

// 基础用法
<FadeIn>
  <div>内容会在进入视口时淡入</div>
</FadeIn>

// 自定义延迟和持续时间
<FadeIn delay={200} duration={500}>
  <div>延迟 200ms 后淡入，持续 500ms</div>
</FadeIn>
```

**Props:**

- `delay`: number (默认: 0) - 延迟时间（ms）
- `duration`: number (默认: 500) - 动画持续时间（ms）
- `className`: string (可选)
- `children`: ReactNode (必需)

## 主题系统

### 使用主题

主题系统基于 Zustand 状态管理，支持持久化存储。

```tsx
import { useThemeStore } from '@/stores/themeStore'

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
      <button onClick={() => setTheme('dark')}>设置为深色</button>
      <button onClick={() => setTheme('light')}>设置为浅色</button>
    </div>
  )
}
```

### 主题颜色

主题颜色定义在 `src/app/globals.css` 中：

**浅色主题:**

- background: 240 10% 98%
- foreground: 240 10% 10%
- primary: 240 100% 60%
- secondary: 280 80% 65%
- accent: 320 90% 60%

**深色主题:**

- background: 240 10% 8%
- foreground: 240 10% 98%
- primary: 240 100% 70%
- secondary: 280 80% 75%
- accent: 320 90% 70%

### 在 Tailwind 中使用主题颜色

```tsx
<div className="bg-background text-foreground">
  <h1 className="text-primary">标题</h1>
  <p className="text-secondary">副标题</p>
  <button className="bg-accent">按钮</button>
</div>
```

## 演示页面

访问 `/ui-demo` 查看所有组件的实际效果和用法示例。

## 设计规范

### 动画时长

- 快速: 150ms (悬停、点击反馈)
- 中等: 300ms (页面过渡、模态框)
- 慢速: 500ms (复杂动画)

### 缓动函数

- 入场: cubic-bezier(0.16, 1, 0.3, 1)
- 出场: cubic-bezier(0.7, 0, 0.84, 0)
- 交互: cubic-bezier(0.4, 0, 0.2, 1)

### 间距系统

基于 4px 的间距比例：

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
