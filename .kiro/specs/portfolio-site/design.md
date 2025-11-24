# 设计文档

## 概述

本作品集网站是一个现代化的全栈 Web 应用，采用 Next.js 14 App Router 架构，结合 Supabase 作为后端服务。网站以 Glassmorphism（玻璃态）和 Bento Grid（便当盒网格）为核心设计语言，提供流畅的动画体验和创新的交互功能。

### 核心技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: React 18
- **样式方案**: Tailwind CSS 3.4 + CSS Modules
- **动画库**: Framer Motion
- **3D 渲染**: Three.js + React Three Fiber (用于技能树)
- **状态管理**: Zustand
- **表单处理**: React Hook Form + Zod
- **后端服务**: Supabase
  - 认证: Supabase Auth
  - 数据库: PostgreSQL
  - 实时功能: Supabase Realtime
  - 存储: Supabase Storage
- **类型安全**: TypeScript 5.3
- **代码质量**: ESLint + Prettier
- **测试**: Vitest + React Testing Library + fast-check (PBT)

### 设计原则

1. **性能优先**: 利用 Next.js 的 SSR/SSG 能力，确保首屏加载时间 < 3 秒
2. **渐进增强**: 核心功能在 JavaScript 禁用时仍可访问
3. **移动优先**: 响应式设计从移动端开始
4. **可访问性**: 遵循 WCAG 2.1 AA 标准
5. **类型安全**: 端到端的 TypeScript 类型检查

## 架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js App │  │   React UI   │  │  Framer      │      │
│  │    Router    │  │  Components  │  │   Motion     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  Supabase SDK  │
                    └───────┬────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    Supabase 层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Supabase     │  │  PostgreSQL  │  │  Supabase    │      │
│  │    Auth      │  │   Database   │  │   Realtime   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Supabase    │  │     RLS      │                        │
│  │   Storage    │  │   Policies   │                        │
│  └──────────────┘  └──────────────┘                        │
└───────────────────────────────────────────────────────────────┘
```

### 目录结构

```
portfolio-site/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证路由组
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # 需要认证的路由组
│   │   ├── admin/
│   │   │   ├── capsule/
│   │   │   └── content/
│   │   └── guestbook/
│   ├── about/
│   ├── projects/
│   ├── skills/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                   # React 组件
│   ├── ui/                       # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── BentoGrid.tsx
│   ├── features/                 # 功能组件
│   │   ├── CommandPalette.tsx
│   │   ├── Guestbook.tsx
│   │   ├── TimeCapsule.tsx
│   │   └── SkillTree.tsx
│   └── animations/               # 动画组件
│       ├── GlassCard.tsx
│       └── FadeIn.tsx
├── lib/                          # 工具库
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useRealtime.ts
│   │   └── useCommandPalette.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── validators.ts
│   └── types/
│       └── database.types.ts
├── stores/                       # Zustand 状态管理
│   ├── authStore.ts
│   └── themeStore.ts
├── supabase/                     # Supabase 配置
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
├── tests/                        # 测试文件
│   ├── unit/
│   └── properties/
└── package.json
```

## 组件和接口

### 核心组件

#### 1. 认证组件

**AuthProvider**

- 职责: 管理全局认证状态
- Props: `children: ReactNode`
- 状态: `user`, `session`, `loading`
- 方法: `signIn()`, `signUp()`, `signOut()`

**LoginForm**

- 职责: 处理用户登录
- Props: `onSuccess?: () => void`
- 验证: Email + Password (Zod schema)

**RegisterForm**

- 职责: 处理用户注册
- Props: `onSuccess?: () => void`
- 验证: Email + Password + Confirm Password

#### 2. 留言板组件

**Guestbook**

- 职责: 显示和管理留言
- Props: `userId?: string`
- 状态: `messages`, `loading`, `error`
- 实时订阅: Supabase Realtime channel

**GuestbookForm**

- 职责: 提交新留言
- Props: `onSubmit: (content: string) => Promise<void>`
- 验证: 非空字符串，最大长度 500

**GuestbookMessage**

- 职责: 单条留言展示
- Props: `message: Message`, `canDelete: boolean`

#### 3. 时间胶囊组件

**TimeCapsule**

- 职责: 展示时间胶囊列表
- Props: `isAdmin?: boolean`
- 状态: `capsules`, `loading`

**CapsuleEditor**

- 职责: 创建/编辑时间胶囊（仅管理员）
- Props: `capsule?: Capsule`, `onSave: () => void`
- 验证: 标题 + 内容 + 可选图片

#### 4. 命令面板组件

**CommandPalette**

- 职责: 全局命令搜索和导航
- Props: `isOpen: boolean`, `onClose: () => void`
- 快捷键: CMD+K / CTRL+K
- 命令类型: 导航、主题切换、搜索

#### 5. 技能树组件

**SkillTree**

- 职责: 3D 技能可视化
- Props: `skills: Skill[]`
- 库: Three.js + React Three Fiber
- 交互: 悬停、点击、缩放

**SkillNode**

- 职责: 单个技能节点
- Props: `skill: Skill`, `position: Vector3`
- 状态: `hovered`, `selected`

#### 6. 布局组件

**BentoGrid**

- 职责: 响应式网格布局
- Props: `items: GridItem[]`, `columns?: number`
- 特性: 自动调整、交错动画

**GlassCard**

- 职责: 玻璃态卡片容器
- Props: `children`, `blur?: number`, `opacity?: number`
- 样式: backdrop-filter, border, shadow

### 接口定义

```typescript
// 用户类型
interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  avatar_url?: string
  created_at: string
}

