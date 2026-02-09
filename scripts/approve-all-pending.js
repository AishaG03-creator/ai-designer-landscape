#!/usr/bin/env node

/**
 * Approve All Pending Tools
 * 
 * Moves all tools from pending_tools.ts to constants.ts
 * This is a local script for bulk approval (not using GitHub API)
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Reads pending tools
 */
function readPendingTools(filePath) {
    try {
        const fileContent = readFileSync(filePath, 'utf-8');
        const arrayMatch = fileContent.match(/export const PENDING_TOOLS: Partial<Category>\[\] = \[([\s\S]*?)\];/);

        if (!arrayMatch || !arrayMatch[1].trim()) {
            return [];
        }

        const categories = [];
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
                categories.push({
                    id: categoryId,
                    title: categoryTitle,
                    tools: tools
                });
            }
        }

        return categories;

    } catch (error) {
        console.error('⚠️  Error reading pending tools:', error.message);
        return [];
    }
}

/**
 * Adds tools to constants.ts
 */
function addToolsToConstants(constantsPath, pendingCategories) {
    try {
        let constantsContent = readFileSync(constantsPath, 'utf-8');

        pendingCategories.forEach(pendingCat => {
            const categoryId = pendingCat.id;

            // Find the category in constants.ts and add tools
            const categoryRegex = new RegExp(
                `(id:\\s*'${categoryId}',[\\s\\S]*?tools:\\s*\\[)([\\s\\S]*?)(\\s*\\])`,
                'g'
            );

            pendingCat.tools.forEach(tool => {
                const newToolEntry = `
      {
        name: '${tool.name.replace(/'/g, "\\'")}',
        url: '${tool.url}',
        description: '${tool.description.replace(/'/g, "\\'")}'
      },`;

                constantsContent = constantsContent.replace(
                    categoryRegex,
                    (match, before, toolsContent, after) => {
                        return `${before}${newToolEntry}${toolsContent}${after}`;
                    }
                );

                console.log(`✅ Approved: "${tool.name}" → ${pendingCat.title}`);
            });
        });

        writeFileSync(constantsPath, constantsContent);
        return true;

    } catch (error) {
        console.error('⚠️  Error updating constants.ts:', error.message);
        return false;
    }
}

/**
 * Clears pending_tools.ts
 */
function clearPendingTools(pendingPath) {
    const emptyContent = `import { Category } from '../types';

/**
 * PENDING TOOLS - Holding Pen for Unapproved Discoveries
 * 
 * Last updated: ${new Date().toISOString()}
 * Total tools pending: 0
 */

export const PENDING_TOOLS: Partial<Category>[] = [];
`;

    writeFileSync(pendingPath, emptyContent);
}

/**
 * Main execution
 */
async function approveAllTools() {
    console.log('🚀 Approving All Pending Tools...\n');

    const pendingPath = join(__dirname, '..', 'src', 'data', 'pending_tools.ts');
    const constantsPath = join(__dirname, '..', 'constants.ts');

    // Read pending tools
    const pendingCategories = readPendingTools(pendingPath);
    const totalTools = pendingCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

    if (totalTools === 0) {
        console.log('ℹ️  No pending tools to approve.\n');
        return;
    }

    console.log(`📊 Found ${totalTools} pending tools to approve\n`);

    // Add to constants.ts
    const success = addToolsToConstants(constantsPath, pendingCategories);

    if (!success) {
        console.error('\n❌ Failed to update constants.ts');
        return;
    }

    // Clear pending_tools.ts
    clearPendingTools(pendingPath);

    console.log('\n' + '='.repeat(60));
    console.log('📊 APPROVAL SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Approved: ${totalTools} tools`);
    console.log(`📁 Updated: src/data/constants.ts`);
    console.log(`🗑️  Cleared: src/data/pending_tools.ts\n`);

    console.log('✅ All pending tools approved successfully!');
    console.log('👉 The tools are now live in the landscape');
}

// Run the approval
approveAllTools();
