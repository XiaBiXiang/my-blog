#!/bin/bash

# 从 GitHub Container Registry 部署脚本
# 使用方法: ./deploy-from-github.sh

set -e

echo "🚀 从 GitHub 部署 Portfolio 网站"
echo "=================================="
echo ""

# 配置
IMAGE="ghcr.io/xiabixiang/my-blog:latest"
CONTAINER_NAME="portfolio-site"
PORT="3000"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查环境变量
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}⚠️  环境变量未设置${NC}"
    echo ""
    echo "请设置以下环境变量："
    echo "  export NEXT_PUBLIC_SUPABASE_URL='你的Supabase_URL'"
    echo "  export NEXT_PUBLIC_SUPABASE_ANON_KEY='你的Supabase_Key'"
    echo ""
    echo "或者创建 .env 文件："
    echo "  NEXT_PUBLIC_SUPABASE_URL=你的URL"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Key"
    echo ""
    read -p "是否从 .env 文件加载？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f .env ]; then
            export $(cat .env | xargs)
            echo -e "${GREEN}✅ 已从 .env 文件加载环境变量${NC}"
        else
            echo -e "${RED}❌ .env 文件不存在${NC}"
            exit 1
        fi
    else
        exit 1
    fi
fi

echo "📥 拉取最新镜像..."
docker pull $IMAGE

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 拉取镜像失败${NC}"
    echo ""
    echo "可能的原因："
    echo "1. 镜像是私有的，需要先登录"
    echo "2. 网络连接问题"
    echo ""
    echo "如果镜像是私有的，请先登录："
    echo "  echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u xiabixiang --password-stdin"
    exit 1
fi

echo -e "${GREEN}✅ 镜像拉取成功${NC}"
echo ""

echo "🛑 停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo ""
echo "🚀 启动新容器..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    -e NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -e NODE_ENV=production \
    --restart unless-stopped \
    $IMAGE

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
docker ps | grep $CONTAINER_NAME

echo ""
echo "📝 查看日志："
echo "  docker logs $CONTAINER_NAME -f"
echo ""
echo "🌐 访问地址："
echo "  http://localhost:$PORT"
echo "  http://$(hostname -I | awk '{print $1}'):$PORT"
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
