import React, { useState, useEffect } from 'react';
import { X, Link, FileText, Upload, Tag, Folder } from 'lucide-react';
import { Resource, Category } from '../types';

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  editingResource?: Resource | null;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  editingResource,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'link' as Resource['type'],
    url: '',
    description: '',
    category: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (editingResource) {
      setFormData({
        title: editingResource.title,
        type: editingResource.type,
        url: editingResource.url || '',
        description: editingResource.description,
        category: editingResource.category,
        tags: [...editingResource.tags],
      });
      setFile(editingResource.file || null);
    } else {
      setFormData({
        title: '',
        type: 'link',
        url: '',
        description: '',
        category: '',
        tags: [],
      });
      setFile(null);
    }
  }, [editingResource, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!formData.category) {
      alert('Debes seleccionar una categoría');
      return;
    }

    if (formData.type === 'link' && !formData.url.trim()) {
      alert('La URL es requerida para enlaces');
      return;
    }

    if ((formData.type === 'file' || formData.type === 'document') && !file && !editingResource) {
      alert('Debes seleccionar un archivo');
      return;
    }

    onSubmit({
      ...formData,
      file: file || undefined,
      tags: formData.tags.filter(tag => tag.trim() !== ''),
    });

    // Reset form
    setFormData({
      title: '',
      type: 'link',
      url: '',
      description: '',
      category: '',
      tags: [],
    });
    setTagInput('');
    setFile(null);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFormData(prev => ({
        ...prev,
        title: prev.title || selectedFile.name
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              {editingResource ? 'Editar Recurso' : 'Agregar Recurso'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Tipo de recurso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de recurso
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'link', icon: Link, label: 'Enlace' },
                { type: 'document', icon: FileText, label: 'Documento' },
                { type: 'file', icon: Upload, label: 'Archivo' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type as Resource['type'] }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    formData.type === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del recurso"
              required
            />
          </div>

          {/* URL o archivo */}
          {formData.type === 'link' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://ejemplo.com"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'file' ? 'Archivo' : 'Documento'} *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  accept={formData.type === 'document' ? '.pdf,.doc,.docx,.txt' : '*'}
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {file ? file.name : 'Haz clic para seleccionar un archivo'}
                  </p>
                  {!editingResource && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === 'document' ? 'PDF, DOC, DOCX, TXT' : 'Cualquier tipo de archivo'}
                    </p>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Descripción opcional del recurso"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Escribe una etiqueta y presiona Enter"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingResource ? 'Actualizar recurso' : 'Guardar recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};