import React from 'react';
import { Link, FileText, Upload, ExternalLink, Edit, Trash2, Tag, Calendar } from 'lucide-react';
import { Resource, Category } from '../types';

interface ResourceCardProps {
  resource: Resource;
  category: Category | undefined;
  onEdit: (resource: Resource) => void;
  onDelete: (resourceId: string) => void;
  view: 'grid' | 'list';
  isAuthenticated: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  category,
  onEdit,
  onDelete,
  view,
  isAuthenticated,
}) => {
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'link':
        return Link;
      case 'document':
        return FileText;
      case 'file':
        return Upload;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'link':
        return 'text-blue-600 bg-blue-100';
      case 'document':
        return 'text-green-600 bg-green-100';
      case 'file':
        return 'text-purple-600 bg-purple-100';
    }
  };

  const isVideoUrl = (url: string) => {
    const videoPatterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /vimeo\.com\/(\d+)/,
      /\.mp4$/i,
      /\.webm$/i,
      /\.ogg$/i,
    ];
    return videoPatterns.some(pattern => pattern.test(url));
  };

  const getVideoThumbnail = (url: string) => {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    return null;
  };
  const handleOpen = () => {
    if (resource.type === 'link' && resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.url && (resource.type === 'file' || resource.type === 'document')) {
      // Para archivos almacenados en Supabase Storage, abrir en nueva pestaña
      window.open(resource.url, '_blank');
    }
  };

  const TypeIcon = getTypeIcon(resource.type);
  const videoThumbnail = resource.type === 'link' && resource.url && isVideoUrl(resource.url) 
    ? getVideoThumbnail(resource.url) 
    : null;

  if (view === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow group">
        <div className="flex items-center gap-3 sm:gap-4">
          {videoThumbnail ? (
            <div className="relative w-12 h-9 sm:w-16 sm:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={videoThumbnail}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className={`hidden absolute inset-0 flex items-center justify-center ${getTypeColor(resource.type)}`}>
                <TypeIcon className="h-5 w-5" />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-gray-800 border-y-[3px] sm:border-y-[4px] border-y-transparent ml-0.5"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-2 sm:p-3 rounded-lg ${getTypeColor(resource.type)}`}>
              <TypeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{resource.title}</h3>
              {resource.type === 'link' && (
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
            {resource.description && (
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{resource.description}</p>
            )}
            <div className="flex items-center gap-2 sm:gap-4 mt-2">
              {category && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 truncate">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate">{category.name}</span>
                </span>
              )}
              <span className="text-xs text-gray-500 flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span className="hidden sm:inline">{new Date(resource.createdAt).toLocaleDateString()}</span>
                <span className="sm:hidden">{new Date(resource.createdAt).toLocaleDateString('es', { month: 'short', day: 'numeric' })}</span>
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-1 sm:gap-2 transition-opacity ${isAuthenticated ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <button
              onClick={handleOpen}
              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Abrir recurso"
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => onEdit(resource)}
                  className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => onDelete(resource.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer"
      onClick={handleOpen}
    >
      <div className="flex items-start justify-between mb-4">
        {videoThumbnail ? (
          <div className="relative w-full h-24 sm:h-32 rounded-lg overflow-hidden bg-gray-100 mb-4">
            <img
              src={videoThumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className={`hidden absolute inset-0 flex items-center justify-center ${getTypeColor(resource.type)}`}>
              <TypeIcon className="h-8 w-8" />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] sm:border-l-[12px] border-l-gray-800 border-y-[6px] sm:border-y-[8px] border-y-transparent ml-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between w-full">
            <div className={`p-2 sm:p-3 rounded-lg ${getTypeColor(resource.type)}`}>
              <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            {isAuthenticated && (
              <div className="flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(resource);
                  }}
                  className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(resource.id);
                  }}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
        {resource.description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">{resource.description}</p>
        )}
      </div>

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
            >
              <Tag className="h-3 w-3" />
              <span className="truncate max-w-16 sm:max-w-none">{tag}</span>
            </span>
          ))}
          {resource.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{resource.tags.length - 2} más</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          {category && (
            <div className="flex items-center gap-2 min-w-0">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-gray-600 truncate">{category.name}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto"
        >
          <span className="sm:inline">Abrir</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};