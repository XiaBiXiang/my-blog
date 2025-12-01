# GitHub Actions 自动部署到阿里云配置指南

## 📋 需要配置的 GitHub Secrets

访问：https://github.com/XiaBiXiang/my-blog/settings/secrets/actions

点击 **"New repository secret"** 添加以下 secrets：

### 1. 服务器连接信息

**SERVER_HOST**

- Name: `SERVER_HOST`
- Value: 你的阿里云服务器 IP 地址
- 示例: `123.456.789.0`

**SERVER_USER**

- Name: `SERVER_USER`
- Value: SSH 用户名
- 示例: `root` 或 `ubuntu`

**SERVER_SSH_KEY**

- Name: `SERVER_SSH_KEY`
- Value: SSH 私钥内容
- 获取方式见下方

**SERVER_PORT** (可选)

- Name: `SERVER_PORT`
- Value: SSH 端口
- 默认: `22`

### 2. Supabase 环境变量

**NEXT_PUBLIC_SUPABASE_URL**

- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: 你的 Supabase 项目 URL

**NEXT_PUBLIC_SUPABASE_ANON_KEY**

- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: 你的 Supabase 匿名密钥

---

## 🔑 获取 SSH 私钥

### 方式一：使用现有密钥（推荐）

如果你已经可以 SSH 登录服务器：

```bash
# 在本地查看私钥
cat ~/.ssh/id_rsa
```

复制整个内容（包括 `-----BEGIN` 和 `-----END` 行）

### 方式二：创建新的密钥对

```bash
# 1. 生成新密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key

# 2. 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server-ip

# 或手动添加
cat ~/.ssh/github_actions_key.pub
# 复制输出，然后在服务器上：
# echo "公钥内容" >> ~/.ssh/authorized_keys

# 3. 获取私钥内容
cat ~/.ssh/github_actions_key
```

---

## 🚀 部署流程

### 自动部署

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建 Docker 镜像
3. 构建成功后自动部署到阿里云服务器

### 手动部署

访问：https://github.com/XiaBiXiang/my-blog/actions/workflows/deploy.yml

点击 **"Run workflow"** → **"Run workflow"**

---

## 📝 服务器准备

### 1. 安装 Docker

```bash
# 在阿里云服务器上执行
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

### 2. 配置防火墙

```bash
# 开放 3000 端口
sudo ufw allow 3000/tcp

# 或使用阿里云控制台配置安全组规则
# 添加入站规则：端口 3000，协议 TCP，源 0.0.0.0/0
```

### 3. 测试 SSH 连接

```bash
# 在本地测试
ssh user@your-server-ip

# 测试 Docker
docker ps
```

---

## 🔍 验证配置

### 检查 Secrets 是否配置正确

所有必需的 secrets：

- ✅ SERVER_HOST
- ✅ SERVER_USER
- ✅ SERVER_SSH_KEY
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

### 测试部署

1. 推送一个小改动到 main 分支
2. 访问 Actions 页面查看进度
3. 等待部署完成
4. 访问 `http://your-server-ip:3000`

---

## 📊 工作流说明

### 触发条件

1. **自动触发**：当 Docker 镜像构建成功后
2. **手动触发**：在 Actions 页面手动运行

### 部署步骤

1. 连接到阿里云服务器
2. 拉取最新的 Docker 镜像
3. 停止并删除旧容器
4. 启动新容器
5. 清理旧镜像（保留 24 小时内的）

---

## 🐛 故障排查

### 问题 1: SSH 连接失败

**错误信息：** `Permission denied` 或 `Connection refused`

**解决方案：**

1. 检查 SERVER_HOST 是否正确
2. 检查 SERVER_USER 是否正确
3. 验证 SSH 私钥格式是否完整
4. 确认服务器防火墙允许 SSH 连接

### 问题 2: Docker 命令失败

**错误信息：** `docker: command not found`

**解决方案：**

1. 在服务器上安装 Docker
2. 确保 SSH 用户有权限运行 Docker
   ```bash
   sudo usermod -aG docker $USER
   ```

### 问题 3: 容器启动失败

**解决方案：**

1. 检查环境变量是否正确
2. 查看容器日志：
   ```bash
   docker logs portfolio-site
   ```
3. 检查端口是否被占用：
   ```bash
   sudo lsof -i :3000
   ```

### 问题 4: 镜像拉取失败

**错误信息：** `unauthorized` 或 `pull access denied`

**解决方案：**

1. 确认镜像已设置为公开
2. 或在服务器上登录 ghcr.io：
   ```bash
   echo YOUR_TOKEN | docker login ghcr.io -u xiabixiang --password-stdin
   ```

---

## 🔄 更新部署

每次推送到 main 分支，都会自动：

1. 构建新的 Docker 镜像
2. 部署到阿里云服务器
3. 自动重启应用

---

## 📈 监控部署

### 查看部署历史

访问：https://github.com/XiaBiXiang/my-blog/actions

### 查看服务器状态

```bash
# SSH 登录服务器
ssh user@your-server-ip

# 查看容器状态
docker ps

# 查看容器日志
docker logs portfolio-site -f

# 查看资源使用
docker stats portfolio-site
```

---

## 🎉 完成

配置完成后，你只需要：

1. 修改代码
2. 推送到 GitHub
3. 等待自动部署完成

就这么简单！🚀
