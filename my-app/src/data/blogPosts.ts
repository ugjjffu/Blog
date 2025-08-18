export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  subcategory?: string;
  subsubcategory?: string;
  imageSrc: string;
  imageAlt: string;
  content?: string;
  isPinned?: boolean;
}

export interface Category {
  name: string;
  count: number;
  subcategories?: Category[];
  isOpen?: boolean;
}