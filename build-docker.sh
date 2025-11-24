#!/bin/bash

# Docker 镜像构建脚本

set -e

echo "🚀 开始构建 Docker 镜像..."

# 镜像名称和标签
IMAGE_NAME="portfolio-site"
IMAGE_TAG="latest"

# 构建镜像
echo "📦 构建镜像: ${IMAGE_NAME}:${IMAGE_TAG}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

echo "✅ 镜像构建完成！"
echo ""
echo "📋 可用命令："
echo "  查看镜像: docker images | grep ${IMAGE_NAME}"
echo "  运行容器: docker run -p 3000:3000 --env-file .env.production ${IMAGE_NAME}:${IMAGE_TAG}"
echo "  使用 docker-compose: docker-compose up -d"
echo ""
echo "💡 提示: 请确保已创建 .env.production 文件并配置了正确的环境变量"
