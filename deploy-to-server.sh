#!/bin/bash

# 服务器部署脚本
# 使用方法: ./deploy-to-server.sh

set -e

echo "🚀 Portfolio 网站 Docker 部署脚本"
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装${NC}"
    echo "请先安装 Docker: https://docs.docker.com/engine/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker 已安装${NC}"

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose 未安装，将使用 docker 命令${NC}"
    USE_COMPOSE=false
else
    echo -e "${GREEN}✅ Docker Compose 已安装${NC}"
    USE_COMPOSE=true
fi

echo ""

# 检查环境变量文件
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  未找到 .env.production 文件${NC}"
    echo "正在创建模板文件..."
    cp .env.docker .env.production
    echo ""
    echo -e "${YELLOW}请编辑 .env.production 文件，填入你的 Supabase 配置：${NC}"
    echo "  NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥"
    echo ""
    read -p "配置完成后按回车继续..."
fi

echo ""
echo "📦 开始构建 Docker 镜像..."
docker build -t portfolio-site:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 镜像构建成功${NC}"
else
    echo -e "${RED}❌ 镜像构建失败${NC}"
    exit 1
fi

echo ""
echo "🔄 停止并删除旧容器（如果存在）..."
docker stop portfolio-site 2>/dev/null || true
docker rm portfolio-site 2>/dev/null || true

echo ""
echo "🚀 启动新容器..."

if [ "$USE_COMPOSE" = true ]; then
    docker-compose up -d
else
    docker run -d \
        --name portfolio-site \
        -p 3000:3000 \
        --env-file .env.production \
        --restart unless-stopped \
        portfolio-site:latest
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 容器启动成功${NC}"
else
    echo -e "${RED}❌ 容器启动失败${NC}"
    exit 1
fi

echo ""
echo "⏳ 等待应用启动..."
sleep 5

echo ""
echo "📊 容器状态："
docker ps | grep portfolio-site

echo ""
echo "📝 查看日志："
echo "  docker logs portfolio-site -f"
echo ""
echo "🌐 访问地址："
echo "  http://localhost:3000"
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
