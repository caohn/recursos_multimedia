import React, { useState, useEffect } from 'react';
import { X, Folder, Palette } from 'lucide-react';
import { Category } from '../types';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  editingCategory?: Category | null;
}

const colorOptions = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: colorOptions[0],
    description: '',
    icon: 'folder',
    resourceType: 'documents' as Category['resourceType'],
  });

  const resourceTypes = [
    { id: 'documents', name: 'Documentos', icon: FileText, color: '#10B981' },
    { id: 'links', name: 'Enlaces', icon: Link, color: '#3B82F6' },
    { id: 'media', name: 'Multimedia', icon: Upload, color: '#F59E0B' },
    { id: 'other', name: 'Otros', icon: Folder, color: '#8B5CF6' },
  ];

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        color: editingCategory.color,
        description: editingCategory.description,
        icon: editingCategory.icon,
        resourceType: editingCategory.resourceType,
      });
    } else {
      setFormData({
        name: '',
        color: colorOptions[0],
        description: '',
        icon: 'folder',
        resourceType: 'documents',
      });
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de recurso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de recurso *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resourceType: type.id as Category['resourceType'] }))}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      formData.resourceType === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" style={{ color: formData.resourceType === type.id ? '#3B82F6' : type.color }} />
                    <span className="font-medium">{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la categoría *
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Documentos importantes"
                required
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color de identificación
            </label>
            <div className="grid grid-cols-5 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-800 scale-110 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Descripción opcional de la categoría"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingCategory ? 'Actualizar' : 'Crear categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};