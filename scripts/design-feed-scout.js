#!/usr/bin/env node

/**
 * Design-Focused RSS Scout
 * 
 * Automatically discovers B2B design tools from curated design blogs and publications.
 * No API keys required - uses publicly available RSS feeds.
 * 
 * Sources:
 * - Smashing Magazine (Tools category)
 * - CSS-Tricks
 * - A List Apart
 * - Designer News
 */

import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command-line arguments
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');
const MAX_PENDING_TOOLS = 10;

// Design-focused RSS feeds (publicly available, no API keys needed)
const DESIGN_FEEDS = {
    cssTricks: {
        url: 'https://css-tricks.com/feed/',
        name: 'CSS-Tricks'
    },
    alistapart: {
        url: 'https://alistapart.com/main/feed/',
        name: 'A List Apart'
    },
    sidebar: {
        url: 'https://sidebar.io/feed',
        name: 'Sidebar.io'
    },
    codrops: {
        url: 'https://tympanus.net/codrops/feed/',
        name: 'Codrops'
    },
    webdesignernews: {
        url: 'https://www.webdesignernews.com/feed',
        name: 'Web Designer News'
    }
};

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

// Tool-related keywords to identify tool announcements
const TOOL_KEYWORDS = [
    'tool', 'app', 'platform', 'software', 'service',
    'launch', 'release', 'new', 'introducing', 'announce',
    'plugin', 'extension', 'library', 'framework'
];

const parser = new Parser({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DesignToolScout/1.0)'
    }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Fetches items from an RSS feed
 */
async function fetchFeed(feedUrl, feedName) {
    try {
        console.log(`🔍 Fetching ${feedName}...`);
        const feed = await parser.parseURL(feedUrl);

        // Get items from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentItems = feed.items.filter(item => {
            const pubDate = new Date(item.pubDate || item.isoDate);
            return pubDate >= thirtyDaysAgo;
        });

        console.log(`✅ Found ${recentItems.length} recent items from ${feedName}`);

        return recentItems.map(item => ({
            title: item.title,
            link: item.link,
            description: item.contentSnippet || item.content || '',
            pubDate: item.pubDate || item.isoDate,
            source: feedName
        }));

    } catch (error) {
        console.error(`⚠️  Error fetching ${feedName}:`, error.message);
        return [];
    }
}

/**
 * Checks if an article is about a design tool
 */
function isToolAnnouncement(item) {
    const searchText = `${item.title} ${item.description}`.toLowerCase();

    // Must contain at least one tool keyword
    const hasToolKeyword = TOOL_KEYWORDS.some(keyword =>
        searchText.includes(keyword.toLowerCase())
    );

    // Must contain at least one B2B/design keyword
    const hasDesignKeyword = B2B_KEYWORDS.some(keyword =>
        searchText.includes(keyword.toLowerCase())
    );

    return hasToolKeyword && hasDesignKeyword;
}

/**
 * Uses Gemini AI to extract tool information from article
 */
