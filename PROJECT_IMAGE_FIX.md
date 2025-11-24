# 项目页面图片加载错误修复

## 问题描述

点击 Projects 页面时出现错误，页面崩溃无法显示。

## 根本原因

Next.js Image 组件需要配置允许的外部图片域名。项目数据库中使用了 Unsplash 的图片 URL (`images.unsplash.com`)，但 `next.config.mjs` 中只配置了 Supabase 域名。

## 修复内容

### 1. 更新 Next.js 配置 (next.config.mjs)

添加 Unsplash 域名到允许的图片源：

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.supabase.co',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
]
```

### 2. 增强 ProjectList 组件

- 添加 null 值检查：`project.tags || []`
- 添加图片加载失败的占位符
- 为 Unsplash 图片添加 `unoptimized` 属性

### 3. 增强 ProjectDetail 组件

- 添加 null 值检查：`project.tags || []`
- 添加图片加载失败的占位符
- 为 Unsplash 图片添加 `unoptimized` 属性

## 测试结果

✅ 构建成功
✅ 无 TypeScript 错误
✅ 项目页面现在可以正常访问

## 下一步

稍后将创建 Docker 镜像部署到海外服务器以解决 Supabase 连接问题。
