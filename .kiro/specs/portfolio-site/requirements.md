# 需求文档

## 简介

本项目旨在构建一个现代化的个人作品集网站，采用 Glassmorphism（玻璃态）和 Bento Grid（便当盒网格）设计风格，配合流畅的动画效果。网站将集成用户认证、实时留言板、时间胶囊、命令面板和交互式技能树等创新功能，所有数据通过 Supabase 进行管理。

## 术语表

- **System**: 作品集网站系统
- **User**: 访问网站的普通用户
- **Admin**: 网站管理员，拥有特殊权限
- **Guestbook**: 实时留言板，用户可以发表留言
- **Time Capsule**: 时间胶囊，管理员专属的微博客/状态更新功能
- **Command Palette**: 命令面板，通过 CMD+K 快捷键触发的极客风格导航工具
- **Skill Tree**: 技能树，3D/游戏化的技能可视化展示
- **Supabase**: 后端服务平台，提供认证、数据库和实时功能
- **MCP**: Model Context Protocol，用于管理数据库架构和 RLS 策略
- **RLS**: Row Level Security，行级安全策略
- **Glassmorphism**: 玻璃态设计风格，具有半透明、模糊背景效果
- **Bento Grid**: 便当盒网格布局，不规则的卡片式网格系统

## 需求

### 需求 1：用户认证系统

**用户故事：** 作为一个访客，我希望能够注册账号并登录，以便我可以使用网站的交互功能。

#### 验收标准

1. WHEN 用户访问注册页面 THEN System SHALL 显示包含邮箱和密码输入字段的注册表单
2. WHEN 用户提交有效的注册信息 THEN System SHALL 在 Supabase 中创建新用户账户并发送验证邮件
3. WHEN 用户点击验证邮件中的链接 THEN System SHALL 激活用户账户并允许登录
4. WHEN 已注册用户提交正确的登录凭证 THEN System SHALL 验证用户身份并创建会话
5. WHEN 用户会话过期或用户主动登出 THEN System SHALL 清除会话并重定向到登录页面

### 需求 2：实时留言板功能

**用户故事：** 作为一个已登录用户，我希望能够在留言板上发表留言并实时看到其他用户的留言，以便我可以与其他访客互动。

#### 验收标准

1. WHEN 已登录用户访问留言板页面 THEN System SHALL 显示所有留言的列表，按时间倒序排列
2. WHEN 已登录用户在输入框中输入留言内容并提交 THEN System SHALL 将留言保存到 Supabase 数据库并立即显示在留言列表中
3. WHEN 其他用户发表新留言 THEN System SHALL 通过 Supabase Realtime 实时推送更新到所有在线用户的留言板
4. WHEN 留言内容为空或仅包含空白字符 THEN System SHALL 阻止提交并显示错误提示
5. WHEN 用户是留言的作者或管理员 THEN System SHALL 显示删除按钮允许删除该留言

### 需求 3：时间胶囊功能

**用户故事：** 作为管理员，我希望能够发布时间胶囊内容（微博客/状态更新），以便我可以分享我的想法和动态。

#### 验收标准

1. WHEN Admin 访问时间胶囊管理页面 THEN System SHALL 显示发布新胶囊的表单和已发布胶囊的列表
2. WHEN Admin 提交新的时间胶囊内容 THEN System SHALL 将内容保存到 Supabase 数据库并在前台展示
3. WHEN User 访问时间胶囊页面 THEN System SHALL 显示所有已发布的时间胶囊，按时间倒序排列
4. WHEN Admin 选择编辑或删除时间胶囊 THEN System SHALL 允许修改或删除该内容
5. WHEN 非管理员用户尝试访问时间胶囊管理功能 THEN System SHALL 拒绝访问并显示权限不足提示

### 需求 4：命令面板导航

**用户故事：** 作为用户，我希望能够通过 CMD+K（或 CTRL+K）快捷键打开命令面板，以便我可以快速导航到网站的不同部分。

#### 验收标准

1. WHEN 用户在网站任意页面按下 CMD+K（Mac）或 CTRL+K（Windows/Linux）THEN System SHALL 显示命令面板弹窗
2. WHEN 命令面板打开 THEN System SHALL 显示可用命令列表，包括导航到各个页面、主题切换等功能
3. WHEN 用户在命令面板中输入搜索关键词 THEN System SHALL 实时过滤并显示匹配的命令
4. WHEN 用户选择一个命令并按下回车 THEN System SHALL 执行该命令并关闭命令面板
5. WHEN 用户按下 ESC 键或点击面板外部区域 THEN System SHALL 关闭命令面板

### 需求 5：交互式技能树展示

**用户故事：** 作为访客，我希望能够查看一个交互式的技能树，以便我可以直观地了解网站所有者的技能和专长。

