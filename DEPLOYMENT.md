# 部署指南

本文档提供了将作品集网站部署到生产环境的完整指南。

## 目录

- [环境要求](#环境要求)
- [Vercel 部署](#vercel-部署)
- [环境变量配置](#环境变量配置)
- [CI/CD 配置](#cicd-配置)
- [性能测试](#性能测试)
- [部署后验证](#部署后验证)
- [故障排除](#故障排除)

## 环境要求

### 必需条件

- Node.js 20.19.0 或更高版本
- npm 或 yarn 包管理器
- Supabase 项目（已配置数据库和认证）
- Vercel 账户（推荐）或其他 Next.js 托管平台

### 可选条件

- GitHub 账户（用于 CI/CD）
- 自定义域名
- Lighthouse CI 配置

## Vercel 部署

### 方式 1：通过 Vercel Dashboard（推荐）

1. **连接 GitHub 仓库**
   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

2. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **设置环境变量**

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-3 分钟）

### 方式 2：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

## 环境变量配置

### 必需的环境变量

在 Vercel Dashboard 或 `.env.production` 中配置：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 网站配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 可选的环境变量

```bash
# 分析和监控
NEXT_PUBLIC_GA_ID=your-google-analytics-id
SENTRY_DSN=your-sentry-dsn

# 功能开关
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 环境变量设置步骤

1. 在 Vercel Dashboard 中：
   - 进入项目设置
   - 选择 "Environment Variables"
   - 添加每个变量
   - 选择环境（Production, Preview, Development）

2. 本地开发：
   - 复制 `.env.example` 到 `.env.local`
   - 填写实际的值
   - 不要提交 `.env.local` 到版本控制

## CI/CD 配置

### GitHub Actions

项目已配置 GitHub Actions 工作流（`.github/workflows/ci.yml`）：

**触发条件：**

- Push 到 `main` 或 `develop` 分支
- Pull Request 到 `main` 或 `develop` 分支

**工作流步骤：**

1. Lint 检查
2. TypeScript 类型检查
3. 构建应用
4. 上传构建产物

### 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

步骤：

1. 进入 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 添加每个 secret

### Vercel 自动部署

Vercel 会自动：

- 在 Push 到 `main` 时部署到生产环境
- 在 Pull Request 时创建预览部署
- 在每次提交时运行构建检查

## 性能测试

### Lighthouse CI

#### 本地运行 Lighthouse

```bash
# 安装 Lighthouse
npm install -g @lhci/cli

# 构建应用
npm run build

# 启动生产服务器
npm start

# 在另一个终端运行 Lighthouse
lhci autorun --collect.url=http://localhost:3000
```

#### 目标性能指标

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 95
- **SEO**: ≥ 95

#### Core Web Vitals 目标

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 性能监控

使用 Vercel Analytics：

1. 在 Vercel Dashboard 启用 Analytics
2. 查看实时性能数据
3. 监控 Core Web Vitals

## 部署后验证

### 功能检查清单

- [ ] 首页正常加载
- [ ] 用户注册和登录功能正常
- [ ] 留言板实时更新工作正常
- [ ] 时间胶囊展示正常
- [ ] 项目列表和详情页正常
- [ ] 命令面板（CMD+K）正常工作
- [ ] 主题切换功能正常
- [ ] 管理员功能正常（如果有权限）
- [ ] 图片加载和优化正常
- [ ] 响应式设计在移动端正常

### 测试步骤

1. **基础功能测试**

   ```bash
   # 访问主要页面
   curl -I https://your-domain.com
   curl -I https://your-domain.com/projects
   curl -I https://your-domain.com/guestbook
   ```

2. **性能测试**

   ```bash
   # 使用 Lighthouse
   lighthouse https://your-domain.com --view
   ```

3. **安全检查**
   - 检查 HTTPS 是否启用
   - 验证安全头是否正确设置
   - 测试 RLS 策略是否生效

4. **跨浏览器测试**
   - Chrome
   - Firefox
   - Safari
   - Edge

5. **移动端测试**
   - iOS Safari
   - Android Chrome
   - 不同屏幕尺寸

### 监控和日志

1. **Vercel 日志**
   - 访问 Vercel Dashboard
   - 查看 "Deployments" 标签
   - 检查构建和运行时日志

2. **Supabase 日志**
   - 访问 Supabase Dashboard
   - 查看 "Logs" 部分
   - 监控数据库查询和错误

3. **错误追踪**
   - 考虑集成 Sentry 或类似服务
   - 监控客户端和服务器端错误

## 故障排除

### 常见问题

#### 1. 构建失败

**问题**: 构建过程中出错

**解决方案**:

```bash
# 清理缓存
rm -rf .next node_modules
npm install
npm run build
```

#### 2. 环境变量未生效

**问题**: 应用无法连接到 Supabase

**解决方案**:

- 检查 Vercel 环境变量是否正确设置
- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
- 重新部署应用

#### 3. 图片加载失败

**问题**: Supabase Storage 图片无法显示

**解决方案**:

- 检查 `next.config.mjs` 中的 `remotePatterns` 配置
- 验证 Supabase Storage 权限设置
- 检查图片 URL 是否正确

#### 4. 实时功能不工作

**问题**: 留言板不实时更新

**解决方案**:

- 检查 Supabase Realtime 是否启用
- 验证 RLS 策略允许订阅
- 检查浏览器控制台错误

#### 5. 性能问题

**问题**: 页面加载缓慢

**解决方案**:

- 运行 `npm run analyze` 检查 bundle 大小
- 确保图片使用 `next/image` 组件
- 检查是否有不必要的客户端 JavaScript
- 验证 ISR 配置是否正确

### 回滚部署

如果新部署出现问题：

1. **通过 Vercel Dashboard**:
   - 进入 "Deployments"
   - 找到之前的稳定版本
   - 点击 "Promote to Production"

2. **通过 Git**:
   ```bash
   # 回滚到上一个提交
   git revert HEAD
   git push origin main
   ```

## 生产环境最佳实践

### 安全

1. **环境变量**
   - 永远不要在代码中硬编码密钥
   - 使用 Vercel 环境变量管理敏感信息
   - 定期轮换 API 密钥

2. **RLS 策略**
   - 确保所有表都启用 RLS
   - 定期审查策略
   - 测试不同用户角色的权限

3. **HTTPS**
   - Vercel 自动提供 HTTPS
   - 强制所有流量使用 HTTPS
   - 配置安全头（已在 `vercel.json` 中配置）

### 性能

1. **缓存策略**
   - 静态资源使用长期缓存
   - API 响应使用适当的缓存头
   - 利用 ISR 减少服务器负载

2. **图片优化**
   - 始终使用 `next/image`
   - 配置适当的 `sizes` 属性
   - 使用 WebP/AVIF 格式

3. **代码分割**
   - 使用动态导入大型组件
   - 避免在首屏加载不必要的代码
   - 监控 bundle 大小

### 监控

1. **设置告警**
   - 配置 Vercel 告警
   - 监控错误率
   - 跟踪性能指标

2. **定期审查**
   - 每周检查性能指标
   - 审查错误日志
   - 分析用户行为

## 域名配置

### 添加自定义域名

1. 在 Vercel Dashboard:
   - 进入项目设置
   - 选择 "Domains"
   - 添加你的域名

2. 配置 DNS:
   - 添加 A 记录指向 Vercel IP
   - 或添加 CNAME 记录指向 `cname.vercel-dns.com`

3. 等待 DNS 传播（通常 24-48 小时）

### SSL 证书

Vercel 自动提供和续期 SSL 证书：

- 使用 Let's Encrypt
- 自动续期
- 支持通配符证书

## 扩展和优化

### 未来改进

1. **CDN 优化**
   - 考虑使用专门的图片 CDN
   - 配置地理位置路由

2. **数据库优化**
   - 添加数据库索引
   - 实施查询缓存
   - 考虑读写分离

3. **监控增强**
   - 集成 APM 工具
   - 添加自定义指标
   - 实施用户行为分析

## 支持和资源

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Web.dev 性能指南](https://web.dev/performance/)

## 总结

完成以上步骤后，你的作品集网站应该已经成功部署到生产环境。记得：

1. ✅ 配置所有必需的环境变量
2. ✅ 运行性能测试
3. ✅ 验证所有功能正常工作
4. ✅ 设置监控和告警
5. ✅ 配置自定义域名（可选）

如有问题，请参考故障排除部分或查阅相关文档。
