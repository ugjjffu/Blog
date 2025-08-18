'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  htmlContent: string;
}

export default function TableOfContents({ htmlContent }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !htmlContent) return;

    // Function to parse headings
    const extractHeadings = () => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        // Query only h2 and h3 for a cleaner TOC
        const headingElements = Array.from(doc.querySelectorAll('h2, h3')); 
        const extractedHeadings: Heading[] = [];

        headingElements.forEach(el => {
          const id = el.getAttribute('id');
          const text = el.textContent || '';
          const level = parseInt(el.tagName.substring(1), 10);

          if (id && text) {
            extractedHeadings.push({ id, text, level });
          }
        });
        setHeadings(extractedHeadings);
    };

    extractHeadings();
    
    // Intersection Observer for active heading tracking
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
        let foundActive = false;
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) { // Adjust threshold as needed
                setActiveId(entry.target.id);
                foundActive = true;
            }
        });
        if(foundActive){}
        // If no heading is sufficiently intersecting, maybe clear activeId or keep the last one?
        // For now, we only set when intersecting.
    };

    const observerOptions = {
      rootMargin: '0px 0px -60% 0px', // Trigger when heading is in the top 40% of the viewport
      threshold: 0.5 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const headingTargets = document.querySelectorAll('.prose h2[id], .prose h3[id]'); // Target headings within the rendered content
    
    headingTargets.forEach(target => observer.observe(target));

    // Cleanup observer on component unmount
    return () => {
        headingTargets.forEach(target => observer.unobserve(target));
        observer.disconnect();
    };

  }, [htmlContent]); // Rerun if content changes

  const handleScrollTo = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
          // Calculate scroll position to account for fixed header
          const headerOffset = 80; // Adjust based on your Navbar height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
           // Update URL hash without triggering re-render issues
           history.pushState(null, '', `#${id}`);
      }
  };


  if (headings.length === 0) {
    return <div className="text-sm text-gray-500">暂无目录</div>; 
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">文章目录</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} 
                // Indent based on heading level (h2 -> level 0, h3 -> level 1 indent)
                style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }} 
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleScrollTo(heading.id, e)}
                className={`block text-sm transition-colors duration-150 ${ 
                  activeId === heading.id 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 