#### 验收标准

1. WHEN 用户访问技能树页面 THEN System SHALL 渲染一个 3D 或游戏化风格的技能树可视化界面
2. WHEN 用户将鼠标悬停在技能节点上 THEN System SHALL 显示该技能的详细信息（名称、熟练度、描述）
3. WHEN 用户点击技能节点 THEN System SHALL 展开该节点显示相关的子技能或项目案例
4. WHEN 技能树加载完成 THEN System SHALL 播放流畅的入场动画效果
5. WHEN 用户在移动设备上访问技能树 THEN System SHALL 提供触摸友好的交互方式（点击、滑动、缩放）

### 需求 6：数据库架构管理

**用户故事：** 作为系统架构师，我希望通过 MCP 管理 Supabase 数据库架构和 RLS 策略，以便确保数据安全和结构清晰。

#### 验收标准

1. WHEN 系统初始化 THEN System SHALL 通过 MCP 在 Supabase 中创建所有必需的数据表（users、guestbook、time_capsule、skills 等）
2. WHEN 数据表创建完成 THEN System SHALL 为每个表配置适当的 RLS 策略以保护数据安全
3. WHEN 用户尝试访问数据 THEN System SHALL 通过 RLS 策略验证用户权限并仅返回授权数据
4. WHEN 需要修改数据库架构 THEN System SHALL 通过 MCP 执行迁移脚本并保持数据完整性
5. WHEN Admin 查询数据库状态 THEN System SHALL 通过 MCP 提供表结构、索引和 RLS 策略的详细信息

### 需求 7：Glassmorphism UI 设计

**用户故事：** 作为用户，我希望网站具有现代化的玻璃态设计风格，以便获得视觉上令人愉悦的浏览体验。

#### 验收标准

1. WHEN 用户访问网站任意页面 THEN System SHALL 应用 Glassmorphism 设计风格，包括半透明背景、模糊效果和微妙的边框
2. WHEN 页面元素重叠 THEN System SHALL 确保背景模糊效果正确应用，保持视觉层次清晰
3. WHEN 用户切换深色/浅色主题 THEN System SHALL 调整玻璃态效果的透明度和颜色以适应主题
4. WHEN 页面加载或元素出现 THEN System SHALL 播放流畅的淡入和缩放动画
5. WHEN 用户与交互元素（按钮、卡片）互动 THEN System SHALL 提供微妙的悬停和点击动画反馈

### 需求 8：Bento Grid 布局系统

**用户故事：** 作为用户，我希望网站采用 Bento Grid 布局，以便内容以有趣且有组织的方式呈现。

#### 验收标准

1. WHEN 用户访问首页 THEN System SHALL 使用 Bento Grid 布局展示不同的内容模块（简介、项目、技能等）
2. WHEN 页面在不同屏幕尺寸上显示 THEN System SHALL 响应式调整网格布局，确保在移动设备和桌面设备上都美观
3. WHEN 网格项包含不同类型的内容 THEN System SHALL 为每种内容类型应用适当的卡片样式和尺寸
4. WHEN 用户滚动页面 THEN System SHALL 为进入视口的网格项播放交错的入场动画
5. WHEN 用户悬停在网格项上 THEN System SHALL 应用微妙的提升效果和阴影变化

### 需求 9：响应式设计和性能优化

**用户故事：** 作为用户，我希望网站在各种设备上都能快速加载并流畅运行，以便获得良好的用户体验。

#### 验收标准

1. WHEN 用户在移动设备上访问网站 THEN System SHALL 显示针对小屏幕优化的布局和导航
2. WHEN 用户在平板设备上访问网站 THEN System SHALL 显示针对中等屏幕优化的布局
3. WHEN 用户在桌面设备上访问网站 THEN System SHALL 显示完整的桌面布局和所有功能
4. WHEN 页面首次加载 THEN System SHALL 在 3 秒内完成首屏内容的渲染
5. WHEN 用户执行交互操作 THEN System SHALL 在 100 毫秒内提供视觉反馈

### 需求 10：内容管理和展示

**用户故事：** 作为管理员，我希望能够管理网站的内容（项目、博客文章、关于我等），以便保持网站内容的更新。

#### 验收标准

1. WHEN Admin 访问内容管理页面 THEN System SHALL 显示所有内容类型的管理界面
2. WHEN Admin 创建或编辑项目 THEN System SHALL 提供富文本编辑器和图片上传功能
3. WHEN Admin 保存内容更改 THEN System SHALL 将更改保存到 Supabase 数据库并立即在前台更新
4. WHEN User 访问项目展示页面 THEN System SHALL 以卡片形式展示所有项目，包括缩略图、标题和简介
5. WHEN User 点击项目卡片 THEN System SHALL 导航到项目详情页面，显示完整的项目信息和图片
