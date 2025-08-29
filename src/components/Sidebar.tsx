import React from 'react';
import { Folder, FolderOpen, Plus, Edit } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onEditCategory,
  isCollapsed,
}) => {
  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
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
            {!isCollapsed && (
              <>
                <span className="font-medium">Todos los recursos</span>
              </>
            )}
          </button>
        </div>

        {/* Lista de categorías */}
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Categorías</h3>
              <button
                onClick={onAddCategory}
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Agregar categoría"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}

          {categories.map((category) => (
            <div key={category.id} className="group relative">
              <button
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                {!isCollapsed && (
                  <>
                    <span className="font-medium truncate flex-1 text-left">{category.name}</span>
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
                  </>
                )}
              </button>
            </div>
          ))}

          {isCollapsed && (
            <button
              onClick={onAddCategory}
              className="w-full p-3 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              title="Agregar categoría"
            >
              <Plus className="h-4 w-4 mx-auto" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};