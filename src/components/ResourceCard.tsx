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
    } else if (resource.file) {
      const url = URL.createObjectURL(resource.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const TypeIcon = getTypeIcon(resource.type);
  const videoThumbnail = resource.type === 'link' && resource.url && isVideoUrl(resource.url) 
    ? getVideoThumbnail(resource.url) 
    : null;

  if (view === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
        <div className="flex items-center gap-4">
          {videoThumbnail ? (
            <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-0.5"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
              {resource.type === 'link' && (
                <ExternalLink className="h-4 w-4 text-gray-400" />
              )}
            </div>
            {resource.description && (
              <p className="text-sm text-gray-600 line-clamp-1">{resource.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              {category && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </span>
              )}
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(resource.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-2 transition-opacity ${isAuthenticated ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
            <button
              onClick={handleOpen}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Abrir recurso"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => onEdit(resource)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(resource.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
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
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer"
      onClick={handleOpen}
    >
      <div className="flex items-start justify-between mb-4">
        {videoThumbnail ? (
          <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-4">
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
              <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-y-[8px] border-y-transparent ml-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between w-full">
            <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
              <TypeIcon className="h-6 w-6" />
            </div>
            {isAuthenticated && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  onClick={() => onEdit(resource)}
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  onClick={() => onDelete(resource.id)}
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
        {resource.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>
        )}
      </div>

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{resource.tags.length - 3} más</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {category && (
            <>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-xs text-gray-600">{category.name}</span>
            </>
          )}
        </div>
        
        <button
          onClick={handleOpen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
        >
          Abrir
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};