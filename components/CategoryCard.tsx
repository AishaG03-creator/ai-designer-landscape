import React, { useState } from 'react';
import { Category } from '../types';
import { ArrowRight, Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: Category;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const IconMap: Record<string, React.FC<any>> = {
  Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick, onDelete, index = 0 }) => {
  const Icon = IconMap[category.iconName] || Lightbulb;
  const toolCount = category.tools.length;
  const [isHovered, setIsHovered] = useState(false);
  
  // Softened dark grey background instead of harsh black
  const DEFAULT_BG = '#262626';
  
  // Calculate display colors
  const bgColor = isHovered ? category.color : DEFAULT_BG;
  
  // Text Color
  const textColorClass = isHovered 
    ? (category.isDark ? 'text-white' : 'text-[#1E1919]')
    : 'text-white';
    
  const descColorClass = isHovered
    ? (category.isDark ? 'text-white/80' : 'text-[#1E1919]/80')
    : 'text-white/60';

  // Badge Background
  let badgeBgClass;
  if (!isHovered) {
      badgeBgClass = 'bg-white/10 text-white';
  } else {
      badgeBgClass = category.isDark ? 'bg-white/20 text-white' : 'bg-black/5 text-[#1E1919]';
  }

  // Button Background
  let buttonBgClass;
  if (!isHovered) {
      buttonBgClass = 'bg-white/10 text-white'; 
  } else {
      buttonBgClass = category.isDark 
        ? 'bg-white/20 text-white hover:bg-white hover:text-[#0061FE]' 
        : 'bg-black/5 text-[#1E1919] hover:bg-[#1E1919] hover:text-white';
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
        delay: index * 0.05 // Stagger effect based on index
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onClick={() => onClick(category.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ backgroundColor: bgColor }}
      className={`group ${textColorClass} rounded-lg p-6 flex flex-col h-full cursor-pointer relative overflow-hidden min-h-[240px] border border-white/5`}
    >
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="p-2 -ml-2">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <div className={`${badgeBgClass} px-2.5 py-1 rounded-sm backdrop-blur-sm transition-colors duration-300`}>
           <span className="text-[10px] font-bold uppercase tracking-wider">{toolCount} Tools</span>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <h3 className="text-3xl font-bold mb-3 leading-tight tracking-tight transition-colors duration-300">
          {category.title}
        </h3>
        <p className={`text-sm ${descColorClass} font-medium leading-relaxed transition-colors duration-300`}>
          {category.description}
        </p>
      </div>

      <div className="pt-6 mt-auto flex justify-between items-center relative z-10">
         <motion.button
            onClick={(e) => {
              e.stopPropagation();
              if(window.confirm(`Delete "${category.title}"?`)) {
                 onDelete(category.id);
              }
            }}
            className="p-2 -ml-2 rounded-full text-white/20 hover:text-red-400 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Category"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
         >
            <Trash2 size={18} strokeWidth={1.5} />
         </motion.button>

         <motion.div 
           className={`w-10 h-10 rounded-full ${buttonBgClass} flex items-center justify-center`}
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.95 }}
         >
           <ArrowRight size={18} strokeWidth={1.5} />
         </motion.div>
      </div>
    </motion.div>
  );
};