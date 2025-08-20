import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { BlogPost, Category } from '@/data/blogPosts';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export function getAllPostsData(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        // 从文件名中移除数字前缀 (如 "1-", "2-" 等) 以获取正确的 slug
        const fileNameWithoutPrefix = fileName?.replace(/^\d+-/, '');
        const slugFromFile = decodeURIComponent(fileNameWithoutPrefix?.replace(/\.md$/, ''));
        const fullPath = path.join(postsDirectory, fileName);
        
        try {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);

          const processedContent = remark()
            .use(html, { sanitize: false })
            .processSync(matterResult.content)
            .toString();

          return {
            id: matterResult.data.id || slugFromFile, 
            slug: matterResult.data.slug || slugFromFile, 
            title: matterResult.data.title || 'Untitled',
            date: matterResult.data.date || 'N/A',
            excerpt: matterResult.data.excerpt || '',
            category: matterResult.data.category || 'Uncategorized',
            subcategory: matterResult.data.subcategory,
            subsubcategory: matterResult.data.subsubcategory,
            imageSrc: matterResult.data.imageSrc || '/blog/default.png',
            imageAlt: matterResult.data.imageAlt || 'Blog post image',
            content: processedContent,
            isPinned: matterResult.data.isPinned || false
          } as BlogPost;
        } catch (error) {
          console.warn(`处理文件时出错: ${fileName}`, error);
          return null;
        }
      }).filter(post => post !== null) as BlogPost[];

    return allPostsData.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("读取博客文章数据时出错:", error);
    return [];
  }
}

export function getPostBySlug(slugParam: string): BlogPost | undefined {
  try {
    const decodedSlug = decodeURIComponent(slugParam);
    
    // 不立即构建期望的文件名和路径
    // 而是首先检查目录中的所有文件
    const filesInDir = fs.readdirSync(postsDirectory);
    let foundFile: string | undefined;
    
    // 1. 精确匹配（带或不带数字前缀）
    foundFile = filesInDir.find(f => {
      const nameWithoutPrefix = f?.replace(/^\d+-/, '');
      return nameWithoutPrefix.toLowerCase() === `${decodedSlug.toLowerCase()}.md`;
    });
    
    // 2. 检查是否存在包含slug的文件
    if (!foundFile) {
      foundFile = filesInDir.find(f => 
        f.toLowerCase().includes(decodedSlug.toLowerCase()) && f.endsWith('.md')
      );
    }
    
    // 3. 检查slug是否是URL编码后的字符串
    if (!foundFile) {
      // 尝试所有可能的文件名组合
      for (const file of filesInDir) {
        const fileNameWithoutExt = file?.replace(/\.md$/, '');
        const fileNameWithoutPrefix = fileNameWithoutExt?.replace(/^\d+-/, '');
        
        if (fileNameWithoutPrefix === decodedSlug ||
            encodeURIComponent(fileNameWithoutPrefix) === slugParam ||
            fileNameWithoutPrefix === encodeURIComponent(decodedSlug) ||
            fileNameWithoutPrefix === slugParam) {
          foundFile = file;
          break;
        }
      }
    }
    
    if (foundFile) {
      const caseCorrectPath = path.join(postsDirectory, foundFile);
      console.log(`找到匹配的文件: ${foundFile}. 正在从此路径读取: ${caseCorrectPath}`);
      
      const fileContents = fs.readFileSync(caseCorrectPath, 'utf8');
      const matterResult = matter(fileContents);
      const processedContent = remark()
        .use(html, { sanitize: false })
        .processSync(matterResult.content)
        .toString();
      
      return {
        id: matterResult.data.id || decodedSlug,
        slug: decodedSlug, 
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || 'N/A',
        excerpt: matterResult.data.excerpt || '',
        category: matterResult.data.category || 'Uncategorized',
        subcategory: matterResult.data.subcategory,
        subsubcategory: matterResult.data.subsubcategory,
        imageSrc: matterResult.data.imageSrc || '/blog/default.png',
        imageAlt: matterResult.data.imageAlt || 'Blog post image',
        content: processedContent,
        isPinned: matterResult.data.isPinned || false
      } as BlogPost;
    } else {
      console.error(`未找到与 slug '${slugParam}' 匹配的文件。尝试的 slug: ${decodedSlug}`);
      return undefined;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`读取文件时发生错误: ${slugParam} (解码后: ${decodeURIComponent(slugParam)}).`);
    } else {
      console.error(`加载带有 slug: ${slugParam} 的文章时出错`, error);
    }
    return undefined;
  }
}

