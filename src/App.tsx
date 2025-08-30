import React, { useState } from 'react';
import { Menu, X, Folder } from 'lucide-react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ResourceCard } from './components/ResourceCard';
import { ResourceForm } from './components/ResourceForm';
import { CategoryForm } from './components/CategoryForm';
import { LoginModal } from './components/LoginModal';
import { useAppData } from './hooks/useAppData';
import { Resource, Category } from './types';

function App() {
  const { state, filteredResources, actions } = useAppData();
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleResourceSubmit = (resourceData: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingResource) {
      actions.updateResource(editingResource.id, resourceData);
      setEditingResource(null);
    } else {
      actions.addResource(resourceData);
    }
    setIsResourceFormOpen(false);
  };

  const handleCategorySubmit = (categoryData: Omit<Category, 'id'>) => {
    if (editingCategory) {
      actions.updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    } else {
      actions.addCategory(categoryData);
    }
    setIsCategoryFormOpen(false);
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsResourceFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleAddResource = () => {
    if (!state.isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingResource(null);
    setIsResourceFormOpen(true);
  };

  const handleAddCategory = () => {
    if (!state.isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleLogin = () => {
    actions.login();
    setIsLoginModalOpen(false);
    setIsResourceFormOpen(true);
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(cat => cat.id === id);
  };

  const selectedCategoryData = state.selectedCategory 
    ? getCategoryById(state.selectedCategory)
    : null;

  const resourceCount = filteredResources.length;

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'hidden lg:block' : 'fixed lg:relative'} inset-y-0 left-0 z-50 lg:z-auto`}>
        <Sidebar
          categories={state.categories}
          selectedCategory={state.selectedCategory}
          onCategorySelect={actions.setSelectedCategory}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          isCollapsed={false}
          isAuthenticated={state.isAuthenticated}
          onClose={() => setIsSidebarCollapsed(true)}
        />
      </div>

      {/* Overlay para móvil */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          searchTerm={state.searchTerm}
          onSearchChange={actions.setSearchTerm}
          view={state.view}
          onViewChange={actions.setView}
          onLogout={actions.logout}
          onAddResource={handleAddResource}
          isAuthenticated={state.isAuthenticated}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content area */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Title and stats */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedCategoryData ? selectedCategoryData.name : 'Todos los recursos'}
                  </h2>
                  {selectedCategoryData?.description && (
                    <p className="text-sm sm:text-base text-gray-600 mt-1">{selectedCategoryData.description}</p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-500">
                    {resourceCount} {resourceCount === 1 ? 'recurso' : 'recursos'}
                    {state.searchTerm && ' encontrados'}
                  </p>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {!state.loading && filteredResources.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Folder className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {state.searchTerm ? 'No se encontraron recursos' : 'No hay recursos aún'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {state.searchTerm 
                      ? 'Intenta con otros términos de búsqueda'
                      : 'Comienza agregando tu primer recurso a la plataforma'
                    }
                  </p>
                  {!state.searchTerm && (
                    <button
                      onClick={handleAddResource}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Agregar primer recurso
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Resources grid/list */}
            {!state.loading && filteredResources.length > 0 && (
              <div className={
                state.view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                  : 'space-y-3 sm:space-y-4'
              }>
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    category={getCategoryById(resource.category)}
                    onEdit={handleEditResource}
                    onDelete={actions.deleteResource}
                    view={state.view}
                    isAuthenticated={state.isAuthenticated}
                  />
                ))}
              </div>
            )}

            {/* Loading state */}
            {state.loading && (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando recursos...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <ResourceForm
        isOpen={isResourceFormOpen}
        onClose={() => {
          setIsResourceFormOpen(false);
          setEditingResource(null);
        }}
        onSubmit={handleResourceSubmit}
        categories={state.categories}
        editingResource={editingResource}
      />

      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => {
          setIsCategoryFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
      />
    </div>
  );
}

export default App;