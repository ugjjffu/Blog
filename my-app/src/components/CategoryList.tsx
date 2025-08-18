import Link from 'next/link';
import { getAllPostsData } from '@/lib/posts';

interface CategoryListProps {
  categories: string[];
  activeCategory?: string;
}

export default function CategoryList({ categories, activeCategory }: CategoryListProps) {
  const posts = getAllPostsData();
  
  // 计算每个分类的文章数量
  const categoryCounts = categories.reduce((counts, category) => {
    counts[category] = posts.filter(post => post.category === category).length;
    return counts;
  }, {} as Record<string, number>);
  
  // 所有文章的数量
  const totalPosts = posts.length;
  
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">分类目录</h3>
      <ul className="space-y-3">
        <li>
          <Link 
            href="/blog" 
            className={`flex items-center group ${!activeCategory ? 'font-medium text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors duration-200`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${!activeCategory ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-blue-600'} transition-colors duration-200`}></span>
            <span>所有文章</span>
            <span className="ml-auto text-sm text-gray-500">{totalPosts}</span>
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Link 
              href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}
              className={`flex items-center group ${activeCategory === category ? 'font-medium text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors duration-200`}
            >
              <span className={`w-2 h-2 rounded-full mr-2 ${activeCategory === category ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-blue-600'} transition-colors duration-200`}></span>
              <span>{category}</span>
              <span className="ml-auto text-sm text-gray-500">{categoryCounts[category]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}