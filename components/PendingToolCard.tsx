import React, { useState } from 'react';
import { Category, Tool } from '../types';
import { Check, X, Search, Lightbulb, Layout, Type, Cpu, AppWindow, Workflow, Code, BarChart3, ShieldCheck, Users, Mic, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface PendingToolCardProps {
    category: Partial<Category>;
    tool: Tool;
    onApprove: (toolName: string, categoryId: string) => void;
    onReject: (toolName: string, categoryId: string) => void;
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
    index = 0
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Softened dark grey background
    const DEFAULT_BG = '#262626';

    // Amber color for pending status
    const PENDING_COLOR = '#F59E0B';

    // Calculate display colors
    const bgColor = isHovered ? PENDING_COLOR : DEFAULT_BG;

    // Text Color
    const textColorClass = isHovered ? 'text-[#1E1919]' : 'text-white';
    const descColorClass = isHovered ? 'text-[#1E1919]/80' : 'text-white/60';

    // Badge Background
    const badgeBgClass = isHovered
        ? 'bg-black/5 text-[#1E1919]'
        : 'bg-amber-500/20 text-amber-400';

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
                    <div className={`w-8 h-8 rounded-full ${isHovered ? 'bg-black/10' : 'bg-amber-500/20'} flex items-center justify-center`}>
                        <span className="text-lg">⏳</span>
                    </div>
                </div>
                <div className={`${badgeBgClass} px-2.5 py-1 rounded-sm backdrop-blur-sm transition-colors duration-300`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">PENDING</span>
                </div>
            </div>

            <div className="flex-1 relative z-10">
                {/* CLICKABLE TITLE SECTION */}
                <h3 className="text-2xl font-bold mb-2 leading-tight tracking-tight transition-colors duration-300">
                    <a
                        href={tool.link}
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
            </div>

            <div className="pt-6 mt-auto flex gap-2 relative z-10">
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onApprove(tool.name, category.id!);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${isHovered
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Check size={16} strokeWidth={2.5} />
                    <span>APPROVE</span>
                </motion.button>

                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onReject(tool.name, category.id!);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${isHovered
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <X size={16} strokeWidth={2.5} />
                    <span>REJECT</span>
                </motion.button>
            </div>
        </motion.div>
    );
};