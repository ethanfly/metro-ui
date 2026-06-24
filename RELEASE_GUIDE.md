# Metro UI - 发布指南

## 📋 准备工作

### 1. 安装必需工具

#### 安装 GitHub CLI (gh)
访问 https://cli.github.com/ 下载并安装：
- Windows: 下载 `.msi` 安装包
- 或使用 npm: `npm install -g @github-cli/cli`

#### 验证安装
```bash
gh --version
gh auth status
```

### 2. 登录账户

```bash
# 登录 GitHub
gh auth login

# 登录 npm
npm login
```

## 🚀 发布流程

### 步骤 1: 创建 GitHub 仓库

```bash
# 初始化 Git（如果还未初始化）
git init
git add .
git commit -m "Initial commit: Metro UI Design System v1.0.0"

# 创建 GitHub 仓库并推送
gh repo create metro-ui-design-system --public --source=. --remote=origin --push
```

### 步骤 2: 发布到 npm

```bash
# 确保已构建
npm run build

# 发布到 npm
npm publish --access public
```

### 步骤 3: 创建 GitHub Release

```bash
# 创建标签
git tag v1.0.0
git push origin v1.0.0

# 创建 Release
gh release create v1.0.0 \
  --title "Metro UI v1.0.0" \
  --notes "首次发布！包含 Live Tiles、增强表单组件、自定义下拉框等完整功能。" \
  --draft=false
```

## 🔄 自动发布设置 (GitHub Actions)

项目已包含 `.github/workflows/publish.yml`，当你：
- 推送新的 tag（如 `v1.0.1`）到 GitHub
- GitHub Actions 会自动：
  1. 构建项目
  2. 运行测试
  3. 发布到 npm（需要配置 NPM_TOKEN）

### 配置 NPM_TOKEN

1. 访问 https://www.npmjs.com/settings/~/tokens
2. 创建新的 Access Token（选择 "Publish" 权限）
3. 在 GitHub 仓库中添加 Secret：
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `NPM_TOKEN`
   - Value: 你复制的 npm token

## 📝 更新版本

### 方法 1: 使用 npm version

```bash
# 更新补丁版本 (1.0.0 → 1.0.1)
npm version patch

# 更新次要版本 (1.0.0 → 1.1.0)
npm version minor

# 更新主要版本 (1.0.0 → 2.0.0)
npm version major
```

这会自动：
- 更新 `package.json` 中的版本号
- 创建 Git commit
- 创建 Git tag

然后推送：
```bash
git push origin main --tags
```

GitHub Actions 会自动发布到 npm。

### 方法 2: 手动更新

```bash
# 1. 更新 package.json 中的版本号
# 2. 重新构建
npm run build

# 3. 提交更改
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main --tags

# 4. 手动发布到 npm
npm publish
```

## 📦 CDN 自动更新

发布到 npm 后，以下 CDN 会自动更新（通常需要 5-30 分钟）：

- **unpkg**: `https://unpkg.com/metro-ui-design-system@1.0.0/dist/metro-ui.min.css`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/metro-ui-design-system@1.0.0/dist/metro-ui.min.css`
- **cdnjs**: 需要手动提交到 cdnjs/cdnjs 仓库

## 🔗 相关链接

- GitHub: https://github.com/yourusername/metro-ui-design-system
- npm: https://www.npmjs.com/package/metro-ui-design-system
- 文档: https://yourusername.github.io/metro-ui-design-system/

## ⚠️ 常见问题

### Q: npm publish 报错 "You must be logged in"
A: 运行 `npm login` 重新登录

### Q: GitHub Actions 发布失败
A: 检查是否已正确配置 `NPM_TOKEN` secret

### Q: CDN 没有更新
A: unpkg 和 jsDelivr 会自动同步，但可能需要等待几分钟。可以手动清除缓存：
- unpkg: `https://purge.jsdelivr.net/npm/metro-ui-design-system/dist/metro-ui.min.css`

### Q: 如何撤销发布？
A: npm 发布后 72 小时内可以 unpublish：
```bash
npm unpublish metro-ui-design-system@1.0.0
```
注意：72 小时后无法撤销，只能发布新版本。

## 📊 发布检查清单

发布前确认：
- [ ] 所有代码已提交到 Git
- [ ] `npm run build` 成功
- [ ] 本地测试通过
- [ ] README.md 已更新
- [ ] CHANGELOG.md 已更新
- [ ] package.json 版本号已更新
- [ ] 已登录 GitHub (`gh auth status`)
- [ ] 已登录 npm (`npm whoami`)
