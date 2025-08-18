'use client';


import Navbar from '@/components/Navbar';
import Image from 'next/image';
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import { BlogPost } from '@/data/blogPosts';
import { CalendarDaysIcon, FolderIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface ClientBlogPostPageProps {
  post: BlogPost;
}

export default function ClientBlogPostPage({ post }: ClientBlogPostPageProps) {

  const buildCategoryPath = () => {
    let path = post.category;
    if (post.subcategory) {
      path += ` / ${post.subcategory}`;
      if (post.subsubcategory) {
        path += ` / ${post.subsubcategory}`;
      }
    }
    return path;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/5">
            <div className="sticky top-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-4 border border-gray-200">
              <TableOfContents htmlContent={post.content || ''} />
            </div>
          </div>
          
          <div className="lg:w-4/5">
            <article className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div className="relative h-64 md:h-96 w-full image-container">
                <Image 
                  src={post.imageSrc} 
                  alt={post.imageAlt} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
                  className="object-cover"
                  priority
                  loading="eager"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIj48L3JlY3Q+PC9zdmc+"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-2 sm:space-y-0 sm:gap-x-6">
                  <div className="flex items-center space-x-2">
                     <UserCircleIcon className="w-5 h-5" />
                     <span>Derrick Linus</span>
                  </div>
                  <div className="flex items-center space-x-1">
                     <FolderIcon className="w-4 h-4" />
                     <span>{buildCategoryPath()}</span>
                  </div>
                   <div className="flex items-center space-x-1">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>发布于：{post.date}</span>
                   </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{post.title}</h1>
                
                <div className="prose prose-lg max-w-none prose-indigo">
                  <MarkdownContent content={post.content || ''} />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
} 