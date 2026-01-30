import React, { useState } from 'react';
import { Category, Tool } from '../types';
import { ArrowLeft, ExternalLink, CheckCircle2, Lightbulb, Search, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailViewProps {
  category: Category;
  onBack: () => void;
  onAddTool: () => void;
  onDeleteTool: (toolName: string) => void;
  allTools: Array<{tool: Tool, categoryId: string, categoryName: string}>;
}

const IconMap: Record<string, React.FC<any>> = {
  Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic
};

const ToolCard: React.FC<{ tool: Tool, color: string, refs: any[], onDelete: () => void }> = ({ tool, color, refs, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div 
            className="group bg-[#262626] rounded-lg border border-white/5 hover:border-white/20 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col h-fit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            layout
        >
             <div 
                className="absolute top-0 left-0 w-1 h-full transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: color }}
             />
             
             {/* Header Section (Always Visible) */}
             <div 
                className="p-5 cursor-pointer" 
                onClick={() => setIsExpanded(!isExpanded)}
             >
                <div className="flex-1">
                    {tool.group && (
                        <div className="text-[10px] uppercase tracking-wider font-bold text-white/30 mb-1.5">
                            {tool.group}
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-lg font-bold text-white group-hover:text-white transition-colors">
                            {tool.name}
                        </span>
                        <div className="flex items-center gap-2">
                           {tool.dateAdded && (
                                <span className="text-[10px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded font-mono">
                                    {new Date(tool.dateAdded).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </span>
                           )}
                           
                           <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete "${tool.name}"?`)) {
                                        onDelete();
                                    }
                                }}
                                className="p-1.5 text-white/20 hover:text-red-400 hover:bg-white/10 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete Tool"
                            >
                                <Trash2 size={14} strokeWidth={2} />
                            </button>

                           <motion.div
                             animate={{ rotate: isExpanded ? 180 : 0 }}
                             transition={{ duration: 0.2 }}
                           >
                               <ChevronDown size={16} className="text-white/30" />
                           </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="px-5 pb-5"
                    >
                         {tool.description ? (
                            <p className="text-sm text-white/70 leading-relaxed mb-4 border-t border-white/5 pt-3">
                                {tool.description}
                            </p>
                        ) : (
                            <p className="text-sm text-white/30 italic mb-4 border-t border-white/5 pt-3">
                                No description available.
                            </p>
                        )}
                        
                        <a 
                           href={tool.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center text-xs font-bold text-[#0061FE] hover:text-white transition-colors gap-1.5 uppercase tracking-wider"
                           onClick={(e) => e.stopPropagation()}
                        >
                            Visit Website <ExternalLink size={12} />
                        </a>

                        {/* Cross Reference Tags inside expand */}
                        {refs.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/5">
                                <p className="text-[9px] font-bold text-white/30 mb-1.5 uppercase tracking-wide">Also in:</p>
                                <div className="flex flex-wrap gap-1.5">
                                {refs.map((ref, rIdx) => (
                                    <span key={rIdx} className="text-[10px] bg-[#333333] text-white/60 px-1.5 py-0.5 rounded border border-white/5 font-medium">
                                    {ref.categoryName}
                                    </span>
                                ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const DetailView: React.FC<DetailViewProps> = ({ category, onBack, onAddTool, onDeleteTool, allTools }) => {
  const Icon = IconMap[category.iconName] || Lightbulb;

  // Sort tools by dateAdded (Newest first)
  const sortedToolsList = [...category.tools].sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
      const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
      return dateB - dateA;
  });

  // Split tools into two columns for masonry layout on desktop
  const col1: Tool[] = [];
  const col2: Tool[] = [];
  sortedToolsList.forEach((tool, i) => {
      if (i % 2 === 0) col1.push(tool);
      else col2.push(tool);
  });

  const getCrossReferences = (toolName: string) => {
    return allTools.filter(t => t.tool.name === toolName && t.categoryId !== category.id);
  };

  const isDarkBg = category.isDark;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="relative min-h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      
      {/* Ambient Background Glow */}
      <motion.div 
        className="absolute top-0 inset-x-0 h-[600px] pointer-events-none z-0"
        style={{ 
          background: `radial-gradient(circle at 50% 0%, ${category.color}, transparent 70%)`,
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10 px-4 py-6 md:px-8 md:py-8 max-w-[1600px] mx-auto">
        <motion.button 
          onClick={onBack}
          className="mb-8 flex items-center text-xs font-bold tracking-widest text-white/40 hover:text-white transition-colors group uppercase"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={16} className="mr-2" strokeWidth={1.5} />
          Back to Landscape
        </motion.button>

        {/* Hero Header */}
        <motion.div 
          className="mb-12 flex flex-col md:flex-row gap-5 items-start md:items-center"
          variants={itemVariants}
        >
          <div 
            className={`p-3.5 rounded-xl ${isDarkBg ? 'text-white' : 'text-[#1E1919]'} shadow-lg shadow-black/20 ring-1 ring-black/20`}
            style={{ backgroundColor: category.color }}
          >
             <Icon size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              {category.title}
            </h2>
            <p className="text-lg text-white/60 font-medium max-w-2xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Tools Column */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              className="flex items-center justify-between pb-2 border-b border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                 <span className="bg-white text-[#1E1919] w-6 h-6 rounded flex items-center justify-center text-xs font-bold shadow-sm">1</span>
                 <h3 className="text-xl font-bold text-white">Tools</h3>
              </div>
              
              <div className="flex items-center gap-4">
                  <button 
                    onClick={onAddTool}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-[#0061FE] hover:bg-[#0050D1] px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Add Tool
                  </button>
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Sorted by Newest</span>
              </div>
            </motion.div>
            
            {/* Mobile View: Single Column */}
            <div className="flex flex-col gap-4 md:hidden">
                {sortedToolsList.map((tool, idx) => (
                    <ToolCard 
                        key={`${tool.name}-mobile-${idx}`} 
                        tool={tool} 
                        color={category.color} 
                        refs={getCrossReferences(tool.name)}
                        onDelete={() => onDeleteTool(tool.name)}
                    />
                ))}
            </div>

            {/* Desktop View: Dual Column Masonry */}
            <div className="hidden md:grid md:grid-cols-2 gap-4 items-start">
                 <div className="flex flex-col gap-4">
                    {col1.map((tool, idx) => (
                        <ToolCard 
                            key={`${tool.name}-col1-${idx}`} 
                            tool={tool} 
                            color={category.color} 
                            refs={getCrossReferences(tool.name)}
                            onDelete={() => onDeleteTool(tool.name)}
                        />
                    ))}
                 </div>
                 <div className="flex flex-col gap-4">
                    {col2.map((tool, idx) => (
                        <ToolCard 
                            key={`${tool.name}-col2-${idx}`} 
                            tool={tool} 
                            color={category.color} 
                            refs={getCrossReferences(tool.name)}
                            onDelete={() => onDeleteTool(tool.name)}
                        />
                    ))}
                 </div>
            </div>
          </div>

          {/* Features Column */}
          <div className="lg:col-span-4 space-y-8">
             <motion.div 
               className="flex items-center gap-3 pb-2 border-b border-white/10"
               variants={itemVariants}
             >
              <span className="bg-white text-[#1E1919] w-6 h-6 rounded flex items-center justify-center text-xs font-bold shadow-sm">2</span>
              <h3 className="text-xl font-bold text-white">Features</h3>
            </motion.div>
            
            <motion.div 
              className="bg-[#262626] rounded-xl border border-white/5 shadow-sm overflow-hidden"
              variants={itemVariants}
            >
              <div className="divide-y divide-white/5">
                {category.features.map((feature, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-3 hover:bg-white/5 transition-colors">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-none text-white/40">
                       <CheckCircle2 size={12} strokeWidth={1.5} />
                    </div>
                    <span className="text-white/80 font-medium text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};