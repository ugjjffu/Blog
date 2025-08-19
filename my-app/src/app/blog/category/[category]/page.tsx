// app/category/[category]/page.tsx
import BlogCard from '@/components/BlogCard';
import BlogHeader from '@/components/BlogHeader';
import CategoryList from '@/components/CategoryList';
import Navbar from '@/components/Navbar';
import { getCategories, getPostsByCategory } from '@/lib/posts';
import { notFound } from 'next/navigation';

/* 参数类型：Promise */
type Props = {
  params: Promise<{ category: string }>;
};

/* 预渲染哪些分类页 */
export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  const cats = getCategories().filter(c => c !== '所有文章');
  return cats.map(c => ({ category: c?.replace(/\s+/g, '-') }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const decodedCategory = decodeURIComponent(category?.replace(/-/g, ' '));
  const formattedCategory = decodedCategory
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const categories = getCategories();
  if (!categories.includes(formattedCategory)) {
    notFound();
  }

  const filteredPosts = getPostsByCategory(formattedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <BlogHeader />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <CategoryList
              categories={categories.filter(c => c !== '所有文章')}
              activeCategory={formattedCategory}
            />
          </div>
          <div className="md:w-3/4">
            <h2 className="text-2xl font-bold mb-6">{formattedCategory}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  imageSrc={post.imageSrc}
                  imageAlt={post.imageAlt}
                  slug={post.slug}
                  category={post.category}
                  isPinned={post.isPinned}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