// 留言类型
interface GuestbookMessage {
  id: string
  user_id: string
  content: string
  created_at: string
  user: {
    email: string
    avatar_url?: string
  }
}

// 时间胶囊类型
interface TimeCapsule {
  id: string
  title: string
  content: string
  image_url?: string
  created_at: string
  updated_at: string
}

// 技能类型
interface Skill {
  id: string
  name: string
  category: string
  proficiency: number // 0-100
  description: string
  icon_url?: string
  parent_id?: string
  children?: Skill[]
}

// 项目类型
interface Project {
  id: string
  title: string
  description: string
  content: string
  thumbnail_url: string
  tags: string[]
  github_url?: string
  demo_url?: string
  created_at: string
  published: boolean
}

// 命令类型
interface Command {
  id: string
  label: string
  description?: string
  icon?: string
  action: () => void
  keywords: string[]
  category: 'navigation' | 'theme' | 'action'
}
```

## 数据模型

### 数据库架构

#### 表: profiles (扩展 auth.users)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  display_name TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
```

#### 表: guestbook

```sql
CREATE TABLE guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guestbook_created_at ON guestbook(created_at DESC);
CREATE INDEX idx_guestbook_user_id ON guestbook(user_id);
```

#### 表: time_capsule

```sql
CREATE TABLE time_capsule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 200),
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_time_capsule_created_at ON time_capsule(created_at DESC);
```

#### 表: skills

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  category TEXT NOT NULL,
  proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  position_x FLOAT,
  position_y FLOAT,
  position_z FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_parent_id ON skills(parent_id);
```

#### 表: projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(description) > 0 AND char_length(description) <= 500),
  content TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
```

### RLS 策略

#### profiles 表策略

```sql
-- 所有人可以查看 profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- 用户只能更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### guestbook 表策略

```sql
-- 所有人可以查看留言
CREATE POLICY "Guestbook messages are viewable by everyone"
  ON guestbook FOR SELECT
  USING (true);

-- 已登录用户可以创建留言
CREATE POLICY "Authenticated users can create messages"
  ON guestbook FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 用户可以删除自己的留言，管理员可以删除所有留言
CREATE POLICY "Users can delete own messages, admins can delete all"
  ON guestbook FOR DELETE
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### time_capsule 表策略

```sql
-- 所有人可以查看时间胶囊
CREATE POLICY "Time capsules are viewable by everyone"
  ON time_capsule FOR SELECT
  USING (true);

-- 只有管理员可以创建、更新、删除时间胶囊
CREATE POLICY "Only admins can manage time capsules"
  ON time_capsule FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### skills 表策略

```sql
-- 所有人可以查看技能
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- 只有管理员可以管理技能
CREATE POLICY "Only admins can manage skills"
  ON skills FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### projects 表策略