async function extractToolWithAI(item) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `You are analyzing a design blog article to extract information about a design tool.

Article Title: ${item.title}
Article URL: ${item.link}
Article Content: ${item.description.substring(0, 1000)}

TASK:
1. Identify if this article is announcing or reviewing a specific design tool
2. If yes, extract the following:
   - Tool name
   - Tool website URL (if mentioned)
   - Brief description (1-2 sentences, rewritten for designers)
   - Is this a B2B/professional tool or consumer/hobbyist tool?
   - Suggested category (pick ONE):
     * Research, Discovery & Strategy
     * Ideation & Concept Design
     * UI Design & Prototyping
     * Content, Microcopy & UX Writing
     * Design Systems & Component Libraries
     * Collaboration & Handoff
     * Workflow Automation & Operations
     * Multimodal AI (Beyond Text)

IMPORTANT:
- Only extract if this is clearly about a SPECIFIC TOOL (not a general article or tutorial)
- Skip if it's about multiple tools or a roundup
- Skip if it's consumer-focused (personal use, hobbyist)
- Tool URL must be the actual tool website, not the blog article URL

Respond in JSON format:
{
  "isTool": true/false,
  "toolName": "...",
  "toolUrl": "...",
  "description": "...",
  "isB2B": true/false,
  "category": "..."
}

If not a tool announcement, respond: {"isTool": false}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return null;
        }

        const toolData = JSON.parse(jsonMatch[0]);

        if (!toolData.isTool || !toolData.isB2B) {
            return null;
        }

        return {
            name: toolData.toolName,
            url: toolData.toolUrl || item.link,
            description: toolData.description,
            category: toolData.category,
            source: item.source,
            dateAdded: new Date().toISOString()
        };

    } catch (error) {
        console.error(`⚠️  Error extracting tool with AI:`, error.message);
        return null;
    }
}

/**
 * Reads existing pending tools from the file
 */
function readExistingPendingTools(filePath) {
    try {
        const fileContent = readFileSync(filePath, 'utf-8');
        const arrayMatch = fileContent.match(/export const PENDING_TOOLS: Partial<Category>\[\] = \[([\s\S]*?)\];/);

        if (!arrayMatch || !arrayMatch[1].trim()) {
            return [];
        }

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
 * Updates pending_tools.ts with new tools
 */
function updatePendingTools(filePath, newTools, existingCategories) {
    // Count total existing pending tools
    const existingToolCount = existingCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

    // Check if pending queue is full (10-tool limit)
    if (existingToolCount >= MAX_PENDING_TOOLS && !FORCE_MODE) {
        console.log('\n⚠️  PENDING QUEUE FULL ⚠️');
        console.log(`📊 Current pending tools: ${existingToolCount}/${MAX_PENDING_TOOLS}`);
        console.log('🚫 Skipping new tool additions.');
        console.log('👉 Approve or reject pending tools in the Admin Review panel to make room.');
        console.log('💡 Use --force flag to override this limit if needed.\n');
        return existingCategories;
    }

    // Calculate how many tools we can add
    const availableSlots = MAX_PENDING_TOOLS - existingToolCount;
    let toolsToAdd = newTools;

    if (availableSlots < newTools.length && !FORCE_MODE) {
        console.log(`\n📊 Pending queue: ${existingToolCount}/${MAX_PENDING_TOOLS} tools`);
        console.log(`⚠️  Only ${availableSlots} slot(s) available. Will add first ${availableSlots} tool(s).\n`);
        toolsToAdd = newTools.slice(0, availableSlots);
    }

    // Map category names to IDs
    const categoryMap = {
        'Research, Discovery & Strategy': '1',
        'Ideation & Concept Design': '2',
        'UI Design & Prototyping': '3',
        'Content, Microcopy & UX Writing': '4',
        'Design Systems & Component Libraries': '5',
        'Collaboration & Handoff': '6',
        'Workflow Automation & Operations': '7',
        'Multimodal AI (Beyond Text)': '8'
    };

    // Group new tools by category
    const categoriesMap = new Map();

    // Add existing categories
    existingCategories.forEach(cat => {
        categoriesMap.set(cat.id, cat);
    });

    // Add new tools
    toolsToAdd.forEach(tool => {
        const categoryId = categoryMap[tool.category] || '8';
        const categoryTitle = tool.category;

        if (!categoriesMap.has(categoryId)) {
            categoriesMap.set(categoryId, {
                id: categoryId,
                title: categoryTitle,
                tools: []
            });
        }

        // Check for duplicates
        const category = categoriesMap.get(categoryId);
        const isDuplicate = category.tools.some(t => t.url === tool.url);

        if (!isDuplicate) {
            category.tools.push({
                name: tool.name,
                url: tool.url,
                description: tool.description,
                dateAdded: tool.dateAdded
            });
            console.log(`✅ Added: "${tool.name}" to ${categoryTitle}`);
        } else {
            console.log(`⚠️  Skipped duplicate: "${tool.name}"`);
        }
    });

    const categories = Array.from(categoriesMap.values());

    // Generate TypeScript code
    let tsCode = `import { Category } from '../types';\n\n`;
    tsCode += `/**\n`;
    tsCode += ` * PENDING TOOLS - Holding Pen for Unapproved Discoveries\n`;
    tsCode += ` * \n`;
    tsCode += ` * Last updated: ${new Date().toISOString()}\n`;
    tsCode += ` * Total tools pending: ${categories.reduce((sum, cat) => sum + cat.tools.length, 0)}\n`;
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

    return categories;
}

/**
 * Main execution function
 */
async function runDesignFeedScout() {
    console.log('🚀 Design-Focused RSS Scout Starting...\n');
    console.log('📡 Sources: CSS-Tricks, A List Apart, Sidebar.io, Codrops, Web Designer News');
    console.log('⏰ Current time:', new Date().toISOString());
    console.log('\n');

    // Fetch from all design feeds
    const allItems = [];

    for (const [key, feed] of Object.entries(DESIGN_FEEDS)) {
        const items = await fetchFeed(feed.url, feed.name);
        allItems.push(...items);
    }

    console.log(`\n📊 Total articles fetched: ${allItems.length}`);

    // Filter for tool announcements
    const toolArticles = allItems.filter(isToolAnnouncement);
    console.log(`🔧 Tool-related articles: ${toolArticles.length}\n`);

    if (toolArticles.length === 0) {
        console.log('⚠️  No tool announcements found in recent articles.');
        console.log('This is normal - design blogs don\'t announce new tools every day.');
        return;
    }

    // Extract tools using AI
    console.log('🤖 Using Gemini AI to extract tool information...\n');

    const extractedTools = [];
    for (const article of toolArticles.slice(0, 10)) { // Limit to 10 articles to save API calls
        console.log(`📝 Analyzing: "${article.title}"`);
        const tool = await extractToolWithAI(article);
        if (tool) {
            extractedTools.push(tool);
            console.log(`   ✅ Extracted: ${tool.name}`);
        } else {
            console.log(`   ❌ Not a B2B tool or couldn't extract`);
        }
    }

    console.log(`\n🎯 Extracted ${extractedTools.length} B2B design tools\n`);

    if (extractedTools.length === 0) {
        console.log('⚠️  No B2B tools extracted from articles.');
        return;
    }

    // Update pending_tools.ts
    const pendingFilePath = join(__dirname, '..', 'src', 'data', 'pending_tools.ts');
    const existingCategories = readExistingPendingTools(pendingFilePath);

    console.log(`📚 Found ${existingCategories.reduce((sum, cat) => sum + cat.tools.length, 0)} existing pending tools\n`);

    const updatedCategories = updatePendingTools(pendingFilePath, extractedTools, existingCategories);

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DESIGN FEED SCOUT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total articles fetched: ${allItems.length}`);
    console.log(`🔧 Tool-related articles: ${toolArticles.length}`);
    console.log(`🎯 B2B tools extracted: ${extractedTools.length}`);
    console.log(`📁 Saved to: src/data/pending_tools.ts\n`);

    console.log('✅ Design Feed Scout completed successfully!');
    console.log('👉 Review pending_tools.ts and approve tools to move to constants.ts');
}

// Run the scout
runDesignFeedScout();
