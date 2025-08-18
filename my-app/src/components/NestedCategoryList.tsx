import { useState, useEffect } from 'react';
import { Category } from '@/data/blogPosts';

interface NestedCategoryListProps {
  categories: Category[];
  activeCategory?: string;
  activeSubcategory?: string;
  activeSubsubcategory?: string;
  onCategorySelect: (category: string, subcategory?: string, subsubcategory?: string) => void;
}

export default function NestedCategoryList({ 
  categories, 
  activeCategory, 
  activeSubcategory,
  activeSubsubcategory,
  onCategorySelect 
}: NestedCategoryListProps) {
  
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = { '所有文章': false }; // Start closed, except maybe active
    if (activeCategory && activeCategory !== '所有文章') {
      initialState[activeCategory] = true;
      if (activeSubcategory) {
        initialState[`${activeCategory}/${activeSubcategory}`] = true;
      }
    }
    // Don't automatically open '所有文章' unless it's the active one (which is default)
    if (activeCategory === '所有文章' || !activeCategory) initialState['所有文章'] = true;
     
    return initialState;
  });

  // Sync open state if active props change from outside (e.g., URL change)
  // This focuses on ensuring the *active path* is open, not managing general open/close
   useEffect(() => { 
    setOpenCategories(prevOpen => {
        const newOpen = { ...prevOpen };
        // Ensure the direct active path is open
        if (activeCategory && activeCategory !== '所有文章') {
            newOpen[activeCategory] = true;
            if (activeSubcategory) {
                newOpen[`${activeCategory}/${activeSubcategory}`] = true;
                // Close siblings of the active subcategory only if it just became active?
                // Maybe better handled by click handler? Let's keep useEffect simple.
            } else {
                // If only a top-level is active, ensure its immediate children *could* be opened
                // but don't force siblings closed here from effect.
            }
        }
         // If active is 'All', don't necessarily close others from effect, let user manage.
        return newOpen;
    });
}, [activeCategory, activeSubcategory, activeSubsubcategory]); // Depend on active props reflecting current filter


  // Handle category click: Selects filter AND toggles open/close state
  const handleCategoryClick = (
    categoryName: string,
    subcategoryName?: string,
    subsubcategoryName?: string,
    hasSubcategories?: boolean, // Does the *clicked* item have children?
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault(); 
    }

    // 1. Trigger the category selection for filtering posts
    onCategorySelect(categoryName, subcategoryName, subsubcategoryName);

    // 2. Update the open/closed state for the nested list UI
    const clickedKey = [categoryName, subcategoryName, subsubcategoryName].filter(Boolean).join('/');

    setOpenCategories(prevOpen => {
      // Special case: Clicking "All Articles" - select it, close all others
      if (clickedKey === '所有文章') {
        return { '所有文章': false }; // Set only 'All Articles' to closed (it has no children)
      }

      const newOpen = { ...prevOpen }; 
      const parts = clickedKey.split('/');
      const level = parts.length;
      const parentKey = level > 1 ? parts.slice(0, level - 1).join('/') : null;

      // --- Toggle Logic for the clicked item --- 
      let isNowOpen = prevOpen[clickedKey]; // Get current state
      if (hasSubcategories) {
        // Toggle if it has children
        isNowOpen = !prevOpen[clickedKey]; 
        newOpen[clickedKey] = isNowOpen;
      } else {
        // Leaf node - cannot be opened/closed visually in terms of children
        isNowOpen = false; // Treat leaf as 'closed' for children, ensure its path is open below
        // Ensure the leaf itself is marked if needed for styling or parent checks
         newOpen[clickedKey] = false; // Explicitly false as it cannot be 'open' for children
      }

      // --- Ensure Parent Path is Open --- 
      // Ensure all ancestors of the clicked item are marked as open
      let currentAncestorKey = '';
      for (let i = 0; i < level - 1; i++) {
        currentAncestorKey = parts.slice(0, i + 1).join('/');
        newOpen[currentAncestorKey] = true; // Force parents open
      }

      // --- Close Siblings --- 
      // Close all other items at the same level as the clicked item
      Object.keys(newOpen).forEach(key => {
        const keyParts = key.split('/');
        if (keyParts.length === level) { // Check if it's at the same level
           const keyParentKey = level > 1 ? keyParts.slice(0, level - 1).join('/') : null;
           if (keyParentKey === parentKey && key !== clickedKey) { // Check if it's a sibling
               newOpen[key] = false; // Close the sibling
                // No need to recursively close sibling's children here,
                // the rendering logic will handle it based on the parent's (sibling's) state.
           }
        }
      });
      
       // --- Close Descendants ONLY if the clicked item was toggled CLOSED --- 
       // This was the potentially problematic part - let's rely on rendering logic instead.
       // If newOpen[clickedKey] is now false, the rendering logic `isCategoryOpen(currentKey)`
       // will prevent its children from rendering.
       /* 
       if (hasSubcategories && !isNowOpen) { 
            Object.keys(newOpen).forEach(key => {
                if (key.startsWith(clickedKey + '/')) {
                    newOpen[key] = false; 
                }
            });
       }
       */

      return newOpen;
    });
  };

  // Function to check if a category path is currently active (selected for filtering)
  const isActive = (categoryName: string, subcategoryName?: string, subsubcategoryName?: string) => {
     if (subsubcategoryName) {
      return activeCategory === categoryName && 
             activeSubcategory === subcategoryName && 
             activeSubsubcategory === subsubcategoryName;
    }
    if (subcategoryName) {
      return activeCategory === categoryName && 
             activeSubcategory === subcategoryName &&
             !activeSubsubcategory; // Exact match for subcategory level
    }
    // Check for top level or 'All Articles'
    return activeCategory === categoryName && 
           !activeSubcategory && 
           !activeSubsubcategory; 
  };

  // Function to check if a category path should render its children as open
  const isCategoryOpen = (categoryKey: string) => {
    return !!openCategories[categoryKey]; 
  };
  
  // Recursive function to render categories and their subcategories
  const renderCategory = (category: Category, level: number, parentKey?: string) => {
      const currentKey = parentKey ? `${parentKey}/${category.name}` : category.name;
      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
      const pathParts = currentKey.split('/');
      const catName = pathParts[0];
      const subcatName = pathParts[1];
      const subsubcatName = pathParts[2];

      return (
          <li key={currentKey} className={`space-y-1 ${level > 0 ? 'pl-4' : ''}`}>
              <div 
                  className={`flex items-center group cursor-pointer transition-colors duration-200 rounded px-2 py-1 ${
                      isActive(catName, subcatName, subsubcatName) 
                      ? 'font-medium text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                  onClick={(e) => handleCategoryClick(
                      catName,
                      subcatName,
                      subsubcatName,
                      hasSubcategories,
                      e
                  )}
              >
                  {/* Indicator Dot */}
                  <span 
                      className={`w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 transition-colors duration-200 ${
                          isActive(catName, subcatName, subsubcatName) 
                          ? 'bg-blue-600' 
                          : 'bg-gray-300 group-hover:bg-blue-500'
                      }`}
                  ></span>
                  {/* Category Name */}
                  <span className="truncate flex-grow">{category.name}</span>
                  
                  {/* Count */}
                  <span className="ml-auto text-sm text-gray-500 flex-shrink-0 pl-2">{category.count}</span>
              </div>
              
              {/* Render Subcategories: Only if it has them AND its state is open */}
              {hasSubcategories && isCategoryOpen(currentKey) && (
                  <ul className="space-y-1 mt-1">
                      {category.subcategories?.map((subcat) => renderCategory(subcat, level + 1, currentKey))}
                  </ul>
              )}
          </li>
      );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">分类目录</h3>
      <ul className="space-y-2">
        {categories.map((category) => renderCategory(category, 0))}
      </ul>
    </div>
  );
} 