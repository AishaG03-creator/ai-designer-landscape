import React from 'react';
import { Tool, Category } from '../types';
import { ExternalLink, Search } from 'lucide-react';

interface ToolIndexProps {
  categories: Category[];
  searchTerm: string;
}

export const ToolIndex: React.FC<ToolIndexProps> = ({ categories, searchTerm }) => {
  const toolMap = new Map<string, { tool: Tool, categories: Category[] }>();

  categories.forEach(cat => {
    cat.tools.forEach(tool => {
      if (!toolMap.has(tool.name)) {
        toolMap.set(tool.name, { tool, categories: [] });
      }
      toolMap.get(tool.name)?.categories.push(cat);
    });
  });

  const sortedTools = Array.from(toolMap.values())
    .sort((a, b) => a.tool.name.localeCompare(b.tool.name))
    .filter(item => {
      const search = searchTerm.toLowerCase();
      return (
        item.tool.name.toLowerCase().includes(search) ||
        item.categories.some(c => c.title.toLowerCase().includes(search))
      );
    });

  return (
    <div className="px-4 py-4 md:px-6 md:py-6">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-4">Tool Index</h2>
        <p className="text-white/60 text-lg">
          A complete A-Z list of {sortedTools.length} tools. 
          {searchTerm && ` Showing results for "${searchTerm}"`}
        </p>
      </div>

      <div className="bg-[#262626] rounded-2xl border border-white/10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-white/5">
          {sortedTools.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div className="flex items-center gap-3">
                <a 
                  href={item.tool.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-white group-hover:text-[#0061FE] group-hover:underline flex items-center gap-2 transition-colors"
                >
                  {item.tool.name}
                  <ExternalLink size={14} className="opacity-30 group-hover:opacity-100" strokeWidth={1.5} />
                </a>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {item.categories.map(cat => (
                  <span 
                    key={cat.id} 
                    className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold bg-[#333333] text-white border border-white/10 whitespace-nowrap"
                  >
                    <span 
                        className="w-2.5 h-2.5 rounded-full mr-2.5" 
                        style={{ backgroundColor: cat.color }}
                    ></span>
                    {cat.shortTitle || cat.title}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {sortedTools.length === 0 && (
            <div className="p-20 text-center text-white/30">
              <Search size={64} className="mx-auto mb-6 opacity-20" strokeWidth={1.5} />
              <p className="text-xl font-medium">No tools found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};