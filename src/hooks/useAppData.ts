import { useState, useEffect } from 'react';
import { Resource, Category, AppState } from '../types';
import { supabase, DatabaseCategory, DatabaseResource } from '../lib/supabase';

const STORAGE_KEY_AUTH = 'resources_auth';

export const useAppData = () => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    resources: [],
    categories: [],
    searchTerm: '',
    selectedCategory: null,
    view: 'grid',
  });

  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Cargar recursos
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: true });

      if (resourcesError) throw resourcesError;

      // Convertir datos de la base de datos al formato de la aplicación
      const categories: Category[] = (categoriesData || []).map((cat: DatabaseCategory) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        description: cat.description,
        icon: cat.icon,
        resourceType: cat.resource_type,
      }));

      const resources: Resource[] = (resourcesData || []).map((res: DatabaseResource) => ({
        id: res.id,
        title: res.title,
        type: res.type,
        url: res.url,
        description: res.description,
        category: res.category_id,
        tags: res.tags || [],
        createdAt: new Date(res.created_at),
        updatedAt: new Date(res.updated_at),
        file: res.file_name ? new File([], res.file_name) : undefined,
      }));

      setState(prev => ({
        ...prev,
        categories,
        resources,
      }));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    setState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false }));
  };

  const addResource = async (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Validar datos requeridos
      if (!resourceData.title || !resourceData.category) {
        throw new Error('Título y categoría son requeridos');
      }

      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      // Si hay un archivo, subirlo a Supabase Storage
      if (resourceData.file) {
        const file = resourceData.file;
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resources')
          .upload(uniqueFileName, file);

        if (uploadError) {
          throw new Error(`Error al subir archivo: ${uploadError.message}`);
        }

        // Obtener URL pública del archivo
        const { data: urlData } = supabase.storage
          .from('resources')
          .getPublicUrl(uniqueFileName);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileSize = file.size;
      }

      // Preparar datos para insertar
      const insertData = {
        title: resourceData.title,
        type: resourceData.type,
        description: resourceData.description || '',
        category_id: resourceData.category,
        tags: resourceData.tags || [],
        ...(fileUrl && { url: fileUrl }),
        ...(fileName && { file_name: fileName }),
        ...(fileSize && { file_size: fileSize }),
      };

      // Solo agregar URL si es tipo link y tiene URL
      if (resourceData.type === 'link' && resourceData.url && !fileUrl) {
        insertData.url = resourceData.url;
      }

      const { data, error } = await supabase
        .from('resources')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Agregar al estado local
      const newResource: Resource = {
        id: data.id,
        title: data.title,
        type: data.type,
        url: data.url,
        description: data.description,
        category: data.category_id,
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setState(prev => ({
        ...prev,
        resources: [newResource, ...prev.resources],
      }));
    } catch (error) {
      console.error('Error adding resource:', error);
      alert(`Error al agregar el recurso: ${error.message}`);
    }
  };

  const updateResource = async (id: string, resourceData: Partial<Resource>) => {
    try {
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      // Si hay un archivo nuevo, subirlo
      if (resourceData.file) {
        const file = resourceData.file;
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resources')
          .upload(uniqueFileName, file);

        if (uploadError) {
          throw new Error(`Error al subir archivo: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('resources')
          .getPublicUrl(uniqueFileName);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
        fileSize = file.size;
      }

      const updateData = {
        ...(resourceData.title && { title: resourceData.title }),
        ...(resourceData.type && { type: resourceData.type }),
        ...(resourceData.description !== undefined && { description: resourceData.description }),
        ...(resourceData.category && { category_id: resourceData.category }),
        ...(resourceData.tags && { tags: resourceData.tags }),
        ...(fileUrl && { url: fileUrl }),
        ...(fileName && { file_name: fileName }),
        ...(fileSize && { file_size: fileSize }),
        ...(resourceData.url && resourceData.type === 'link' && !fileUrl && { url: resourceData.url }),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('resources')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setState(prev => ({
        ...prev,
        resources: prev.resources.map(resource =>
          resource.id === id
            ? { ...resource, ...resourceData, updatedAt: new Date() }
            : resource
        ),
      }));
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Error al actualizar el recurso. Inténtalo de nuevo.');
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setState(prev => ({
        ...prev,
        resources: prev.resources.filter(resource => resource.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Error al eliminar el recurso. Inténtalo de nuevo.');
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          color: categoryData.color,
          description: categoryData.description,
          icon: categoryData.icon,
          resource_type: categoryData.resourceType,
        })
        .select()
        .single();

      if (error) throw error;

      // Agregar al estado local
      const newCategory: Category = {
        id: data.id,
        name: data.name,
        color: data.color,
        description: data.description,
        icon: data.icon,
        resourceType: data.resource_type,
      };

      setState(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error al agregar la categoría. Inténtalo de nuevo.');
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updateData = {
          ...(categoryData.name && { name: categoryData.name }),
          ...(categoryData.color && { color: categoryData.color }),
          ...(categoryData.description !== undefined && { description: categoryData.description }),
          ...(categoryData.icon && { icon: categoryData.icon }),
          ...(categoryData.resourceType && { resource_type: categoryData.resourceType }),
        };

      const { error } = await supabase
        .from('categories')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Actualizar estado local
      setState(prev => ({
        ...prev,
        categories: prev.categories.map(category =>
          category.id === id ? { ...category, ...categoryData } : category
        ),
      }));
    } catch (error) {
      console.error('💥 Error completo:', error);
      alert('Error al actualizar la categoría. Inténtalo de nuevo.');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar estado local
      setState(prev => ({
        ...prev,
        categories: prev.categories.filter(category => category.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría. Inténtalo de nuevo.');
    }
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

  // Filtrar recursos
  const filteredResources = state.resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(state.searchTerm.toLowerCase()));
    
    const matchesCategory = !state.selectedCategory || resource.category === state.selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return {
    state: { ...state, loading },
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