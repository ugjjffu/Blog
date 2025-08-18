import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  slug: string;
  category?: string;
  isPinned?: boolean;
}

export default function BlogCard({ 
  title, 
  excerpt, 
  date, 
  imageSrc, 
  imageAlt, 
  slug, 
  category = '技术分享',
  isPinned = false 
}: BlogCardProps) {
  return (
    <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white transform hover:-translate-y-1 relative">
      {isPinned && (
        <div className="absolute top-2 right-2 z-10 text-2xl" title="置顶文章">
          📌
        </div>
      )}
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative h-64 w-full">
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-blue-600 text-sm font-medium">{category}</span>
            <span className="text-gray-500 text-sm">{date}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 text-sm hover:underline">阅读全文</span>
            <div className="flex space-x-2 text-gray-500">
              <span className="text-sm">5分钟阅读</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}