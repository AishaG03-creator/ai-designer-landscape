import React, { useState } from 'react';
import { Category, Tool } from '../../types';
import { Check, X, Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface PendingToolCardProps {
    category: Partial<Category>;
    tool: Tool;
    onApprove: (toolName: string, categoryId: string) => void;
    onReject: (toolName: string, categoryId: string) => void;
    allCategories: Category[]; // Add all categories for dropdown
    index?: number;
}

const IconMap: Record<string, React.FC<any>> = {
    Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic
};

export const PendingToolCard: React.FC<PendingToolCardProps> = ({
    category,
    tool,
    onApprove,
    onReject,
    allCategories,
    index = 0
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(category.id || '');

    // Softened dark grey background
    const DEFAULT_BG = '#262626';

    // Warm cream color for card hover
    const PENDING_COLOR = '#fffbeb';

    // Calculate display colors
    const bgColor = isHovered ? PENDING_COLOR : DEFAULT_BG;

    // Text Color
    const textColorClass = isHovered ? 'text-gray-900' : 'text-white';
    const descColorClass = isHovered ? 'text-gray-700' : 'text-white/60';

    // Badge Background
    const badgeBgClass = isHovered
        ? 'bg-[#6366f1] text-white'
        : 'bg-[#e0e7ff]/10 text-white';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: index * 0.05
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ backgroundColor: bgColor }}
            className={`group ${textColorClass} rounded-lg p-6 flex flex-col h-full relative overflow-hidden min-h-[240px] border border-white/5`}
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
                    <div className={`w-8 h-8 rounded-full ${isHovered ? 'bg-[#6366f1]/10' : 'bg-[#e0e7ff]/10'} flex items-center justify-center`}>
                        <span className="text-lg">⏳</span>
                    </div>
                </div>
                {!isHovered && (
                    <div className={`${badgeBgClass} px-3 py-1.5 rounded-sm backdrop-blur-sm transition-all duration-300`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">PENDING</span>
                    </div>
                )}
            </div>

            <div className="flex-1 relative z-10">
                {/* CLICKABLE TITLE SECTION */}
                <h3 className="text-2xl font-bold mb-2 leading-tight tracking-tight transition-colors duration-300">
                    <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:underline decoration-2 underline-offset-4"
                        onClick={(e) => e.stopPropagation()} // Prevents card hover issues
                    >
                        {tool.name}
                        <ExternalLink size={18} strokeWidth={2.5} className="opacity-70" />
                    </a>
                </h3>

                <p className={`text-xs ${descColorClass} font-medium mb-3 transition-colors duration-300 opacity-60`}>
                    → {category.title}
                </p>
                <p className={`text-sm ${descColorClass} font-medium leading-relaxed transition-colors duration-300`}>
                    {tool.description}
                </p>

                {/* Category Selector */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <label className={`block text-xs font-bold mb-2 transition-colors duration-300 ${isHovered ? 'text-gray-600' : 'text-white/50'}`}>
                        ASSIGN TO CATEGORY
                    </label>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className={`w-full px-3 py-2 rounded-md text-sm font-medium transition-all border ${isHovered
                                ? 'bg-white border-gray-300 text-gray-900'
                                : 'bg-[#1a1a1a] border-white/10 text-white'
                            } focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {allCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="pt-6 mt-auto flex gap-2 relative z-10">
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onApprove(tool.name, selectedCategoryId);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all bg-[#2a2a2a] text-white hover:bg-[#333333] border border-white/10"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <Check size={16} strokeWidth={2} />
                    <span>Approve</span>
                </motion.button>

                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onReject(tool.name, category.id!);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all bg-[#2a2a2a] text-white hover:bg-[#333333] border border-white/10"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <X size={16} strokeWidth={2} />
                    <span>Reject</span>
                </motion.button>
            </div>
        </motion.div>
    );
};