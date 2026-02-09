#!/usr/bin/env node

/**
 * Filter Existing Pending Tools - B2B Focus
 * 
 * Filters the current pending_tools.ts file to keep only tools that match
 * the enhanced B2B keywords. This is a one-time cleanup script.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// B2B-focused keywords for filtering
const B2B_KEYWORDS = [
    'design', 'ui', 'ux', 'image', 'video', 'creative',
    'workflow', 'prototype', 'figma', 'sketch', 'canvas',
    'visual', 'graphic', 'photo', 'art', 'animation',
    'mockup', 'wireframe', 'layout', 'typography', 'color',
    // B2B-focused keywords
    'enterprise', 'business', 'team', 'collaboration', 'saas', 'b2b',
    'professional', 'workspace', 'organization', 'company',
    // Broader keywords
    'ai', 'generator', 'app', 'assistant', 'web', 'tool',
    'create', 'build', 'make', 'generate', 'platform'
];

/**
 * Checks if a tool matches B2B keywords
 */
function matchesB2BKeywords(tool) {
    const searchText = `${tool.name || ''} ${tool.description || ''}`.toLowerCase();

    return B2B_KEYWORDS.some(keyword =>
        searchText.includes(keyword.toLowerCase())
    );
}

/**
 * Reads existing pending tools from the file
 */
function readExistingPendingTools(filePath) {
    try {
        const fileContent = readFileSync(filePath, 'utf-8');

        // Extract the array content using regex
        const arrayMatch = fileContent.match(/export const PENDING_TOOLS: Partial<Category>\[\] = \[([\s\S]*?)\];/);

        if (!arrayMatch || !arrayMatch[1].trim()) {
            console.log('📝 No existing pending tools found');
            return [];
        }

        // Parse the existing categories
        const existingCategories = [];
        const categoryRegex = /{\s*id:\s*'(\d+)',\s*title:\s*'([^']+)',\s*tools:\s*\[([\s\S]*?)\]\s*}/g;

        let categoryMatch;
        while ((categoryMatch = categoryRegex.exec(arrayMatch[1])) !== null) {
            const categoryId = categoryMatch[1];
            const categoryTitle = categoryMatch[2];
            const toolsContent = categoryMatch[3];

            const tools = [];
            const toolRegex = /{\s*name:\s*'([^']+)',\s*url:\s*'([^']+)',\s*description:\s*'([^']*)',\s*dateAdded:\s*'([^']+)'/g;

            let toolMatch;
            while ((toolMatch = toolRegex.exec(toolsContent)) !== null) {
                tools.push({
                    name: toolMatch[1],
                    url: toolMatch[2],
                    description: toolMatch[3],
                    dateAdded: toolMatch[4]
                });
            }

            if (tools.length > 0) {
                existingCategories.push({
                    id: categoryId,
                    title: categoryTitle,
                    tools: tools
                });
            }
        }

        return existingCategories;

    } catch (error) {
        console.error('⚠️  Error reading existing pending tools:', error.message);
        return [];
    }
}

/**
 * Writes filtered tools back to pending_tools.ts
 */
function writeFilteredTools(filePath, categories) {
    const totalTools = categories.reduce((sum, cat) => sum + cat.tools.length, 0);

    // Generate TypeScript code
    let tsCode = `import { Category } from '../types';\n\n`;
    tsCode += `/**\n`;
    tsCode += ` * PENDING TOOLS - Holding Pen for Unapproved Discoveries\n`;
    tsCode += ` * \n`;
    tsCode += ` * Filtered by B2B keywords on ${new Date().toISOString()}\n`;
    tsCode += ` * Total tools pending: ${totalTools}\n`;
    tsCode += ` */\n\n`;
    tsCode += `export const PENDING_TOOLS: Partial<Category>[] = [\n`;

    categories.forEach((category, index) => {
        tsCode += `  {\n`;
        tsCode += `    id: '${category.id}',\n`;
        tsCode += `    title: '${category.title}',\n`;
        tsCode += `    tools: [\n`;

        category.tools.forEach((tool, toolIndex) => {
            tsCode += `      {\n`;
            tsCode += `        name: '${tool.name.replace(/'/g, "\\'")}',\n`;
            tsCode += `        url: '${tool.url}',\n`;
            tsCode += `        description: '${tool.description.replace(/'/g, "\\'")}',\n`;
            tsCode += `        dateAdded: '${tool.dateAdded}'\n`;
            tsCode += `      }${toolIndex < category.tools.length - 1 ? ',' : ''}\n`;
        });

        tsCode += `    ]\n`;
        tsCode += `  }${index < categories.length - 1 ? ',' : ''}\n`;
    });

    tsCode += `];\n`;

    writeFileSync(filePath, tsCode);
}

/**
 * Main execution function
 */
async function filterPendingTools() {
    console.log('🔍 B2B Pending Tools Filter Starting...\n');

    const pendingFilePath = join(__dirname, '..', 'src', 'data', 'pending_tools.ts');

    // Read existing pending tools
    const existingCategories = readExistingPendingTools(pendingFilePath);
    const originalCount = existingCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

    console.log(`📊 Original pending tools: ${originalCount}`);

    // Filter tools by B2B keywords
    const filteredCategories = [];
    let removedCount = 0;
    let keptCount = 0;

    existingCategories.forEach(category => {
        const filteredTools = category.tools.filter(tool => {
            const matches = matchesB2BKeywords(tool);
            if (matches) {
                keptCount++;
                console.log(`  ✅ KEEP: "${tool.name}" - matches B2B keywords`);
            } else {
                removedCount++;
                console.log(`  ❌ REMOVE: "${tool.name}" - no B2B keyword match`);
            }
            return matches;
        });

        if (filteredTools.length > 0) {
            filteredCategories.push({
                id: category.id,
                title: category.title,
                tools: filteredTools
            });
        }
    });

    // Write filtered tools back
    writeFilteredTools(pendingFilePath, filteredCategories);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 FILTERING SUMMARY');
    console.log('='.repeat(60));
    console.log(`📥 Original tools: ${originalCount}`);
    console.log(`✅ Kept (B2B match): ${keptCount}`);
    console.log(`❌ Removed (no match): ${removedCount}`);
    console.log(`📊 Final pending tools: ${keptCount}`);
    console.log(`💾 Updated: src/data/pending_tools.ts\n`);

    console.log('✅ Filtering completed successfully!');
}

// Run the filter
filterPendingTools();
