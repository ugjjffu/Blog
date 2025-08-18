// src/app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ClientBlogPostPage from './ClientBlogPostPage';

/* 1️⃣ 直接符合 Next.js 要求的类型 */
type Props = {
  params: Promise<{ slug: string }>;   // 注意：Next.js 14 以后是 Promise
};

/* 2️⃣ generateStaticParams 返回「扁平」的 params 对象数组 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllPostSlugs().map(item => ({ slug: item.params.slug }));
}

export const revalidate = 3600;
export const dynamicParams = true;

/* 3️⃣ 组件签名：必须 await params */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;   // 解开 Promise
  if (!slug) notFound();

  const post = getPostBySlug(slug);
  if (!post) notFound();

  return <ClientBlogPostPage post={post} />;
}