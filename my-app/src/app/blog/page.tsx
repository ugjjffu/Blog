import { getAllPostsData, getCategoryStructure, getCategories } from '@/lib/posts';
import ClientBlogPage from './ClientBlogPage';

export default function BlogPage() {
  // 在服务器端获取数据
  const blogPosts = getAllPostsData();
  const categoryStructure = getCategoryStructure();
  const categories = getCategories();
  const c=JSON.stringify(blogPosts)+JSON.stringify(categoryStructure)+JSON.stringify(categories);
  if(c){}
  return (
    <ClientBlogPage 
      initialPosts={blogPosts}
      categoryStructure={categoryStructure}
      categories={categories}
    />
  );
}

export const dynamic = 'force-static'; // 或 'error'
