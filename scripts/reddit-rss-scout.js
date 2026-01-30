#!/usr/bin/env node

/**
 * Reddit RSS Scout - Tool Discovery via RSS Feeds
 * 
 * Fetches the 5 most recent posts from Reddit subreddits using RSS feeds.
 * This avoids bot detection and rate limiting issues.
 * 
 * Subreddits monitored:
 * - r/SideProject
 * - r/ArtificialInteligence
 */

import https from 'https';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Reddit RSS feed URLs (sorted by new)
const SUBREDDIT_FEEDS = {
    sideProject: 'https://www.reddit.com/r/SideProject/new/.rss',
    artificialIntelligence: 'https://www.reddit.com/r/ArtificialInteligence/new/.rss'
};

/**
 * Fetches content from a URL using HTTPS
 */
function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ToolScout/1.0)'
            }
        }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Parses RSS XML to extract post data
 * Simple XML parsing without external dependencies
 */
function parseRssFeed(xmlContent, limit = 5) {
    const posts = [];

    // Extract entries (Reddit RSS uses Atom format)
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [...xmlContent.matchAll(entryRegex)];

    for (let i = 0; i < Math.min(entries.length, limit); i++) {
        const entry = entries[i][1];

        // Extract title
        const titleMatch = entry.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : 'No title';

        // Extract link
        const linkMatch = entry.match(/<link href="(.*?)"/);
        const link = linkMatch ? linkMatch[1] : null;

        // Extract published date
        const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
        const published = publishedMatch ? publishedMatch[1] : null;

        // Extract author
        const authorMatch = entry.match(/<name>(.*?)<\/name>/);
        const author = authorMatch ? authorMatch[1] : 'Unknown';

        if (title && link) {
            posts.push({
                title: title.trim(),
                link: link.trim(),
                published,
                author
            });
        }
    }

    return posts;
}

/**
 * Fetches and parses a subreddit RSS feed
 */
async function fetchSubredditPosts(feedUrl, subredditName, limit = 5) {
    console.log(`\n🔍 Fetching r/${subredditName}...`);

    try {
        const xmlContent = await fetchUrl(feedUrl);
        const posts = parseRssFeed(xmlContent, limit);

        console.log(`✅ Found ${posts.length} posts from r/${subredditName}`);
        return posts.map(post => ({
            ...post,
            subreddit: subredditName
        }));

    } catch (error) {
        console.error(`❌ Error fetching r/${subredditName}:`, error.message);
        return [];
    }
}

/**
 * Main execution function
 */
async function runRedditScout() {
    console.log('🚀 Reddit RSS Scout Starting...');
    console.log(`⏰ Current time: ${new Date().toISOString()}\n`);

    try {
        // Fetch from both subreddits
        const allPosts = [];

        const sideProjectPosts = await fetchSubredditPosts(
            SUBREDDIT_FEEDS.sideProject,
            'SideProject',
            5
        );
        allPosts.push(...sideProjectPosts);

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        const aiPosts = await fetchSubredditPosts(
            SUBREDDIT_FEEDS.artificialIntelligence,
            'ArtificialInteligence',
            5
        );
        allPosts.push(...aiPosts);

        // Generate report
        const report = {
            scrapedAt: new Date().toISOString(),
            source: 'Reddit RSS Feeds',
            totalFound: allPosts.length,
            posts: allPosts
        };

        // Save to JSON file
        const outputPath = join(__dirname, '..', 'reddit-scout-results.json');
        writeFileSync(outputPath, JSON.stringify(report, null, 2));

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 REDDIT RSS SCOUT SUMMARY');
        console.log('='.repeat(60));
        console.log(`✅ Total posts found: ${report.totalFound}`);
        console.log(`📁 Results saved to: reddit-scout-results.json\n`);

        if (report.totalFound > 0) {
            console.log('🎯 Posts found:\n');
            report.posts.forEach((post, index) => {
                console.log(`${index + 1}. ${post.title}`);
                console.log(`   🔗 ${post.link}`);
                console.log(`   📍 r/${post.subreddit}`);
                console.log(`   👤 by ${post.author}`);
                console.log(`   📅 ${post.published ? new Date(post.published).toLocaleString() : 'Unknown date'}`);
                console.log('');
            });
        } else {
            console.log('ℹ️  No posts found.');
        }

        console.log('✅ Reddit RSS Scout completed successfully!');
        return report;

    } catch (error) {
        console.error('❌ Reddit RSS Scout failed:', error);
        process.exit(1);
    }
}

// Run the scout
runRedditScout();
