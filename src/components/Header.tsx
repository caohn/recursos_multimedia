import React from 'react';
import { LogOut, Search, Grid3X3, List, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  onLogout: () => void;
  onAddResource: () => void;
  isAuthenticated: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  view,
  onViewChange,
  onLogout,
  onAddResource,
  isAuthenticated,
  onToggleSidebar,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            {/* Botón menú móvil */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <img
              src="https://www.igcsl.org/igc.png"
              alt="Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Recursos</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Plataforma IGC</p>
            </div>
          </div>

          {/* Barra de búsqueda central */}
          <div className="flex-1 max-w-lg mx-2 sm:mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar recursos..."
                className="w-full pl-10 pr-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Controles de la derecha */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onAddResource}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Agregar</span>
            </button>

            {/* Selector de vista */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 rounded ${
                  view === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                } transition-all`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 rounded ${
                  view === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                } transition-all`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="text-gray-600 hover:text-red-600 p-1.5 sm:p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};