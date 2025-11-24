# GitHub Actions 自动构建 Docker 镜像

## 📋 概述

已创建 GitHub Actions 工作流，可以自动构建 Docker 镜像并推送到 GitHub Container Registry (ghcr.io)。

## 🚀 工作流配置

### 文件位置

`.github/workflows/docker-build.yml`

### 触发条件

- ✅ 推送到 `main` 分支时自动构建
- ✅ 创建版本标签时构建（如 `v1.0.0`）
- ✅ 手动触发（在 GitHub Actions 页面）

### 构建特性

- ✅ 多平台支持：`linux/amd64` 和 `linux/arm64`
- ✅ 自动标签管理
- ✅ 构建缓存优化
- ✅ 推送到 GitHub Container Registry

## 🔧 设置步骤

### 1. 确保 Dockerfile 已提交

```bash
git add Dockerfile .dockerignore docker-compose.yml
git commit -m "添加 Docker 配置文件"
git push origin main
```

### 2. 配置 GitHub 仓库权限

#### 方式一：自动配置（推荐）

GitHub Actions 会自动使用 `GITHUB_TOKEN`，无需额外配置。

#### 方式二：手动检查权限

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Actions** → **General**
3. 在 **Workflow permissions** 部分
4. 选择 **Read and write permissions**
5. 勾选 **Allow GitHub Actions to create and approve pull requests**
6. 点击 **Save**

### 3. 推送代码触发构建

```bash
# 推送到 main 分支会自动触发构建
git push origin main

# 或者创建版本标签
git tag v1.0.0
git push origin v1.0.0
```

### 4. 查看构建进度

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看 "Build and Push Docker Image" 工作流
4. 点击最新的运行查看详细日志

## 📦 使用构建的镜像

### 查看可用镜像

访问：`https://github.com/你的用户名/你的仓库名/pkgs/container/你的仓库名`

或者在仓库首页右侧的 **Packages** 部分查看。

### 拉取镜像

```bash
# 拉取最新版本
docker pull ghcr.io/你的用户名/你的仓库名:latest

# 拉取特定版本
docker pull ghcr.io/你的用户名/你的仓库名:v1.0.0

# 拉取特定提交
docker pull ghcr.io/你的用户名/你的仓库名:main-abc1234
```

### 运行容器

```bash
docker run -d \
  --name portfolio-site \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=你的Supabase_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase_Key \
  --restart unless-stopped \
  ghcr.io/你的用户名/你的仓库名:latest
```

## 🏷️ 镜像标签说明

工作流会自动创建以下标签：

| 标签格式       | 说明                 | 示例           |
| -------------- | -------------------- | -------------- |
| `latest`       | 最新的 main 分支构建 | `latest`       |
| `main`         | main 分支的最新构建  | `main`         |
| `v1.0.0`       | 版本标签             | `v1.0.0`       |
| `1.0`          | 主版本号.次版本号    | `1.0`          |
| `main-abc1234` | 分支名-提交SHA       | `main-abc1234` |

## 🔐 镜像可见性设置

### 设置为公开（推荐用于开源项目）

1. 进入 GitHub 仓库
2. 点击右侧 **Packages** 中的镜像
3. 点击 **Package settings**
4. 在 **Danger Zone** 部分
5. 点击 **Change visibility**
6. 选择 **Public**
7. 确认更改

### 私有镜像认证

如果镜像是私有的，需要先登录：

```bash
# 创建 Personal Access Token (PAT)
# Settings → Developer settings → Personal access tokens → Tokens (classic)
# 勾选 read:packages 权限

# 登录
echo YOUR_PAT | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 然后就可以拉取私有镜像
docker pull ghcr.io/你的用户名/你的仓库名:latest
```

## 🌐 在服务器上部署

### 方式一：直接拉取运行

```bash
# 在服务器上
docker pull ghcr.io/你的用户名/你的仓库名:latest

docker run -d \
  --name portfolio-site \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=你的URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Key \
  --restart unless-stopped \
  ghcr.io/你的用户名/你的仓库名:latest
```

### 方式二：使用 docker-compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  portfolio:
    image: ghcr.io/你的用户名/你的仓库名:latest
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NODE_ENV=production
    restart: unless-stopped
```

然后运行：

```bash
docker-compose up -d
```

### 方式三：自动更新脚本

创建 `update-container.sh`：

```bash
#!/bin/bash

IMAGE="ghcr.io/你的用户名/你的仓库名:latest"
CONTAINER="portfolio-site"

echo "🔄 拉取最新镜像..."
docker pull $IMAGE

echo "🛑 停止旧容器..."
docker stop $CONTAINER 2>/dev/null || true
docker rm $CONTAINER 2>/dev/null || true

echo "🚀 启动新容器..."
docker run -d \
  --name $CONTAINER \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --restart unless-stopped \
  $IMAGE

echo "✅ 更新完成！"
docker ps | grep $CONTAINER
```

使用：

```bash
chmod +x update-container.sh
./update-container.sh
```

## 🐛 故障排查

### 问题 1: 权限错误

**错误信息：**

```
Error: failed to push: denied: permission_denied
```

**解决方案：**

1. 检查仓库的 Actions 权限设置
2. 确保选择了 "Read and write permissions"

### 问题 2: 构建失败

**解决方案：**

1. 查看 Actions 日志中的详细错误信息
2. 确保 Dockerfile 语法正确
3. 确保所有依赖文件都已提交

### 问题 3: 无法拉取镜像

**错误信息：**

```
Error response from daemon: pull access denied
```

**解决方案：**

1. 检查镜像是否设置为公开
2. 如果是私有镜像，需要先登录 ghcr.io
3. 检查镜像名称是否正确

### 问题 4: 构建超时

**解决方案：**

1. 检查 .dockerignore 是否正确配置
2. 使用构建缓存（已在工作流中配置）
3. 考虑减少构建层数

## 📊 监控构建

### 查看构建历史

```bash
# 使用 GitHub CLI
gh run list --workflow=docker-build.yml

# 查看特定运行的日志
gh run view RUN_ID --log
```

### 构建状态徽章

在 README.md 中添加：

```markdown
![Docker Build](https://github.com/你的用户名/你的仓库名/actions/workflows/docker-build.yml/badge.svg)
```

## 🎯 最佳实践

1. **使用版本标签**

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **定期清理旧镜像**
   - 在 GitHub Package 设置中配置保留策略

3. **使用环境变量**
   - 不要在镜像中硬编码敏感信息
   - 使用 `-e` 参数或 `.env` 文件

4. **监控镜像大小**
   - 当前配置使用多阶段构建，镜像约 150-200MB
   - 定期检查是否有优化空间

## 🔄 持续部署

### 自动部署到服务器

可以添加部署步骤到工作流：

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SERVER_SSH_KEY }}
    script: |
      docker pull ghcr.io/${{ github.repository }}:latest
      docker stop portfolio-site || true
      docker rm portfolio-site || true
      docker run -d --name portfolio-site -p 3000:3000 \
        -e NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }} \
        -e NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }} \
        ghcr.io/${{ github.repository }}:latest
```

需要在 GitHub Secrets 中添加：

- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_SSH_KEY`

## ✅ 完成

现在每次推送到 main 分支，GitHub Actions 都会自动构建 Docker 镜像并推送到 GitHub Container Registry！

---

**创建时间：** 2024-11-24
