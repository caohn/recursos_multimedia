import { useState, useEffect } from 'react';
import { Resource, Category, AppState } from '../types';

const STORAGE_KEYS = {
  AUTH: 'resources_auth',
  RESOURCES: 'resources_data',
  CATEGORIES: 'categories_data',
};

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Documentos Importantes',
    color: '#3B82F6',
    description: 'Documentos oficiales y certificaciones',
    icon: 'folder',
  },
  {
    id: '2',
    name: 'Enlaces Útiles',
    color: '#10B981',
    description: 'Enlaces web de interés',
    icon: 'folder',
  },
  {
    id: '3',
    name: 'Recursos Multimedia',
    color: '#F59E0B',
    description: 'Imágenes, videos y audio',
    icon: 'folder',
  },
];

export const useAppData = () => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: true,
    resources: [],
    categories: defaultCategories,
    searchTerm: '',
    selectedCategory: null,
    view: 'grid',
  });

  // Load data from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
    const savedResources = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);

    setState(prev => ({
      ...prev,
      isAuthenticated: true, // Always start authenticated for viewing
      resources: savedResources ? JSON.parse(savedResources) : [],
      categories: savedCategories ? JSON.parse(savedCategories) : defaultCategories,
    }));
  }, []);

  // Save to localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  };

  const login = () => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
    saveToStorage(STORAGE_KEYS.AUTH, 'true');
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: true })); // Keep viewing access
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const addResource = (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResource: Resource = {
      ...resourceData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => {
      const newResources = [...prev.resources, newResource];
      saveToStorage(STORAGE_KEYS.RESOURCES, newResources);
      return { ...prev, resources: newResources };
    });
  };

  const updateResource = (id: string, resourceData: Partial<Resource>) => {
    setState(prev => {
      const newResources = prev.resources.map(resource =>
        resource.id === id
          ? { ...resource, ...resourceData, updatedAt: new Date() }
          : resource
      );
      saveToStorage(STORAGE_KEYS.RESOURCES, newResources);
      return { ...prev, resources: newResources };
    });
  };

  const deleteResource = (id: string) => {
    setState(prev => {
      const newResources = prev.resources.filter(resource => resource.id !== id);
      saveToStorage(STORAGE_KEYS.RESOURCES, newResources);
      return { ...prev, resources: newResources };
    });
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    };

    setState(prev => {
      const newCategories = [...prev.categories, newCategory];
      saveToStorage(STORAGE_KEYS.CATEGORIES, newCategories);
      return { ...prev, categories: newCategories };
    });
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setState(prev => {
      const newCategories = prev.categories.map(category =>
        category.id === id ? { ...category, ...categoryData } : category
      );
      saveToStorage(STORAGE_KEYS.CATEGORIES, newCategories);
      return { ...prev, categories: newCategories };
    });
  };

  const deleteCategory = (id: string) => {
    setState(prev => {
      const newCategories = prev.categories.filter(category => category.id !== id);
      saveToStorage(STORAGE_KEYS.CATEGORIES, newCategories);
      return { ...prev, categories: newCategories };
    });
  };

  const setSearchTerm = (term: string) => {
    setState(prev => ({ ...prev, searchTerm: term }));
  };

  const setSelectedCategory = (categoryId: string | null) => {
    setState(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  const setView = (view: 'grid' | 'list') => {
    setState(prev => ({ ...prev, view }));
  };

  // Filtered resources
  const filteredResources = state.resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(state.searchTerm.toLowerCase()));
    
    const matchesCategory = !state.selectedCategory || resource.category === state.selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return {
    state,
    filteredResources,
    actions: {
      login,
      logout,
      addResource,
      updateResource,
      deleteResource,
      addCategory,
      updateCategory,
      deleteCategory,
      setSearchTerm,
      setSelectedCategory,
      setView,
    },
  };
};