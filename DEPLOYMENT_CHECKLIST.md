# 🚀 Docker 部署检查清单

## 📋 部署前准备

### 本地准备

- [ ] 代码已提交到 Git 仓库
- [ ] 已测试应用功能正常
- [ ] 已准备好 Supabase 配置信息
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY

### 服务器准备

- [ ] 服务器已安装 Docker（版本 20.10+）
- [ ] 服务器已安装 Docker Compose（可选，推荐）
- [ ] 服务器可以访问 Supabase（测试连接）
- [ ] 防火墙已开放必要端口
  - [ ] 3000 端口（应用端口）
  - [ ] 80 端口（HTTP，如使用 Nginx）
  - [ ] 443 端口（HTTPS，如使用 Nginx）

## 🔧 部署步骤

### 方式一：直接在服务器上构建（推荐）

1. **上传代码到服务器**

   ```bash
   # 使用 Git
   ssh user@your-server
   git clone your-repo-url
   cd portfolio-site

   # 或使用 scp
   tar -czf portfolio.tar.gz --exclude=node_modules --exclude=.next .
   scp portfolio.tar.gz user@your-server:/path/to/destination/
   ```

   - [ ] 代码已上传

2. **配置环境变量**

   ```bash
   cp .env.docker .env.production
   nano .env.production
   ```

   - [ ] 已创建 .env.production
   - [ ] 已填入正确的 Supabase 配置

3. **构建和运行**

   ```bash
   # 使用部署脚本（推荐）
   ./deploy-to-server.sh

   # 或手动执行
   docker build -t portfolio-site:latest .
   docker-compose up -d
   ```

   - [ ] 镜像构建成功
   - [ ] 容器启动成功

### 方式二：本地构建后传输

1. **本地构建镜像**

   ```bash
   ./build-docker.sh
   docker save portfolio-site:latest | gzip > portfolio-site.tar.gz
   ```

   - [ ] 镜像构建成功
   - [ ] 镜像已保存为 tar.gz

2. **传输到服务器**

   ```bash
   scp portfolio-site.tar.gz user@your-server:/path/to/destination/
   ```

   - [ ] 镜像已传输到服务器

3. **在服务器上加载和运行**
   ```bash
   ssh user@your-server
   gunzip -c portfolio-site.tar.gz | docker load
   # 创建 .env.production
   docker-compose up -d
   ```

   - [ ] 镜像已加载
   - [ ] 容器启动成功

## ✅ 部署后验证

### 基础检查

- [ ] 容器正在运行

  ```bash
  docker ps | grep portfolio-site
  ```

- [ ] 应用可以访问

  ```bash
  curl http://localhost:3000
  ```

- [ ] 日志无错误
  ```bash
  docker logs portfolio-site
  ```

### 功能测试

- [ ] 首页可以正常访问
- [ ] 项目页面可以正常显示
- [ ] 图片可以正常加载
- [ ] 可以连接到 Supabase
- [ ] 登录功能正常（如果已配置）
- [ ] 注册功能正常（如果已配置）

### 性能检查

- [ ] 页面加载速度正常
- [ ] 内存使用合理
  ```bash
  docker stats portfolio-site
  ```

## 🌐 配置域名（可选）

### 使用 Nginx 反向代理

- [ ] Nginx 已安装
- [ ] 已创建 Nginx 配置文件
- [ ] 配置已启用
- [ ] Nginx 已重启
- [ ] 可以通过域名访问

### 配置 HTTPS

- [ ] Certbot 已安装
- [ ] SSL 证书已申请
- [ ] HTTPS 可以正常访问
- [ ] HTTP 自动重定向到 HTTPS

## 🔒 安全检查

- [ ] .env.production 未提交到 Git
- [ ] 容器以非 root 用户运行
- [ ] 防火墙规则已配置
- [ ] 只开放必要的端口
- [ ] 已配置容器自动重启
- [ ] 已设置资源限制（可选）

## 📊 监控设置（可选）

- [ ] 配置日志收集
- [ ] 配置健康检查
- [ ] 配置告警通知
- [ ] 配置备份策略

## 📝 文档记录

- [ ] 记录服务器 IP 地址
- [ ] 记录域名配置
- [ ] 记录部署时间
- [ ] 记录使用的镜像版本
- [ ] 记录环境变量配置位置

## 🎉 部署完成

恭喜！你的 Portfolio 网站已成功部署到 Docker 容器中。

### 常用命令

```bash
# 查看状态
docker ps
docker-compose ps

# 查看日志
docker logs portfolio-site -f
docker-compose logs -f

# 重启
docker restart portfolio-site
docker-compose restart

# 停止
docker stop portfolio-site
docker-compose down

# 更新应用
git pull
docker-compose down
docker-compose up -d --build
```

### 访问地址

- 本地: http://localhost:3000
- 服务器: http://your-server-ip:3000
- 域名: http://your-domain.com

## 🆘 遇到问题？

参考详细文档：

- `DOCKER_DEPLOYMENT.md` - 完整部署指南
- `DOCKER_QUICK_START.md` - 快速开始指南

常见问题：

1. 容器无法启动 → 查看日志 `docker logs portfolio-site`
2. 无法访问 → 检查防火墙和端口
3. Supabase 连接失败 → 验证环境变量
4. 镜像构建失败 → 检查 Node.js 版本和依赖
