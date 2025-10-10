# 📊 博客统计系统 GitHub API 集成指南

## 🎯 概述

博客统计系统现已集成 GitHub API，支持将阅读量数据同步到 GitHub Discussions，实现跨设备的统计数据共享。

## 🔧 配置步骤

### 1. 创建 GitHub Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称：`Blog Analytics Token`
4. 选择权限：
   - `repo` - 完整仓库访问权限
   - `write:discussion` - 写入 Discussions 权限
5. 点击 "Generate token" 并复制生成的 Token

### 2. 启用 GitHub Discussions

1. 进入你的 GitHub 仓库
2. 访问 Settings 页面
3. 向下滚动到 "Features" 部分
4. 勾选 "Discussions" 选项

### 3. 创建 Discussions 分类

1. 访问仓库的 Discussions 页面
2. 点击齿轮图标进入设置
3. 创建新分类：
   - **名称**: `Analytics`
   - **描述**: `博客统计数据`
   - **格式**: `Open-ended discussion`

### 4. 配置环境变量

复制 `.env.example` 文件为 `.env.local` 并填写配置：

```env
# GitHub API配置
VITE_GITHUB_TOKEN=github_pat_xxxxxxxxxx  # 你的 Personal Access Token
VITE_GITHUB_REPO_OWNER=PalpitatingForever
VITE_GITHUB_REPO_NAME=PalpitatingForever

# 功能开关
VITE_ENABLE_ANALYTICS=true
```

### 5. 部署到 GitHub Pages

在 GitHub Actions 中配置环境变量：

1. 访问仓库的 Settings > Secrets and variables > Actions
2. 添加以下 Repository secrets：
   - `VITE_GITHUB_TOKEN`: 你的 Personal Access Token
   - `VITE_GITHUB_REPO_OWNER`: 仓库所有者
   - `VITE_GITHUB_REPO_NAME`: 仓库名称

## 🚀 功能特性

### 自动统计同步

- ✅ **本地跟踪**: 用户阅读行为在本地 localStorage 中记录
- ✅ **云端同步**: 自动同步阅读量到 GitHub Discussions
- ✅ **防重复计数**: 24小时内同一用户同一文章只计数一次
- ✅ **离线支持**: 网络断开时数据缓存，恢复时自动同步

### Discussions 数据格式

每篇文章会创建一个统计 Discussion，格式如下：

```markdown
📊 [BLOG-STATS] 文章标题

---
BLOG_ID: post-id-123
TITLE: 文章标题
CATEGORY: 技术分享
TOTAL_VIEWS: 123
LAST_UPDATED: 2025-01-15T10:30:00Z
CREATED_AT: 2025-01-01T00:00:00Z
---

## 统计详情
- 📖 总阅读量: 123
- 📅 最后更新: 2025-01-15 10:30
- 🏷️ 分类: 技术分享
- 🔗 文章链接: /blog/post/post-id-123

## 更新日志
- 2025-01-15: +5 阅读量
- 2025-01-14: +3 阅读量
```

### API 限制和优化

- **速率限制**: 自动检测并遵守 GitHub API 限制
- **指数退避**: 失败时使用指数退避重试
- **批量更新**: 定期批量同步待处理的更新
- **智能缓存**: 5分钟本地缓存减少 API 调用

## 📱 用户界面

### 阅读统计显示

每篇文章会显示：
- 👁️ **总阅读量** (本地 + 云端)
- ☁️ **同步状态** (同步中/已同步/错误)
- 🔥 **热门标记** (超过阈值的文章)

### 分析面板

访问 `/blog/analytics` 查看：
- 📊 **个人阅读统计**
- 🔥 **热门文章排行**
- 📈 **阅读习惯分析**
- 📤 **数据导入导出**

## 🔒 隐私和安全

### 数据隐私
- **匿名统计**: 只记录阅读计数，不收集用户个人信息
- **本地优先**: 个人阅读历史仅存储在用户本地
- **透明公开**: 所有统计数据在 GitHub Discussions 中公开可见

### 安全措施
- **Token 安全**: Personal Access Token 通过环境变量配置，不暴露在代码中
- **权限最小化**: Token 仅授予必要的 Discussions 写入权限
- **错误隔离**: 统计功能异常不影响博客正常阅读

## 🛠️ 开发和调试

### 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填写配置

# 启动开发服务器
npm run dev
```

### 调试信息

在浏览器控制台中可以看到详细的同步日志：

```javascript
// 查看统计 store 状态
const { $pinia } = app.config.globalProperties
const analyticsStore = $pinia._s.get('analytics')
console.log(analyticsStore.$state)

// 手动同步待处理更新
await analyticsStore.syncPendingUpdates()

// 查看 API 状态
console.log({
  isOnline: analyticsStore.isOnline,
  canSync: analyticsStore.canSync,
  pendingUpdates: analyticsStore.pendingUpdatesCount
})
```

### 常见问题

**Q: 为什么阅读量没有同步到 GitHub？**
A: 检查以下几点：
1. GitHub Token 是否配置正确
2. 是否启用了 Discussions 功能
3. 是否创建了 "Analytics" 分类
4. 浏览器控制台是否有错误信息

**Q: 如何重置所有统计数据？**
A: 在分析页面使用"重置所有数据"功能，或手动清理 localStorage：
```javascript
localStorage.removeItem('blogReading')
```

**Q: 为什么显示 API 速率限制错误？**
A: GitHub API 有每小时 5000 次请求限制，系统会自动等待限制重置后继续同步。

## 📚 相关文档

- [GitHub Discussions API](https://docs.github.com/en/rest/discussions)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Pages 环境变量](https://docs.github.com/en/actions/learn-github-actions/environment-variables)

---

## 🎉 享受你的博客统计系统！

现在你的博客已经具备了完整的统计分析功能，包括本地跟踪和云端同步。用户可以看到真实的阅读数据，而你可以通过 GitHub Discussions 了解哪些内容最受欢迎。