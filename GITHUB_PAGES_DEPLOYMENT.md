# GitHub Pages 部署说明

本文档详细说明了如何通过 GitHub Actions 自动构建和部署项目到 GitHub Pages。

## 🛠️ 已完成的配置

### 1. Vite 配置更新
- 修改了 `vite.config.js`，添加了 `base` 配置以适配 GitHub Pages 的子路径部署
- 生产环境将使用 `/PalpitatingForever/` 作为基础路径

### 2. GitHub Actions 工作流
- 创建了 `.github/workflows/deploy.yml` 文件
- 配置了自动构建和部署流程

## 🔧 必需的配置步骤

### 1. GitHub Repository 设置

1. **启用 GitHub Pages**
   - 进入你的 GitHub 仓库
   - 点击 `Settings` 标签
   - 在左侧菜单中找到 `Pages`
   - 在 `Source` 部分选择 `GitHub Actions`

2. **配置环境变量（如果使用 Notion API）**
   - 在仓库设置中，进入 `Settings` > `Secrets and variables` > `Actions`
   - 添加以下 Repository secrets：
     ```
     NOTION_API_KEY=your_notion_api_key_here
     NOTION_BLOGS_DATABASE_ID=your_blogs_database_id_here
     NOTION_WORKS_DATABASE_ID=your_works_database_id_here
     NOTION_PLOGS_DATABASE_ID=your_plogs_database_id_here
     NOTION_MLOGS_DATABASE_ID=your_mlogs_database_id_here
     ```

### 2. 分支保护（可选但推荐）
- 确保主分支名为 `main`
- 如果使用其他分支名，需要修改 `.github/workflows/deploy.yml` 中的分支名

## 🚀 部署流程

### 自动部署触发条件：
- 推送到 `main` 分支
- 创建针对 `main` 分支的 Pull Request
- **定时触发**：每天北京时间上午8点自动重新构建（同步Notion最新内容）
- **手动触发**：在GitHub仓库的Actions页面可以手动启动构建

### 周期性构建说明：
由于项目内容来自Notion API，为了确保网站显示最新内容，工作流设置了：

1. **每日自动构建**：
   - 时间：北京时间上午8点（UTC 00:00）
   - 目的：自动获取Notion中的最新博客、作品等内容
   - 即使代码没有更改，也会重新构建和部署

2. **手动触发构建**：
   - 在GitHub仓库页面进入`Actions`标签
   - 选择"Deploy to GitHub Pages"工作流
   - 点击"Run workflow"按钮
   - 适用于需要立即同步Notion内容的情况

3. **自定义构建频率**：
   - 当前设置：`'0 0 * * *'`（每天一次）
   - 可选设置：
     - `'0 */6 * * *'`：每6小时一次
     - `'0 0 * * 1'`：每周一次
     - `'0 0 1 * *'`：每月一次

### 部署步骤：
1. **构建阶段**：
   - 检出代码
   - 设置 Node.js 18 环境
   - 安装依赖
   - 设置环境变量
   - 执行构建命令（包括获取 Notion 数据）
   - 上传构建产物

2. **部署阶段**：
   - 将构建产物部署到 GitHub Pages

## 📝 重要说明

### Notion API 配置
如果你的项目使用 Notion API 获取数据：

1. **获取 Notion API Key**：
   - 访问 [Notion Developers](https://developers.notion.com/)
   - 创建新的 integration
   - 复制 Internal Integration Token

2. **获取 Database ID**：
   - 在 Notion 中打开你的数据库
   - 从 URL 中复制数据库 ID
   - 格式：`https://notion.so/DATABASE_ID?v=...`

3. **配置 Database 权限**：
   - 在 Notion 数据库中，点击右上角的 `...`
   - 选择 `Add connections`
   - 添加你创建的 integration

### 本地开发
- 复制 `.env.example` 为 `.env`
- 填入你的 Notion API 配置
- 运行 `npm run dev` 进行本地开发

### 构建命令说明
- `npm run build` 会先执行 `scripts/fetch-notion-data.js` 获取 Notion 数据
- 然后执行 `vite build` 进行项目构建

## 🔍 故障排除

### 常见问题：

1. **部署失败**：
   - 检查 GitHub Actions 日志
   - 确认所有环境变量已正确设置
   - 检查 Notion API 配置和权限

2. **页面无法访问**：
   - 确认 GitHub Pages 已启用
   - 检查仓库是否为公开仓库（私有仓库需要 GitHub Pro）
   - 等待几分钟，GitHub Pages 部署可能需要时间

3. **资源加载失败**：
   - 检查 `vite.config.js` 中的 `base` 配置是否正确
   - 确认仓库名称与配置匹配

## 🌐 访问地址

部署成功后，你的网站将可以通过以下地址访问：
```
https://你的GitHub用户名.github.io/PalpitatingForever/
```

## 📋 下次推送时

现在配置已完成，下次你推送代码到 `main` 分支时：
1. GitHub Actions 会自动触发
2. 执行构建和部署流程
3. 几分钟后你的网站就会自动更新

确保在第一次部署前完成 GitHub Repository 的相关设置！