import React, { useState } from 'react';
import { Menu, X, Folder } from 'lucide-react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ResourceCard } from './components/ResourceCard';
import { ResourceForm } from './components/ResourceForm';
import { CategoryForm } from './components/CategoryForm';
import { useAppData } from './hooks/useAppData';
import { Resource, Category } from './types';

function App() {
  const { state, filteredResources, actions } = useAppData();
  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!state.isAuthenticated) {
    return <Login onLogin={actions.login} />;
  }

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
    setEditingResource(null);
    setIsResourceFormOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(cat => cat.id === id);
  };

  const selectedCategoryData = state.selectedCategory 
    ? getCategoryById(state.selectedCategory)
    : null;

  const resourceCount = filteredResources.length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        categories={state.categories}
        selectedCategory={state.selectedCategory}
        onCategorySelect={actions.setSelectedCategory}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        isCollapsed={isSidebarCollapsed}
      />

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
        />

        {/* Toggle sidebar button on mobile */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="lg:hidden fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-30 hover:bg-blue-700 transition-colors"
        >
          {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>

        {/* Content area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Title and stats */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategoryData ? selectedCategoryData.name : 'Todos los recursos'}
                  </h2>
                  {selectedCategoryData?.description && (
                    <p className="text-gray-600 mt-1">{selectedCategoryData.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {resourceCount} {resourceCount === 1 ? 'recurso' : 'recursos'}
                    {state.searchTerm && ' encontrados'}
                  </p>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {filteredResources.length === 0 && (
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
            {filteredResources.length > 0 && (
              <div className={
                state.view === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    category={getCategoryById(resource.category)}
                    onEdit={handleEditResource}
                    onDelete={actions.deleteResource}
                    view={state.view}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
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