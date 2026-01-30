import React, { useState, useMemo } from 'react';
import { CATEGORIES } from './constants';
import { PENDING_TOOLS } from './src/data/pending_tools';
import { Layout } from './components/Layout';
import { CategoryCard } from './components/CategoryCard';
import { DetailView } from './components/DetailView';
import { ToolIndex } from './components/ToolIndex';
import { AddToolModal } from './components/AddToolModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { AdminReview } from './components/AdminReview';
import { ViewMode, Tool, Category } from './types';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [pendingTools, setPendingTools] = useState(PENDING_TOOLS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Track which category to pre-select in the tool modal
  const [addToolInitialCategory, setAddToolInitialCategory] = useState<string | null>(null);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const allTools = useMemo(() => {
    const list: Array<{ tool: any, categoryId: string, categoryName: string }> = [];
    categories.forEach(cat => {
      cat.tools.forEach(tool => {
        list.push({ tool, categoryId: cat.id, categoryName: cat.shortTitle || cat.title });
      });
    });
    return list;
  }, [categories]);

  const filteredCategories = categories.filter(cat => {
    const term = searchTerm.toLowerCase();
    return (
      cat.title.toLowerCase().includes(term) ||
      cat.description.toLowerCase().includes(term) ||
      cat.features.some(f => f.toLowerCase().includes(term)) ||
      cat.tools.some(t => t.name.toLowerCase().includes(term))
    );
  });

  const handleCategoryClick = (id: string) => {
    setSelectedCategoryId(id);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setViewMode('grid');
    setSelectedCategoryId(null);
  };

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'grid' || mode === 'tool-index') {
      setSelectedCategoryId(null);
    }
  };

  const handleOpenAddTool = (categoryId?: string) => {
    setAddToolInitialCategory(categoryId || null);
    setIsAddToolModalOpen(true);
  };

  const handleAddTool = (tool: Tool, categoryId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, tools: [tool, ...cat.tools] };
      }
      return cat;
    }));
  };

  const handleDeleteTool = (toolName: string, categoryId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, tools: cat.tools.filter(t => t.name !== toolName) };
      }
      return cat;
    }));
  };

  const handleAddCategory = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
      setViewMode('grid');
    }
  };

  const handleApproveTool = (toolName: string, categoryId: string) => {
    // Find the tool in pending
    const pendingCategory = pendingTools.find(c => c.id === categoryId);
    const tool = pendingCategory?.tools?.find(t => t.name === toolName);

    if (!tool) return;

    // Add to live categories
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, tools: [tool, ...cat.tools] };
      }
      return cat;
    }));

    // Remove from pending
    setPendingTools(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, tools: cat.tools?.filter(t => t.name !== toolName) || [] };
      }
      return cat;
    }).filter(cat => cat.tools && cat.tools.length > 0));
  };

  const handleRejectTool = (toolName: string, categoryId: string) => {
    // Remove from pending
    setPendingTools(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, tools: cat.tools?.filter(t => t.name !== toolName) || [] };
      }
      return cat;
    }).filter(cat => cat.tools && cat.tools.length > 0));
  };

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        {viewMode === 'admin' ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <AdminReview
              pendingTools={pendingTools}
              onApprove={handleApproveTool}
              onReject={handleRejectTool}
            />
          </motion.div>
        ) : viewMode === 'tool-index' ? (
          <motion.div
            key="tool-index"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ToolIndex categories={categories} searchTerm={searchTerm} />
          </motion.div>
        ) : viewMode === 'detail' && selectedCategory ? (
          <motion.div key="detail" className="h-full">
            <DetailView
              category={selectedCategory}
              onBack={handleBack}
              onAddTool={() => handleOpenAddTool(selectedCategory.id)}
              onDeleteTool={(toolName) => handleDeleteTool(toolName, selectedCategory.id)}
              allTools={allTools}
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="h-full flex flex-col pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredCategories.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 flex-1 pb-10"
              >
                <AnimatePresence>
                  {filteredCategories.map((category, index) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      onClick={handleCategoryClick}
                      onDelete={handleDeleteCategory}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 px-4"
              >
                <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                  <Search size={32} className="text-white/30" strokeWidth={1.5} />
                </div>
                <p className="text-white/50 text-xl font-medium">No categories found matching "{searchTerm}"</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-[#0061FE] hover:underline font-bold"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      <Layout
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddCategory={() => setIsAddCategoryModalOpen(true)}
      >
        {renderContent()}
      </Layout>
      <AddToolModal
        isOpen={isAddToolModalOpen}
        onClose={() => setIsAddToolModalOpen(false)}
        onAdd={handleAddTool}
        categories={categories}
        initialCategoryId={addToolInitialCategory}
      />
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />
    </>
  );
}

export default App;