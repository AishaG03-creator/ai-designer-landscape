import React from 'react';
import { Category, Tool } from '../types';
import { PendingToolCard } from './PendingToolCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface AdminReviewProps {
    pendingTools: Partial<Category>[];
    onApprove: (toolName: string, categoryId: string) => void;
    onReject: (toolName: string, categoryId: string) => void;
}

export const AdminReview: React.FC<AdminReviewProps> = ({
    pendingTools,
    onApprove,
    onReject
}) => {
    // Flatten pending tools for display
    const allPendingTools: Array<{ tool: Tool; category: Partial<Category>; index: number }> = [];
    let globalIndex = 0;

    pendingTools.forEach(category => {
        if (category.tools && category.tools.length > 0) {
            category.tools.forEach(tool => {
                allPendingTools.push({ tool, category, index: globalIndex++ });
            });
        }
    });

    const totalPending = allPendingTools.length;

    return (
        <div className="h-full flex flex-col pt-4">
            {/* Header */}
            <div className="mb-6 px-2">
                <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                    Admin Review
                </h2>
                <p className="text-white/60 font-medium">
                    Review and approve AI tools discovered by Tool Scout
                </p>
                <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg border border-amber-500/30">
                    <span className="text-2xl font-bold">{totalPending}</span>
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {totalPending === 1 ? 'Tool Pending' : 'Tools Pending'}
                    </span>
                </div>
            </div>

            {/* Content */}
            {totalPending > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 flex-1 pb-10"
                >
                    <AnimatePresence>
                        {allPendingTools.map(({ tool, category, index }) => (
                            <PendingToolCard
                                key={`${category.id}-${tool.name}`}
                                category={category}
                                tool={tool}
                                onApprove={onApprove}
                                onReject={onReject}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center text-center py-32 px-4"
                >
                    <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
                        <Inbox size={48} className="text-white/30" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                        No Pending Tools
                    </h3>
                    <p className="text-white/50 text-lg font-medium max-w-md">
                        All tools have been reviewed. Run Tool Scout to discover new AI design tools.
                    </p>
                    <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-6 max-w-lg">
                        <p className="text-sm text-white/60 font-medium leading-relaxed">
                            <span className="text-amber-400 font-bold">💡 Tip:</span> Run the Tool Scout script to automatically discover and categorize new AI design tools from Product Hunt and There's An AI For That.
                        </p>
                        <code className="block mt-4 bg-black/30 text-green-400 px-4 py-2 rounded text-xs font-mono">
                            cd scripts && node professional-tool-scout.js
                        </code>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
