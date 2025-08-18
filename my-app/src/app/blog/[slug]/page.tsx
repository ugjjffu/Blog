import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ClientBlogPostPage from './ClientBlogPostPage';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.filter(p => p && p.params && p.params.slug);
}

// 使页面转换更平滑的属性
export const revalidate = 3600; // 设置页面缓存时间
export const dynamicParams = true; // Allow slugs not generated at build time

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!params || typeof params.slug !== 'string') {
      console.error("Invalid or missing slug parameter:", params);
      notFound();
  }
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    console.log(`Post not found for slug: ${params.slug}`);
    notFound();
  }

  return (
    <ClientBlogPostPage 
      post={post}
    />
  );
}