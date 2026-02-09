#!/usr/bin/env node

/**
 * Clear Pending Queue to 10 Tools
 * 
 * Intelligently selects the top 10 tools from the current pending queue
 * based on B2B relevance scoring.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// B2B-focused keywords for scoring
const B2B_KEYWORDS = {
    high: ['enterprise', 'business', 'team', 'collaboration', 'saas', 'b2b', 'professional', 'workspace', 'organization', 'company'],
    medium: ['design', 'ui', 'ux', 'workflow', 'prototype', 'figma', 'sketch'],
    low: ['ai', 'tool', 'app', 'platform', 'create', 'build', 'make']
};

// High-priority categories (more likely to be B2B-focused)
const HIGH_PRIORITY_CATEGORIES = [
    'UI Design & Prototyping',
    'Design Systems & Component Libraries',
    'Collaboration & Handoff',
    'Workflow & Productivity'
];

/**
 * Scores a tool based on B2B relevance
 */
function scoreToolB2BRelevance(tool, categoryTitle) {
    let score = 0;
    const searchText = `${tool.name || ''} ${tool.description || ''}`.toLowerCase();

    // High-value B2B keywords (+10 points each)
    B2B_KEYWORDS.high.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
            score += 10;
        }
    });

    // Medium-value keywords (+5 points each)
    B2B_KEYWORDS.medium.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
            score += 5;
        }
    });

    // Low-value keywords (+2 points each)
    B2B_KEYWORDS.low.forEach(keyword => {
        if (searchText.includes(keyword.toLowerCase())) {
            score += 2;
        }
    });

    // High-priority category bonus (+15 points)
    if (HIGH_PRIORITY_CATEGORIES.includes(categoryTitle)) {
        score += 15;
    }

    // Has description bonus (+5 points)
    if (tool.description && tool.description.length > 20) {
        score += 5;
    }

    // Name suggests enterprise tool (+10 points)
    const enterpriseNamePatterns = ['pro', 'enterprise', 'business', 'team', 'workspace', 'studio'];
    if (enterpriseNamePatterns.some(pattern => tool.name.toLowerCase().includes(pattern))) {
        score += 10;
    }

    return score;
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
 * Writes top 10 tools back to pending_tools.ts
 */
function writeTop10Tools(filePath, topTools) {
    // Group tools by category
    const categoriesMap = new Map();

    topTools.forEach(item => {
        if (!categoriesMap.has(item.categoryId)) {
            categoriesMap.set(item.categoryId, {
                id: item.categoryId,
                title: item.categoryTitle,
                tools: []
            });
        }
        categoriesMap.get(item.categoryId).tools.push(item.tool);
    });

    const categories = Array.from(categoriesMap.values());

    // Generate TypeScript code
    let tsCode = `import { Category } from '../types';\n\n`;
    tsCode += `/**\n`;
    tsCode += ` * PENDING TOOLS - Holding Pen for Unapproved Discoveries\n`;
    tsCode += ` * \n`;
    tsCode += ` * Cleared to top 10 on ${new Date().toISOString()}\n`;
    tsCode += ` * Total tools pending: ${topTools.length}\n`;
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
async function clearPendingTo10() {
    console.log('🔍 Clearing Pending Queue to Top 10 Tools...\n');

    const pendingFilePath = join(__dirname, '..', 'src', 'data', 'pending_tools.ts');

    // Read existing pending tools
    const existingCategories = readExistingPendingTools(pendingFilePath);
    const originalCount = existingCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

    console.log(`📊 Original pending tools: ${originalCount}\n`);

    // Score all tools
    const scoredTools = [];
    existingCategories.forEach(category => {
        category.tools.forEach(tool => {
            const score = scoreToolB2BRelevance(tool, category.title);
            scoredTools.push({
                tool,
                categoryId: category.id,
                categoryTitle: category.title,
                score
            });
        });
    });

    // Sort by score (descending)
    scoredTools.sort((a, b) => b.score - a.score);

    // Print all scores
    console.log('📊 Tool Scores (B2B Relevance):');
    console.log('='.repeat(80));
    scoredTools.forEach((item, index) => {
        const emoji = index < 10 ? '✅' : '❌';
        console.log(`${emoji} ${item.score.toString().padStart(3)} pts - "${item.tool.name}" (${item.categoryTitle})`);
    });
    console.log('='.repeat(80) + '\n');

    // Keep top 10
    const top10 = scoredTools.slice(0, 10);

    // Write top 10 back
    writeTop10Tools(pendingFilePath, top10);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 CLEARING SUMMARY');
    console.log('='.repeat(60));
    console.log(`📥 Original tools: ${originalCount}`);
    console.log(`✅ Kept (top 10): 10`);
    console.log(`❌ Removed: ${originalCount - 10}`);
    console.log(`💾 Updated: src/data/pending_tools.ts\n`);

    console.log('✅ Top 10 Tools Selected:');
    top10.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.tool.name} (${item.score} pts)`);
    });

    console.log('\n✅ Clearing completed successfully!');
}

// Run the clear
clearPendingTo10();
