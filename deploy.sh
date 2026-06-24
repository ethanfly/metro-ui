#!/bin/bash

# Metro UI - 自动部署脚本
# 用法: ./deploy.sh [patch|minor|major]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Metro UI 自动部署脚本${NC}"
echo ""

# 检查必需的工具
check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ 未安装 $1，请先安装${NC}"
        exit 1
    fi
}

check_tool "git"
check_tool "npm"
check_tool "gh"

# 检查 Git 状态
echo -e "${YELLOW}📋 检查 Git 状态...${NC}"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ 有未提交的更改，请先提交${NC}"
    git status
    exit 1
fi
echo -e "${GREEN}✅ Git 状态正常${NC}"

# 检查 npm 登录
echo -e "${YELLOW}📋 检查 npm 登录状态...${NC}"
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ 未登录 npm，请先运行: npm login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm 已登录${NC}"

# 检查 GitHub 登录
echo -e "${YELLOW}📋 检查 GitHub 登录状态...${NC}"
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ 未登录 GitHub，请先运行: gh auth login${NC}"
    exit 1
fi
echo -e "${GREEN}✅ GitHub 已登录${NC}"

# 获取版本更新类型
VERSION_TYPE=${1:-patch}
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}❌ 无效的版本类型: $VERSION_TYPE${NC}"
    echo "用法: ./deploy.sh [patch|minor|major]"
    exit 1
fi

echo -e "${BLUE}📦 准备发布 ${VERSION_TYPE} 版本${NC}"

# 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 构建成功${NC}"

# 更新版本号
echo -e "${YELLOW}📝 更新版本号...${NC}"
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
echo -e "${GREEN}✅ 新版本: ${NEW_VERSION}${NC}"

# 提交更改
echo -e "${YELLOW}💾 提交更改...${NC}"
git add package.json package-lock.json
git commit -m "Release ${NEW_VERSION}"
echo -e "${GREEN}✅ 已提交${NC}"

# 创建标签
echo -e "${YELLOW}🏷️  创建标签...${NC}"
git tag ${NEW_VERSION}
echo -e "${GREEN}✅ 已创建标签 ${NEW_VERSION}${NC}"

# 推送到 GitHub
echo -e "${YELLOW}📤 推送到 GitHub...${NC}"
git push origin main
git push origin ${NEW_VERSION}
echo -e "${GREEN}✅ 已推送${NC}"

# 发布到 npm
echo -e "${YELLOW}📦 发布到 npm...${NC}"
npm publish --access public
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm 发布失败${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 已发布到 npm${NC}"

# 创建 GitHub Release
echo -e "${YELLOW}🎉 创建 GitHub Release...${NC}"
gh release create ${NEW_VERSION} \
  --title "Metro UI ${NEW_VERSION}" \
  --notes "Release ${NEW_VERSION}" \
  --draft=false \
  dist/metro-ui.css \
  dist/metro-ui.min.css \
  dist/metro-ui.js \
  dist/metro-ui.min.js

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ GitHub Release 创建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 已创建 GitHub Release${NC}"

echo ""
echo -e "${GREEN}🎊 部署完成！${NC}"
echo ""
echo -e "${BLUE}📊 发布信息:${NC}"
echo "  版本: ${NEW_VERSION}"
echo "  npm: https://www.npmjs.com/package/metro-ui-design-system"
echo "  GitHub: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/${NEW_VERSION}"
echo ""
echo -e "${YELLOW}⏱️  CDN 将在 5-30 分钟内自动更新${NC}"