```sql
-- 所有人可以查看已发布的项目
CREATE POLICY "Published projects are viewable by everyone"
  ON projects FOR SELECT
  USING (published = true OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 只有管理员可以管理项目
CREATE POLICY "Only admins can manage projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```
# 设计文档续 - 正确性属性及其他部分

## 正确性属性

_属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。_

### 属性 1: 用户注册创建账户

*对于任何*有效的邮箱和密码组合，当用户提交注册信息时，系统应该在 Supabase 中创建一个新的用户账户。
**验证需求: 1.2**

### 属性 2: 邮箱验证激活账户

*对于任何*未激活的用户账户，当用户点击验证邮件中的链接时，账户应该被激活并允许登录。
**验证需求: 1.3**

### 属性 3: 正确凭证创建会话

*对于任何*已注册用户的正确登录凭证，系统应该验证用户身份并创建有效会话。
**验证需求: 1.4**

### 属性 4: 登出清除会话

*对于任何*活跃的用户会话，当用户登出时，会话应该被完全清除。
**验证需求: 1.5**

### 属性 5: 留言按时间倒序排列

*对于任何*留言列表，所有留言应该按创建时间倒序排列（最新的在前）。
**验证需求: 2.1**

### 属性 6: 留言提交后立即显示

*对于任何*有效的留言内容，当用户提交后，该留言应该立即出现在留言列表中。
**验证需求: 2.2**

### 属性 7: 实时推送新留言

*对于任何*新发表的留言，所有在线用户的留言板应该通过 Realtime 实时收到更新。
**验证需求: 2.3**

### 属性 8: 空白留言被拒绝

*对于任何*仅包含空白字符（空字符串、空格、制表符等）的留言内容，系统应该阻止提交。
**验证需求: 2.4**

### 属性 9: 删除权限正确显示

*对于任何*留言，当且仅当当前用户是留言作者或管理员时，应该显示删除按钮。
**验证需求: 2.5**

### 属性 10: 时间胶囊保存并展示

*对于任何*管理员提交的有效时间胶囊内容，系统应该将其保存到数据库并在前台展示。
**验证需求: 3.2**

### 属性 11: 时间胶囊按时间倒序

*对于任何*时间胶囊列表，所有胶囊应该按创建时间倒序排列。
**验证需求: 3.3**

### 属性 12: 管理员可编辑删除胶囊

*对于任何*时间胶囊，管理员应该能够成功编辑或删除该内容。
**验证需求: 3.4**

### 属性 13: 非管理员无法访问胶囊管理

*对于任何*非管理员用户，尝试访问时间胶囊管理功能应该被拒绝。
**验证需求: 3.5**

### 属性 14: 快捷键触发命令面板

*对于任何*页面状态，当用户按下 CMD+K 或 CTRL+K 时，命令面板应该显示。
**验证需求: 4.1**

### 属性 15: 命令搜索实时过滤

*对于任何*搜索关键词，命令面板应该实时过滤并只显示匹配的命令。
**验证需求: 4.3**

### 属性 16: 命令执行后关闭面板

*对于任何*选中的命令，当用户按下回车执行后，命令面板应该关闭。
**验证需求: 4.4**

### 属性 17: ESC 或外部点击关闭面板

*对于任何*打开的命令面板，当用户按 ESC 或点击外部区域时，面板应该关闭。
**验证需求: 4.5**

### 属性 18: 悬停显示技能详情

*对于任何*技能节点，当用户悬停时，应该显示该技能的详细信息（名称、熟练度、描述）。
**验证需求: 5.2**

### 属性 19: 点击展开技能子节点

*对于任何*有子技能的技能节点，当用户点击时，应该展开显示子技能。
**验证需求: 5.3**

### 属性 20: 移动端触摸交互

*对于任何*移动设备上的技能树，应该支持触摸友好的交互方式（点击、滑动、缩放）。
**验证需求: 5.5**

### 属性 21: RLS 策略配置完整

*对于任何*数据表，创建完成后应该配置有适当的 RLS 策略。
**验证需求: 6.2**

