import React, { useState } from 'react';
import { Category } from '../types';
import { X, Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Category) => void;
}

const AVAILABLE_ICONS = [
  'Search', 'Lightbulb', 'Layout', 'Type', 'Cpu', 'AppWindow', 
  'Workflow', 'Code', 'BarChart3', 'ShieldCheck', 'Users', 'Mic'
];

const AVAILABLE_COLORS = [
  '#FF808B', // Salmon
  '#FFD966', // Yellow
  '#0061FE', // Dropbox Blue
  '#CB9CF2', // Lavender
  '#78D9B4', // Mint
  '#5EC2C2', // Teal
  '#FF9E66', // Orange
  '#546E7A', // Blue Grey
  '#EF5350', // Red
  '#AB47BC', // Purple
  '#EC407A', // Pink
  '#262626'  // Dark
];

const IconMap: Record<string, React.FC<any>> = {
  Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic
};

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    description: '',
    color: AVAILABLE_COLORS[2],
    iconName: AVAILABLE_ICONS[1]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      title: formData.title,
      shortTitle: formData.shortTitle || formData.title,
      description: formData.description,
      color: formData.color,
      isDark: formData.color === '#262626' ? false : true, // Heuristic for text contrast
      iconName: formData.iconName,
      tools: [],
      features: []
    };

    onAdd(newCategory);
    onClose();
    setFormData({
      title: '',
      shortTitle: '',
      description: '',
      color: AVAILABLE_COLORS[2],
      iconName: AVAILABLE_ICONS[1]
    });
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
              className="bg-[#262626] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#333333] flex-none">
                <h3 className="text-xl font-bold text-white">Add New Category</h3>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Category Title <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., AI for Research"
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Short Title (Optional)
                  </label>
                  <input 
                    type="text"
                    value={formData.shortTitle}
                    onChange={(e) => setFormData({...formData, shortTitle: e.target.value})}
                    placeholder="e.g., Research"
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea 
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Why designers care..."
                    className="w-full bg-[#1E1919] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0061FE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({...formData, color})}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${formData.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      >
                         {formData.color === color && <Check size={14} className={color === '#262626' ? 'text-white' : 'text-black/50'} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {AVAILABLE_ICONS.map(iconName => {
                      const Icon = IconMap[iconName];
                      const isSelected = formData.iconName === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setFormData({...formData, iconName})}
                          className={`p-3 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-[#0061FE] text-white shadow-lg' : 'bg-[#1E1919] text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
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
                    Add Category
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