# 页面过渡动画指南

## 概述

为应用添加了流畅的页面过渡动画，提升用户体验。使用 Framer Motion 实现优雅的路由切换效果。

## 实现的动画

### 1. 页面过渡动画 (PageTransition)

**位置**: `src/components/animations/PageTransition.tsx`

**效果**:

- 页面进入: 从下方淡入 (opacity 0→1, y 20→0)
- 页面退出: 向上方淡出 (opacity 1→0, y 0→-20)
- 过渡时间: 300ms
- 缓动函数: easeInOut

**使用方式**:

```tsx
import { PageTransition } from '@/components/animations/PageTransition'

export default function MyPage() {
  return <PageTransition>{/* 页面内容 */}</PageTransition>
}
```

**特点**:

- 自动检测路由变化
- 使用 AnimatePresence 确保退出动画完成
- mode="wait" 确保前一个页面完全退出后再进入新页面

### 2. 表单过渡动画 (FormTransition)

**位置**: `src/components/animations/FormTransition.tsx`

**效果**:

- 容器: 淡入效果
- 表单项: 依次从下方弹入
- 交错延迟: 100ms
- 弹簧动画: stiffness 300, damping 24

**使用方式**:

```tsx
import { FormTransition, FormItem } from '@/components/animations/FormTransition'

export function MyForm() {
  return (
    <FormTransition>
      <FormItem>
        <Input label="字段1" />
      </FormItem>
      <FormItem>
        <Input label="字段2" />
      </FormItem>
    </FormTransition>
  )
}
```

**特点**:

- 交错动画 (stagger children)
- 弹簧物理效果
- 可自定义延迟

## 已添加动画的页面

### ✅ 认证页面

- `/login` - 登录页面
- `/register` - 注册页面

### ✅ 主要页面

- `/` - 首页
- `/projects` - 项目列表
- `/projects/[id]` - 项目详情
- `/guestbook` - 留言板
- `/capsule` - 时间胶囊

## 动画参数

### PageTransition 参数

```typescript
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20, // 从下方 20px 开始
  },
  animate: {
    opacity: 1,
    y: 0, // 移动到原位
  },
  exit: {
    opacity: 0,
    y: -20, // 向上方 20px 退出
  },
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3, // 300ms
}
```

### FormTransition 参数

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 子元素间隔 100ms
      delayChildren: 0.1, // 延迟 100ms 开始
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
}
```

## 性能优化

### 1. 使用 will-change

Framer Motion 自动添加 `will-change` CSS 属性，优化动画性能。

### 2. GPU 加速

使用 `transform` 和 `opacity` 属性，触发 GPU 加速。

### 3. 避免布局抖动

- 使用 `mode="wait"` 避免同时渲染两个页面
- 动画只影响 transform 和 opacity，不触发重排

### 4. 短动画时长

- 300ms 的动画时长，快速响应
- 不会让用户感觉卡顿

## 自定义动画

### 修改动画时长

```tsx
// 在 PageTransition.tsx 中修改
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.5, // 改为 500ms
}
```

### 修改动画方向

```tsx
// 从左侧进入
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20, // 从左侧
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20, // 向右侧退出
  },
}
```

### 添加缩放效果

```tsx
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95, // 稍微缩小
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 1.05, // 稍微放大
  },
}
```

## 为新页面添加动画

### 步骤 1: 导入 PageTransition

```tsx
import { PageTransition } from '@/components/animations/PageTransition'
```

### 步骤 2: 包裹页面内容

```tsx
export default function NewPage() {
  return <PageTransition>{/* 你的页面内容 */}</PageTransition>
}
```

### 步骤 3: 确保是客户端组件（如果需要）

如果页面使用了客户端功能，添加：

```tsx
'use client'
```

## 动画效果演示

### 页面切换流程

```
用户点击链接
    ↓
当前页面开始退出动画 (300ms)
    ├─ opacity: 1 → 0
    └─ y: 0 → -20
    ↓
退出动画完成
    ↓
新页面开始进入动画 (300ms)
    ├─ opacity: 0 → 1
    └─ y: 20 → 0
    ↓
动画完成，页面可交互
```

### 总时长

- 单次页面切换: 600ms (退出 300ms + 进入 300ms)
- 感觉流畅，不会太慢

## 浏览器兼容性

### 支持的浏览器

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 降级方案

- 不支持的浏览器会跳过动画
- 页面功能不受影响
- Framer Motion 自动处理降级

## 最佳实践

### 1. 保持一致性

所有页面使用相同的过渡效果，保持用户体验一致。

### 2. 避免过度动画

- 不要在一个页面中使用太多不同的动画
- 保持简洁和专业

### 3. 考虑性能

- 在低端设备上测试
- 确保动画流畅不卡顿

### 4. 可访问性

- 动画不应该影响可访问性
- 考虑添加 `prefers-reduced-motion` 支持

## 添加 prefers-reduced-motion 支持

```tsx
// 在 PageTransition.tsx 中添加
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: prefersReducedMotion ? 0 : 0.3, // 如果用户偏好减少动画，设为 0
}
```

## 调试动画

### 1. 慢动作播放

```tsx
// 临时修改动画时长
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 3, // 3 秒，方便观察
}
```

### 2. 查看动画状态

```tsx
<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={pageVariants}
  transition={pageTransition}
  onAnimationStart={() => console.log('动画开始')}
  onAnimationComplete={() => console.log('动画完成')}
>
```

## 常见问题

### Q: 为什么动画有时候不触发？

A: 确保页面组件被 `PageTransition` 包裹，并且路由确实发生了变化。

### Q: 动画太快或太慢？

A: 修改 `duration` 参数，推荐范围 0.2-0.5 秒。

### Q: 如何禁用某个页面的动画？

A: 不要在该页面使用 `PageTransition` 组件即可。

### Q: 动画影响性能？

A: 使用 Chrome DevTools 的 Performance 面板检查，通常 300ms 的简单动画不会有性能问题。

## 总结

页面过渡动画已成功添加到所有主要页面：

- ✅ 流畅的进入/退出效果
- ✅ 一致的用户体验
- ✅ 良好的性能表现
- ✅ 易于维护和扩展

现在你的应用有了专业的页面切换效果，提升了整体的用户体验！🎉
