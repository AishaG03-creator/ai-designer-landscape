// This tells TypeScript to stop complaining about missing React definitions
/// <reference types="vite/client" />
import React, { useState } from 'react';
// @ts-ignore
import { Category, Tool } from '../types';
import { PendingToolCard } from './PendingToolCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Inbox, Lock } from 'lucide-react';

interface AdminReviewProps {
    pendingTools: Partial<Category>[];
    setPendingTools?: React.Dispatch<React.SetStateAction<Partial<Category>[]>>;
    allCategories: Category[]; // Add all categories for dropdown
}

export const AdminReview: React.FC<AdminReviewProps> = ({
    pendingTools,
    setPendingTools,
    allCategories
}) => {
    // --- AUTHENTICATION STATE ---
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isApproving, setIsApproving] = useState(false);

    // Debug: Check if env var is loaded
    React.useEffect(() => {
        const env = (import.meta as any).env;
        console.log('VITE_ADMIN_PASSWORD is defined:', !!env.VITE_ADMIN_PASSWORD);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: We cast to 'any' to bypass the TypeScript error seen in Screenshot 2
        const env = (import.meta as any).env;
        const adminPassword = env.VITE_ADMIN_PASSWORD;

        // Check if password is configured
        if (!adminPassword) {
            setErrorMsg('Admin password not configured. Please set VITE_ADMIN_PASSWORD in Vercel.');
            return;
        }

        if (passwordInput === adminPassword) {
            setIsAuthenticated(true);
            setErrorMsg('');
        } else {
            setErrorMsg('Access Denied');
        }
    };

    const handleApprove = async (toolName: string, categoryId: string) => {
        // Safe check for tool existence
        const category = pendingTools.find(c => c.id === categoryId);
        const tool = category?.tools?.find(t => t.name === toolName);

        if (!tool) return;

        if (!confirm(`Approve "${toolName}"? This will trigger a live deployment.`)) return;

        setIsApproving(true);
        try {
            const env = (import.meta as any).env;

            const response = await fetch('/api/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: env.VITE_ADMIN_PASSWORD,
                    tool,
                    categoryId
                }),
            });

            if (response.ok) {
                alert('Success! Tool approved. Deployment started (wait ~2 mins).');
                // Optimistically remove from UI
                if (setPendingTools) {
                    setPendingTools(prev => prev.map(cat => ({
                        ...cat,
                        tools: cat.tools?.filter(t => t.name !== toolName)
                    })));
                }
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to connect to server.');
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = (toolName: string, categoryId: string) => {
        if (setPendingTools) {
            setPendingTools(prev => prev.map(cat => ({
                ...cat,
                tools: cat.tools?.filter(t => t.name !== toolName)
            })));
        }
    };

    // --- LOCK SCREEN (The part from Screenshot 3) ---
    if (!isAuthenticated) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-md text-center">
                    <div className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-[#6366f1]" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Restricted Access</h2>
                    <p className="text-gray-400 mb-6">Enter admin password to review tools.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white/20 outline-none transition-all"
                            placeholder="Password..."
                        />
                        {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
                        <button
                            type="submit"
                            className="w-full bg-[#2a2a2a] hover:bg-[#333333] text-white font-medium py-3 rounded-lg transition-all border border-white/10"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- MAIN ADMIN UI ---
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
        <div className="h-full flex flex-col pt-4 relative">
            {isApproving && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-white text-xl font-bold animate-pulse">Contacting GitHub...</div>
                </div>
            )}

            <div className="mb-6 px-2 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Admin Review</h2>
                    <p className="text-white/60 font-medium">Logged in as Admin</p>
                </div>
                <button onClick={() => setIsAuthenticated(false)} className="text-sm text-gray-500 hover:text-white">Logout</button>
            </div>

            {totalPending > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 flex-1 pb-10">
                    <AnimatePresence>
                        {allPendingTools.map(({ tool, category, index }) => (
                            <PendingToolCard
                                key={`${category.id}-${tool.name}`}
                                category={category}
                                tool={tool}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                allCategories={allCategories}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-32 opacity-50">
                    <Inbox size={48} className="mb-4" />
                    <p>No tools pending.</p>
                </div>
            )}
        </div>
    );
};