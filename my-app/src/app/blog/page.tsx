import { getAllPostsData, getCategoryStructure, getCategories } from '@/lib/posts';

export default function BlogPage() {
  // 在服务器端获取数据
  const blogPosts = getAllPostsData();
  const categoryStructure = getCategoryStructure();
  const categories = getCategories();
  
  return (
    <div>123</div>
  );
}