### 属性 22: RLS 正确过滤数据

*对于任何*用户的数据访问请求，RLS 策略应该只返回该用户有权限访问的数据。
**验证需求: 6.3**

### 属性 23: 迁移保持数据完整性

*对于任何*数据库迁移操作，执行后原有数据应该保持完整性。
**验证需求: 6.4**

### 属性 24: Glassmorphism 样式应用

*对于任何*页面元素，应该正确应用 Glassmorphism 样式（半透明、模糊、边框）。
**验证需求: 7.1**

### 属性 25: 主题切换调整样式

*对于任何*玻璃态元素，当切换深色/浅色主题时，透明度和颜色应该相应调整。
**验证需求: 7.3**

### 属性 26: 元素出现播放动画

*对于任何*页面加载或元素出现，应该播放淡入和缩放动画。
**验证需求: 7.4**

### 属性 27: 交互提供动画反馈

*对于任何*交互元素（按钮、卡片），用户交互时应该提供悬停和点击动画反馈。
**验证需求: 7.5**

### 属性 28: 响应式调整网格布局

*对于任何*屏幕尺寸变化，Bento Grid 布局应该响应式调整。
**验证需求: 8.2**

### 属性 29: 内容类型应用对应样式

*对于任何*网格项，应该根据其内容类型应用适当的卡片样式和尺寸。
**验证需求: 8.3**

### 属性 30: 滚动触发交错动画

*对于任何*进入视口的网格项，应该播放交错的入场动画。
**验证需求: 8.4**

### 属性 31: 悬停应用提升效果

*对于任何*网格项，用户悬停时应该应用提升效果和阴影变化。
**验证需求: 8.5**

### 属性 32: 移动端优化布局

*对于任何*移动设备访问，应该显示针对小屏幕优化的布局。
**验证需求: 9.1**

### 属性 33: 平板端优化布局

*对于任何*平板设备访问，应该显示针对中等屏幕优化的布局。
**验证需求: 9.2**

### 属性 34: 桌面端完整布局

*对于任何*桌面设备访问，应该显示完整的桌面布局和所有功能。
**验证需求: 9.3**

### 属性 35: 首屏 3 秒内渲染

*对于任何*页面首次加载，首屏内容应该在 3 秒内完成渲染。
**验证需求: 9.4**

### 属性 36: 交互 100ms 内反馈

*对于任何*用户交互操作，应该在 100 毫秒内提供视觉反馈。
**验证需求: 9.5**

### 属性 37: 内容保存后立即更新

*对于任何*管理员的内容更改，保存后应该立即在数据库和前台更新。
**验证需求: 10.3**

### 属性 38: 项目卡片包含必需信息

*对于任何*项目展示，卡片应该包含缩略图、标题和简介。
**验证需求: 10.4**

### 属性 39: 点击卡片导航到详情

*对于任何*项目卡片，点击后应该导航到该项目的详情页面。
**验证需求: 10.5**

## 错误处理

### 认证错误

- **无效凭证**: 显示友好的错误消息，不泄露账户是否存在
- **邮箱未验证**: 提示用户检查邮箱并提供重发验证邮件选项
- **会话过期**: 自动重定向到登录页面，保存当前页面 URL 用于登录后返回
- **权限不足**: 显示 403 错误页面，提供返回首页链接

### 数据库错误

- **连接失败**: 显示"服务暂时不可用"消息，提供重试按钮
- **查询超时**: 显示加载超时提示，自动重试最多 3 次
- **数据验证失败**: 显示具体的验证错误信息，高亮错误字段
- **RLS 策略拒绝**: 记录日志但向用户显示通用的权限错误

### 实时连接错误

- **WebSocket 断开**: 自动重连，显示"正在重新连接"提示
- **订阅失败**: 降级到轮询模式，每 5 秒刷新一次数据
- **消息丢失**: 实现消息队列和重试机制

### UI 错误

- **组件加载失败**: 显示错误边界，提供刷新按钮
- **动画性能问题**: 检测设备性能，自动降级或禁用动画
- **3D 渲染失败**: 降级到 2D 版本的技能树展示

