'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/BlogCard';
import BlogHeader from '@/components/BlogHeader';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import NestedCategoryList from '@/components/NestedCategoryList';
import { BlogPost, Category } from '@/data/blogPosts';

interface ClientBlogPageProps {
  initialPosts: BlogPost[];
  categoryStructure: Category[];
  categories: string[];
}

// Wrap the component that uses useSearchParams with Suspense
function BlogPageContent({ initialPosts, categoryStructure }: ClientBlogPageProps) {
  const searchParams = useSearchParams();
  
  // Initialize state based on URL parameters or defaults
  const initialCategory = searchParams.get('category') || '所有文章';
  const initialSubcategory = searchParams.get('subcategory') || undefined;
  const initialSubsubcategory = searchParams.get('subsubcategory') || undefined;
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(initialSubcategory);
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState<string | undefined>(initialSubsubcategory);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]); // Start with empty array
  
  // When state or initialPosts change, filter articles
  useEffect(() => {
    let currentlyFiltered = initialPosts; // Always start filtering from the full list

    // Filter by category if not '所有文章'
    if (selectedCategory !== '所有文章') {
      currentlyFiltered = currentlyFiltered.filter(post => post.category === selectedCategory);

      // Further filter by subcategory if selected
      if (selectedSubcategory) {
        currentlyFiltered = currentlyFiltered.filter(post => post.subcategory === selectedSubcategory);

        // Further filter by subsubcategory if selected
        if (selectedSubsubcategory) {
          currentlyFiltered = currentlyFiltered.filter(post => post.subsubcategory === selectedSubsubcategory);
        } else {
          // Optional: If you want selecting a subcategory (e.g., GitHub) to *only* show posts
          // directly in that subcategory and *not* its subsubcategories, uncomment the next line.
          // currentlyFiltered = currentlyFiltered.filter(post => !post.subsubcategory);
        }
      } else {
        // Optional: If you want selecting a category (e.g., 技术分享) to *only* show posts
        // directly in that category and *not* its subcategories, uncomment the next line.
        // currentlyFiltered = currentlyFiltered.filter(post => !post.subcategory);
      }
    }

    setFilteredPosts(currentlyFiltered);
    
  }, [selectedCategory, selectedSubcategory, selectedSubsubcategory, initialPosts]); // Dependency array
  
  // Handle category selection from the list
  const handleCategorySelect = (
    category: string, 
    subcategory?: string, 
    subsubcategory?: string
  ) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setSelectedSubsubcategory(subsubcategory);
    
    // Update URL without page reload for better UX (optional)
    const params = new URLSearchParams(window.location.search);
    if (category === '所有文章') {
      params.delete('category');
      params.delete('subcategory');
      params.delete('subsubcategory');
    } else {
      params.set('category', category);
      if (subcategory) params.set('subcategory', subcategory); else params.delete('subcategory');
      if (subsubcategory) params.set('subsubcategory', subsubcategory); else params.delete('subsubcategory');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };
  
  // Get the title for the displayed category
  const getDisplayCategoryTitle = () => {
    if (selectedSubsubcategory) {
      return `${selectedCategory} - ${selectedSubcategory} - ${selectedSubsubcategory}`;
    }
    if (selectedSubcategory) {
      return `${selectedCategory} - ${selectedSubcategory}`;
    }
    return selectedCategory;
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <BlogHeader />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:w-1/4">
            <div>
              <ProfileCard />
            </div>
          </div>
          
          {/* Main Content Area - Blog Posts */}
          <div className="lg:w-2/4">
            {selectedCategory !== '所有文章' && (
              <h2 className="text-2xl font-bold mb-6">{getDisplayCategoryTitle()}</h2>
            )}
            <div className="space-y-8">
              {filteredPosts.map((post) => (
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
              {filteredPosts.length === 0 && selectedCategory !== '所有文章' && (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                  该分类下暂无文章，敬请期待...
                </div>
              )}
            </div>
          </div>
          
          {/* Right Sidebar - Category Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border border-gray-200">
              <NestedCategoryList 
                categories={categoryStructure}
                activeCategory={selectedCategory}
                activeSubcategory={selectedSubcategory}
                activeSubsubcategory={selectedSubsubcategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the main component wrapped in Suspense
export default function ClientBlogPageWrapper(props: ClientBlogPageProps) {
  return (
    <Suspense fallback={<div>Loading categories...</div>}> 
      <BlogPageContent {...props} />
    </Suspense>
  );
} 