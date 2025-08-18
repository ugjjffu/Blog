# Derrick Linus 的个人博客

这是一个使用 [Next.js](https://nextjs.org) 构建的个人博客项目，采用了现代化的技术栈和清晰的代码结构。项目开发全程使用 [Cursor](https://cursor.sh) 编辑器结合 AI 辅助编程完成，展示了现代 AI 驱动的开发流程。

## 项目简介

这是一个集技术分享、生活随笔和工具推荐于一体的个人博客网站。网站采用了简洁现代的设计风格，支持文章分类、响应式布局、文章置顶等功能。内容管理采用独立 Markdown 文件的方式，便于维护和扩展。

## 技术栈

- **框架**: Next.js 14
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **部署**: Vercel
- **内容管理**: Markdown + Front Matter
- **开发工具**: Cursor (AI 驱动的代码编辑器)

## 项目结构

```plaintext
my-app/
├── src/
│   ├── app/                 # 应用主目录
│   │   ├── page.tsx         # 首页
│   │   ├── blog/            # 博客页面
│   │   │   ├── page.tsx     # 博客列表页
│   │   │   ├── [slug]/      # 文章详情页
│   │   │   └── category/    # 分类页面
│   │   └── layout.tsx       # 全局布局
│   ├── components/          # 可复用组件
│   │   ├── BlogCard.tsx     # 博客卡片组件
│   │   ├── MarkdownContent.tsx # Markdown渲染组件
│   │   └── ...              # 其他组件
│   ├── content/             # 内容目录
│   │   └── posts/           # 博客文章(Markdown)
│   ├── lib/                 # 工具库
│   │   └── posts.ts         # 文章加载与处理
│   └── data/                # 数据定义
│       └── blogPosts.ts     # 博客文章类型定义
├── scripts/                 # 辅助脚本
│   └── new-post.js          # 创建新文章脚本
├── public/                  # 静态资源
│   └── blog/                # 博客图片
├── tailwind.config.js       # Tailwind 配置
└── package.json             # 项目依赖
```

## 功能特点

- **响应式设计**：支持多端浏览，在手机、平板和桌面设备上都有良好体验
- **基于文件的内容管理**：
  - 每篇文章以独立 Markdown 文件存储在 `content/posts` 目录下
  - 支持文章元数据管理(Front Matter)，包括标题、摘要、日期、分类等
  - 便于内容的添加、修改和版本控制
- **文章分类系统**：
  - 支持多分类
  - 自定义分类顺序（如"技术分享"优先显示）
  - 分类页面筛选
- **内容展示**：
  - Markdown 渲染支持
  - 代码块语法高亮
  - 响应式图片
- **特色功能**：
  - 文章置顶（带置顶标记📌）
  - 自动日期排序
  - 自动生成文章ID和Slug
- **开发便利性**：
  - 文章创建脚本（`scripts/new-post.js`）
  - 智能分类管理

## 内容管理

项目采用基于文件的内容管理系统，每篇文章都是独立的 Markdown 文件，包含以下元数据：

```yaml
---
id: '1'               # 文章唯一标识
title: '文章标题'      # 文章标题
slug: 'article-slug'  # URL路径
excerpt: '文章摘要'    # 文章简介
date: '01/20/2025'    # 发布日期
category: '技术分享'   # 文章分类
imageSrc: '/blog/img.png' # 封面图片
imageAlt: '图片说明'   # 图片替代文本
isPinned: true        # 是否置顶
---

文章内容...
```

## AI 辅助开发

本项目全程使用 Cursor 编辑器结合 AI 辅助完成，展示了 AI 驱动的开发流程：

- 通过 AI 生成基础代码结构
- 使用 AI 辅助重构（如从单文件迁移到基于文件的内容管理）
- AI 辅助实现新功能（如文章置顶系统）
- AI 辅助调试和优化

## 本地开发
（在IDE的终端中运行）

1. 克隆项目  
```bash
git clone https://github.com/DerrickLinus/derricklinus-blog.git  
cd derricklinus-blog
```

2. 安装依赖  
```bash
npm install
```

3. 启动开发服务器  
```bash
npm run dev
```  

打开 http://localhost:3000 查看网站。

4. 创建新文章（可选）
```bash
node scripts/new-post.js
```

## 部署

项目可以轻松部署到 Vercel 平台：

1. 在 Vercel 中导入你的 GitHub 仓库
2. 进行默认配置
3. 部署

## 贡献

欢迎提交 Issue 和 Pull Request!
