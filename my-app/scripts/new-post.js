#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 生成随机ID
function generateId() {
  return crypto.randomBytes(4).toString('hex');
}

// 生成适合URL的slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 替换空格为连字符
    .replace(/--+/g, '-') // 替换多个连字符为单个连字符
    .trim(); // 移除首尾空格
}

// 获取当前日期
function getCurrentDate() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// 获取所有可用分类
function getCategories() {
  try {
    const postsDirectory = path.join(process.cwd(), 'src/content/posts');
    const fileNames = fs.readdirSync(postsDirectory);
    const categories = new Set();
    
    fileNames.forEach(fileName => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 简单解析front matter
      const categoryMatch = fileContents.match(/category:\s*['"](.+)['"]/);
      if (categoryMatch && categoryMatch[1]) {
        categories.add(categoryMatch[1]);
      }
    });
    
    return Array.from(categories);
  } catch (error) {
    console.error("Error reading categories:", error);
    return ['技术分享', '生活随笔', '工具大全']; // 默认分类
  }
}

async function promptQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    rl.question(`${question}${defaultValue ? ` (默认: ${defaultValue})` : ''}: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

async function createNewPost() {
  console.log('📝 创建新博客文章\n');
  
  // 获取文章信息
  const title = await promptQuestion('标题');
  if (!title) {
    console.error('❌ 错误: 标题不能为空');
    rl.close();
    return;
  }
  
  const slug = await promptQuestion('Slug (URL路径)', generateSlug(title));
  const excerpt = await promptQuestion('摘要');
  
  // 显示可用的分类
  const availableCategories = getCategories();
  console.log('\n可用分类:');
  availableCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`);
  });
  
  const categoryChoice = await promptQuestion('\n选择分类 (输入数字) 或输入新分类');
  let category;
  
  if (isNaN(categoryChoice)) {
    category = categoryChoice; // 用户输入了新分类
  } else {
    const index = parseInt(categoryChoice, 10) - 1;
    if (index >= 0 && index < availableCategories.length) {
      category = availableCategories[index];
    } else {
      console.error('❌ 错误: 无效的分类选择');
      category = '技术分享'; // 默认分类
    }
  }
  
  const date = await promptQuestion('发布日期 (MM/DD/YYYY)', getCurrentDate());
  const imageSrc = await promptQuestion('图片路径', '/blog/default.png');
  const imageAlt = await promptQuestion('图片替代文本', title);
  
  // 创建Front Matter
  const frontMatter = `---
id: '${generateId()}'
title: '${title}'
slug: '${slug}'
excerpt: '${excerpt}'
date: '${date}'
category: '${category}'
imageSrc: '${imageSrc}'
imageAlt: '${imageAlt}'
---

# ${title}

在这里开始编写你的文章内容...
`;

  // 保存文件
  const postsDirectory = path.join(process.cwd(), 'src/content/posts');
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
  
  const filePath = path.join(postsDirectory, `${slug}.md`);
  fs.writeFileSync(filePath, frontMatter);
  
  console.log(`\n✅ 成功创建文章: ${filePath}`);
  console.log('现在您可以编辑该文件添加文章内容。');
  
  rl.close();
}

createNewPost(); 