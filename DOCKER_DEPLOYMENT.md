# Docker 部署指南

## 📋 前置要求

- Docker 已安装（版本 20.10+）
- Docker Compose 已安装（版本 2.0+）
- 有效的 Supabase 项目配置

## 🚀 快速开始

### 1. 准备环境变量

复制环境变量模板并填入实际值：

```bash
cp .env.docker .env.production
```

编辑 `.env.production` 文件，填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=production
```

### 2. 构建 Docker 镜像

#### 方式一：使用构建脚本（推荐）

```bash
./build-docker.sh
```

#### 方式二：手动构建

```bash
docker build -t portfolio-site:latest .
```

### 3. 运行容器

#### 方式一：使用 Docker Compose（推荐）

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 方式二：使用 Docker 命令

```bash
docker run -d \
  --name portfolio-site \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  portfolio-site:latest
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`

## 🌐 部署到海外服务器

### 1. 将镜像推送到服务器

#### 方式一：保存并传输镜像

在本地机器上：

```bash
# 保存镜像为 tar 文件
docker save portfolio-site:latest | gzip > portfolio-site.tar.gz

# 传输到服务器
scp portfolio-site.tar.gz user@your-server:/path/to/destination/
```

在服务器上：

```bash
# 加载镜像
gunzip -c portfolio-site.tar.gz | docker load
```

#### 方式二：使用 Docker Registry

```bash
# 标记镜像
docker tag portfolio-site:latest your-registry/portfolio-site:latest

# 推送到 registry
docker push your-registry/portfolio-site:latest

# 在服务器上拉取
docker pull your-registry/portfolio-site:latest
```

### 2. 在服务器上运行

```bash
# 创建环境变量文件
nano .env.production

# 使用 docker-compose 启动
docker-compose up -d
```

### 3. 配置反向代理（可选）

使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 常用命令

### 查看运行状态

```bash
docker ps
docker-compose ps
```

### 查看日志

```bash
# Docker
docker logs portfolio-site -f

# Docker Compose
docker-compose logs -f
```

### 重启容器

```bash
# Docker
docker restart portfolio-site

# Docker Compose
docker-compose restart
```

### 更新应用

```bash
# 1. 重新构建镜像
docker build -t portfolio-site:latest .

# 2. 停止并删除旧容器
docker-compose down

# 3. 启动新容器
docker-compose up -d
```

### 清理资源

```bash
# 停止并删除容器
docker-compose down

# 删除镜像
docker rmi portfolio-site:latest

# 清理未使用的资源
docker system prune -a
```

## 📊 监控和维护

### 健康检查

容器配置了健康检查，每 30 秒检查一次应用状态。

查看健康状态：

```bash
docker inspect --format='{{.State.Health.Status}}' portfolio-site
```

### 资源使用

查看容器资源使用情况：

```bash
docker stats portfolio-site
```

### 备份数据

虽然应用是无状态的，但建议定期备份 Supabase 数据：

```bash
# 使用 Supabase CLI 或管理面板进行备份
```

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker logs portfolio-site

# 检查环境变量
docker exec portfolio-site env
```

### 端口冲突

如果 3000 端口被占用，修改 docker-compose.yml：

```yaml
ports:
  - '8080:3000' # 使用 8080 端口
```

### 连接 Supabase 失败

1. 检查环境变量是否正确
2. 确认服务器可以访问 Supabase（检查防火墙）
3. 验证 Supabase URL 和 API Key

### 镜像体积过大

当前配置已使用多阶段构建优化，镜像大小约 150-200MB。

## 🔒 安全建议

1. **不要将 .env.production 提交到 Git**
2. **使用 secrets 管理敏感信息**（生产环境）
3. **定期更新基础镜像**：`docker pull node:20-alpine`
4. **配置 HTTPS**（使用 Let's Encrypt）
5. **限制容器资源使用**

在 docker-compose.yml 中添加资源限制：

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

## 📈 性能优化

1. **启用 HTTP/2**（通过 Nginx）
2. **配置 CDN**（用于静态资源）
3. **使用 Redis 缓存**（如需要）
4. **启用 Gzip 压缩**（Nginx 配置）

## 🆘 获取帮助

如遇到问题：

1. 查看容器日志
2. 检查环境变量配置
3. 验证网络连接
4. 查看 Supabase 服务状态

## 📝 更新日志

- 2024-11-24: 初始版本，支持 Docker 和 Docker Compose 部署
