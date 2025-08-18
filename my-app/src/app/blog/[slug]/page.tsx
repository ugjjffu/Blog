import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ClientBlogPostPage from './ClientBlogPostPage';

/* 1️⃣ 直接复用 Next.js 内置类型 */
type Props = {
  params: { slug: string };
};

/* 2️⃣ generateStaticParams 的返回值类型也补全 */
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllPostSlugs().map(p => p.params);
}

export const revalidate = 3600;
export const dynamicParams = true;

/* 3️⃣ 组件签名 */
export default async function BlogPostPage({ params }: Props) {
  if (!params?.slug) notFound();

  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return <ClientBlogPostPage post={post} />;
}