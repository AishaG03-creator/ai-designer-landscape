import React, { useState, useEffect } from 'react';
import { Category, Tool } from '../types';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tool: Tool, categoryId: string) => void;
  categories: Category[];
  initialCategoryId?: string | null;
}

export const AddToolModal: React.FC<AddToolModalProps> = ({ isOpen, onClose, onAdd, categories, initialCategoryId }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    categoryId: initialCategoryId || categories[0]?.id || '',
    group: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        categoryId: initialCategoryId || categories[0]?.id || '',
        name: '',
        url: '',
        description: '',
        group: ''
      }));
    }
  }, [isOpen, initialCategoryId, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) return;

    const newTool: Tool = {
      name: formData.name,
      url: formData.url || undefined,
      description: formData.description || undefined,
      group: formData.group || undefined,
      dateAdded: new Date().toISOString()
    };

    onAdd(newTool, formData.categoryId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#262626] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#333333]">
                <h3 className="text-xl font-bold text-white">Add New Tool</h3>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full bg-[#1E1919] border border-white/10 rounded-lg pl-4 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE] appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white/60">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Tool Name <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Figma AI"
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    URL
                  </label>
                  <input 
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Briefly describe what this tool does..."
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Group (Optional)
                  </label>
                  <input 
                    type="text"
                    value={formData.group}
                    onChange={(e) => setFormData({...formData, group: e.target.value})}
                    placeholder="e.g., Model Playgrounds"
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#0061FE] text-white hover:bg-[#0050D1] transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Add Tool
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};