export function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        try {
          // 读取文件内容以获取 front matter 中定义的 slug
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);
          
          // 如果在 front matter 中有显式定义的 slug，则使用它
          if (matterResult.data.slug) {
            return {
              params: { slug: matterResult.data.slug }
            };
          }
          
          // 否则从文件名生成 slug
          const fileNameWithoutPrefix = fileName.replace(/^\d+-/, '');
          const slug = decodeURIComponent(fileNameWithoutPrefix.replace(/\.md$/, ''));
          return {
            params: { slug: slug }
          };
        } catch (error) {
          console.warn(`处理文件 ${fileName} 的 slug 时出错`, error);
          // 从文件名生成 slug（作为备用）
          const fileNameWithoutPrefix = fileName.replace(/^\d+-/, '');
          const slug = decodeURIComponent(fileNameWithoutPrefix.replace(/\.md$/, ''));
          return {
            params: { slug: slug }
          };
        }
    });
  } catch (error) {
    console.error("读取文章 slug 时出错:", error);
    return [];
  }
}

const getBaseCategoryStructure = (): Category[] => JSON.parse(JSON.stringify([
  {
    name: '技术分享', 
    count: 0,
    subcategories: [
      {
        name: 'GitHub',
        count: 0,
        subcategories: [
          { name: '项目管理', count: 0 },
          { name: '版本控制', count: 0 },
          { name: 'Actions', count: 0 }
        ]
      },
      {
        name: 'Matlab',
        count: 0,
        subcategories: [
          { name: '数据分析', count: 0 },
          { name: '图形处理', count: 0 },
          { name: '算法实现', count: 0 }
        ]
      },
      {
        name: 'Python',
        count: 0,
        subcategories: [
          { name: 'Web开发', count: 0 },
          { name: '数据科学', count: 0 },
          { name: '自动化', count: 0 }
        ]
      },
      {
        name: 'LLM',
        count: 0,
        subcategories: [
          { name: '模型调优', count: 0 },
          { name: '应用开发', count: 0 },
          { name: 'Prompt工程', count: 0 }
        ]
      }
    ],
    isOpen: false
  },
  {
    name: '工具推荐', 
    count: 0,
    isOpen: false
  },
  {
    name: '生活随笔', 
    count: 0,
    subcategories: [
      { name: '旅行日记', count: 0 },
      { name: '书影音库', count: 0 },
      { name: '月度总结', count: 0 }
    ],
    isOpen: false
  }
]));

export function getCategoryStructure(): Category[] {
  const posts = getAllPostsData();
  const categoryStructure = getBaseCategoryStructure();

  posts.forEach(post => {
    const cat = categoryStructure.find(c => c.name === post.category);
    if (!cat) return;

    if (!post.subcategory) {
      cat.count = (cat.count || 0) + 1;
      return;
    }

    const subcat = cat.subcategories?.find(s => s.name === post.subcategory);
    if (!subcat) {
       console.warn(`Subcategory "${post.subcategory}" not found in structure for post: ${post.slug}`);
       return;
    }

    if (!post.subsubcategory) {
      subcat.count = (subcat.count || 0) + 1;
      return;
    }

    const subsubcat = subcat.subcategories?.find(ss => ss.name === post.subsubcategory);
    if (subsubcat) {
      subsubcat.count = (subsubcat.count || 0) + 1;
    } else {
        console.warn(`Subsubcategory "${post.subsubcategory}" not found in structure for post: ${post.slug}`);
    }
  });

  function aggregateCounts(category: Category): number {
    const currentLevelCount = category.count || 0;
    if(currentLevelCount){}
    if (category.subcategories && category.subcategories.length > 0) {
      const childrenCount = category.subcategories.reduce((sum, sub) => {
        return sum + aggregateCounts(sub);
      }, 0);
      category.count = childrenCount;
    } 
    category.count = category.count || 0; 

    return category.count; 
  }

  categoryStructure.forEach(category => {
    aggregateCounts(category);
  });

  return [
    { name: '所有文章', count: posts.length, isOpen: false },
    ...categoryStructure
  ];
}

export function getCategories(): string[] {
  const structure = getBaseCategoryStructure();
  return ['所有文章', ...structure.map(cat => cat.name)];
}

export function getPostsByCategory(category: string, subcategory?: string, subsubcategory?: string): BlogPost[] {
  const posts = getAllPostsData();
  
  if (category === '所有文章') {
    return posts;
  }
  
  let filteredPosts = posts.filter(post => post.category === category);
  
  if (subcategory) {
      filteredPosts = filteredPosts.filter(post => post.subcategory === subcategory);
      
      if (subsubcategory) {
          filteredPosts = filteredPosts.filter(post => post.subsubcategory === subsubcategory);
      }
  }
  
  return filteredPosts;
}