### 网络错误

- **请求超时**: 30 秒超时，显示错误提示并提供重试
- **离线状态**: 检测网络状态，显示离线提示，缓存用户操作
- **上传失败**: 实现断点续传，保存上传进度

## 测试策略

### 单元测试

使用 Vitest + React Testing Library 进行单元测试：

- **组件测试**: 测试每个 UI 组件的渲染和交互
- **工具函数测试**: 测试验证器、格式化器等纯函数
- **Hook 测试**: 测试自定义 React Hooks 的行为
- **状态管理测试**: 测试 Zustand stores 的状态变化

测试覆盖率目标: 80%

### 属性测试

使用 fast-check 进行基于属性的测试：

- **配置**: 每个属性测试运行最少 100 次迭代
- **标记**: 每个属性测试必须用注释标记对应的设计文档属性
  - 格式: `// Feature: portfolio-site, Property X: [属性描述]`
- **生成器**: 为每种数据类型编写智能生成器
  - 用户生成器: 生成有效的邮箱、密码组合
  - 留言生成器: 生成各种长度和字符的留言内容
  - 时间胶囊生成器: 生成标题、内容、可选图片
  - 技能生成器: 生成技能树结构，包括父子关系

### 集成测试

- **认证流程**: 测试完整的注册、验证、登录流程
- **实时功能**: 测试 Realtime 订阅和消息推送
- **权限控制**: 测试 RLS 策略在不同用户角色下的行为
- **文件上传**: 测试图片上传到 Supabase Storage

### E2E 测试

使用 Playwright 进行端到端测试：

- **关键用户流程**: 注册、登录、发表留言、查看项目
- **跨浏览器测试**: Chrome、Firefox、Safari
- **响应式测试**: 移动端、平板、桌面视口
- **性能测试**: 测量首屏加载时间、交互响应时间

### 性能测试

- **Lighthouse CI**: 每次部署自动运行，确保性能分数 > 90
- **Core Web Vitals**: 监控 LCP、FID、CLS 指标
- **Bundle 分析**: 使用 @next/bundle-analyzer 监控包大小

## UI/UX 设计指南

### 色彩系统

#### 浅色主题

```css
--background: 240 10% 98%;
--foreground: 240 10% 10%;
--primary: 240 100% 60%;
--secondary: 280 80% 65%;
--accent: 320 90% 60%;
--muted: 240 5% 90%;
--border: 240 10% 85%;
```

#### 深色主题

```css
--background: 240 10% 8%;
--foreground: 240 10% 98%;
--primary: 240 100% 70%;
--secondary: 280 80% 75%;
--accent: 320 90% 70%;
--muted: 240 5% 15%;
--border: 240 10% 20%;
```

### Glassmorphism 样式

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}

/* 深色主题 */
.dark .glass-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 动画规范

- **持续时间**:
  - 快速: 150ms (悬停、点击反馈)
  - 中等: 300ms (页面过渡、模态框)
  - 慢速: 500ms (复杂动画、3D 变换)
- **缓动函数**:
  - 入场: `cubic-bezier(0.16, 1, 0.3, 1)`
  - 出场: `cubic-bezier(0.7, 0, 0.84, 0)`
  - 交互: `cubic-bezier(0.4, 0, 0.2, 1)`

### 间距系统

使用 Tailwind 的间距比例，基于 4px:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### 字体系统

```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* 字号 */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
```

### Bento Grid 布局

```typescript
// 网格配置
const gridConfig = {
  mobile: {
    columns: 1,
    gap: '1rem',
  },
  tablet: {
    columns: 2,
    gap: '1.5rem',
  },
  desktop: {
    columns: 3,
    gap: '2rem',
  },
}

// 卡片尺寸变体
const cardSizes = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
}
```

## MCP 执行计划

### 初始化数据库

使用 Supabase MCP 工具初始化数据库架构：

#### 步骤 1: 创建迁移文件

```bash
# 创建初始架构迁移
mcp_supabase_apply_migration(
  name: "initial_schema",
  query: "-- 见数据模型部分的 SQL"
)
```

#### 步骤 2: 验证表创建

