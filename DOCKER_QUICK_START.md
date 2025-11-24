# Docker 快速部署指南

## 🎯 部署步骤总览

### 在本地准备（如果本地有 Docker）

1. **安装 Docker**（如果还没安装）
   - macOS: 下载 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - 或使用 Homebrew: `brew install --cask docker`

2. **准备环境变量**

   ```bash
   cp .env.docker .env.production
   # 编辑 .env.production，填入你的 Supabase 配置
   ```

3. **构建镜像**

   ```bash
   ./build-docker.sh
   ```

4. **保存镜像用于传输**
   ```bash
   docker save portfolio-site:latest | gzip > portfolio-site.tar.gz
   ```

### 直接在服务器上构建（推荐）

如果你的海外服务器已经安装了 Docker，可以直接在服务器上构建：

1. **上传代码到服务器**

   ```bash
   # 方式一：使用 Git
   git clone your-repo-url
   cd portfolio-site

   # 方式二：使用 scp 上传
   tar -czf portfolio-site.tar.gz --exclude=node_modules --exclude=.next .
   scp portfolio-site.tar.gz user@your-server:/path/to/destination/
   ```

2. **在服务器上构建和运行**

   ```bash
   # SSH 登录到服务器
   ssh user@your-server

   # 进入项目目录
   cd /path/to/portfolio-site

   # 创建环境变量文件
   nano .env.production
   # 填入以下内容：
   # NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   # NODE_ENV=production

   # 构建镜像
   docker build -t portfolio-site:latest .

   # 运行容器
   docker run -d \
     --name portfolio-site \
     -p 3000:3000 \
     --env-file .env.production \
     --restart unless-stopped \
     portfolio-site:latest

   # 或使用 docker-compose
   docker-compose up -d
   ```

3. **查看运行状态**
   ```bash
   docker ps
   docker logs portfolio-site -f
   ```

## 🌐 配置域名访问（可选）

### 使用 Nginx 反向代理

1. **安装 Nginx**

   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **配置 Nginx**

   ```bash
   sudo nano /etc/nginx/sites-available/portfolio
   ```

   添加以下配置：

   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

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

3. **启用配置**

   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **配置 HTTPS（推荐）**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## 📦 文件清单

已创建的 Docker 相关文件：

- ✅ `Dockerfile` - Docker 镜像构建文件
- ✅ `.dockerignore` - Docker 构建忽略文件
- ✅ `docker-compose.yml` - Docker Compose 配置
- ✅ `.env.docker` - 环境变量模板
- ✅ `build-docker.sh` - 构建脚本
- ✅ `DOCKER_DEPLOYMENT.md` - 详细部署文档
- ✅ `next.config.mjs` - 已更新支持 standalone 模式

## 🔑 需要的环境变量

从你的 `.env.local` 文件中获取以下值：

```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## ⚡ 快速命令参考

```bash
# 构建镜像
docker build -t portfolio-site:latest .

# 运行容器
docker run -d --name portfolio-site -p 3000:3000 --env-file .env.production portfolio-site:latest

# 查看日志
docker logs portfolio-site -f

# 停止容器
docker stop portfolio-site

# 删除容器
docker rm portfolio-site

# 重启容器
docker restart portfolio-site

# 使用 docker-compose
docker-compose up -d        # 启动
docker-compose down         # 停止
docker-compose logs -f      # 查看日志
docker-compose restart      # 重启
```

## 🎉 完成！

部署完成后，访问：

- 本地测试: `http://localhost:3000`
- 服务器: `http://your-server-ip:3000`
- 域名: `http://your-domain.com`（配置 Nginx 后）

## 💡 提示

1. 确保服务器防火墙开放了 3000 端口（或 Nginx 的 80/443 端口）
2. 海外服务器可以正常访问 Supabase，解决了国内网络问题
3. 使用 `docker-compose` 更方便管理容器
4. 定期更新镜像以获取最新代码

## 🆘 遇到问题？

查看详细文档：`DOCKER_DEPLOYMENT.md`
