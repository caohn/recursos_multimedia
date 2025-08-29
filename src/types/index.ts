export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'document';
  url?: string;
  file?: File;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
}

export interface AppState {
  isAuthenticated: boolean;
  resources: Resource[];
  categories: Category[];
  searchTerm: string;
  selectedCategory: string | null;
  view: 'grid' | 'list';
}