```bash
# 列出所有表
mcp_supabase_list_tables(schemas: ["public"])

# 预期输出:
# - profiles
# - guestbook
# - time_capsule
# - skills
# - projects
```

#### 步骤 3: 验证 RLS 策略

```bash
# 检查安全建议
mcp_supabase_get_advisors(type: "security")

# 确保所有表都启用了 RLS
# 确保所有策略都正确配置
```

#### 步骤 4: 生成 TypeScript 类型

```bash
# 生成数据库类型定义
mcp_supabase_generate_typescript_types()

# 输出到: lib/types/database.types.ts
```

#### 步骤 5: 插入初始数据

```sql
-- 创建管理员账户（需要手动在 Supabase Dashboard 创建）
-- 然后更新 profiles 表
INSERT INTO profiles (id, email, role, display_name)
VALUES (
  'admin-user-id',
  'admin@example.com',
  'admin',
  'Administrator'
);

-- 插入示例技能数据
INSERT INTO skills (name, category, proficiency, description) VALUES
  ('Next.js', 'Frontend', 95, 'React 框架'),
  ('TypeScript', 'Language', 90, '类型安全的 JavaScript'),
  ('Supabase', 'Backend', 85, 'BaaS 平台'),
  ('Tailwind CSS', 'Styling', 90, '实用优先的 CSS 框架');
```

### 持续维护

- **监控**: 定期运行 `get_advisors` 检查安全和性能问题
- **备份**: 配置 Supabase 自动备份
- **迁移**: 使用 `apply_migration` 进行架构变更
- **日志**: 使用 `get_logs` 调试问题

## 部署策略

### 开发环境

- **本地开发**: `npm run dev`
- **Supabase 本地**: 使用 Supabase CLI 本地实例
- **环境变量**: `.env.local`

### 预发布环境

- **Vercel Preview**: 每个 PR 自动部署预览
- **Supabase Branch**: 使用 Supabase 分支功能
- **测试**: 运行完整的测试套件

### 生产环境

- **平台**: Vercel
- **域名**: 自定义域名 + HTTPS
- **CDN**: Vercel Edge Network
- **监控**: Vercel Analytics + Sentry
- **CI/CD**: GitHub Actions
  - Lint 和类型检查
  - 运行测试
  - 构建验证
  - 自动部署到 Vercel

### 环境变量

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 其他
NEXT_PUBLIC_SITE_URL=
```

## 性能优化

### Next.js 优化

- **图片优化**: 使用 `next/image` 自动优化
- **字体优化**: 使用 `next/font` 自托管字体
- **代码分割**: 动态导入大型组件（Three.js）
- **SSG**: 静态生成公开页面（首页、关于、项目列表）
- **ISR**: 增量静态再生成（项目详情，revalidate: 60）

### 资源优化

- **Tree Shaking**: 移除未使用的代码
- **压缩**: Gzip/Brotli 压缩
- **缓存**: 配置适当的缓存头
- **预加载**: 关键资源预加载
- **懒加载**: 非关键组件懒加载

### 数据库优化

- **索引**: 为常用查询字段创建索引
- **连接池**: 配置适当的连接池大小
- **查询优化**: 使用 `select` 只获取需要的字段
- **分页**: 实现游标分页而非偏移分页

## 安全考虑

### 认证安全

- **密码策略**: 最少 8 字符，包含大小写字母和数字
- **会话管理**: 使用 HTTP-only cookies
- **CSRF 保护**: Next.js 内置 CSRF 保护
- **速率限制**: 限制登录尝试次数

### 数据安全

- **RLS**: 所有表启用行级安全
- **输入验证**: 客户端和服务端双重验证
- **XSS 防护**: React 自动转义，富文本使用 DOMPurify
- **SQL 注入**: 使用参数化查询

### API 安全

- **CORS**: 配置适当的 CORS 策略
- **API 密钥**: 使用环境变量，不提交到代码库
- **速率限制**: 使用 Vercel Edge Config 实现
- **日志**: 记录所有敏感操作

---

**设计文档完成！** 请查看完整的设计，包括正确性属性、错误处理、测试策略、UI/UX 指南和 MCP 执行计划。
