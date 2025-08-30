import React from 'react';
import { Folder, FolderOpen, Plus, Edit, FileText, Link, Upload, Layers, Image, X } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  isAuthenticated: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onEditCategory,
  isAuthenticated,
  onClose,
}) => {
  // Agrupar categorías por tipo de recurso
  const resourceTypes = [
    {
      id: 'documents',
      name: 'Documentos',
      icon: FileText,
      color: '#10B981',
      categories: categories.filter(cat => cat.resourceType === 'documents' || (!cat.resourceType && cat.name.toLowerCase().includes('documento')))
    },
    {
      id: 'links',
      name: 'Enlaces',
      icon: Link,
      color: '#3B82F6',
      categories: categories.filter(cat => cat.resourceType === 'links' || (!cat.resourceType && cat.name.toLowerCase().includes('enlace')))
    },
    {
      id: 'media',
      name: 'Multimedia',
      icon: Image,
      color: '#F59E0B',
      categories: categories.filter(cat => cat.resourceType === 'media' || (!cat.resourceType && cat.name.toLowerCase().includes('multimedia')))
    },
    {
      id: 'other',
      name: 'Otros',
      icon: Layers,
      color: '#8B5CF6',
      categories: categories.filter(cat => cat.resourceType === 'other' || (!cat.resourceType && !cat.name.toLowerCase().includes('documento') && !cat.name.toLowerCase().includes('enlace') && !cat.name.toLowerCase().includes('multimedia')))
    }
  ];

  return (
    <aside className="bg-white border-r border-gray-200 w-72 h-screen overflow-y-auto">
      {/* Header móvil */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Categorías</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 h-full">
        {/* Todas las categorías */}
        <div>
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FolderOpen className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Todos los recursos</span>
          </button>
        </div>

        {/* Tipos de recursos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Tipos de recursos</h3>
            {isAuthenticated && (
              <button
                onClick={onAddCategory}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Agregar categoría"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>

          {resourceTypes.filter(type => type.categories.length > 0).map((type) => (
            <div key={type.id} className="space-y-2">
              <div className="flex items-center gap-2 px-2 py-1">
                <type.icon className="h-4 w-4" style={{ color: type.color }} />
                <span className="text-sm font-medium text-gray-700">{type.name}</span>
              </div>
              
              <div className="space-y-1 ml-2">
                {type.categories.map((category) => (
                  <div key={category.id} className="group relative">
                    <button
                      onClick={() => onCategorySelect(category.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name === 'Lecciones M&M' ? (
                        <img 
                          src="https://igcsl.org/subidas/logomm.png" 
                          alt="M&M Logo" 
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm object-cover"
                        />
                      ) : (
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <span className="font-medium truncate flex-1 text-left text-sm">{category.name}</span>
                      {isAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCategory(category);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all p-1 rounded"
                          title="Editar categoría"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </aside>
  );
};