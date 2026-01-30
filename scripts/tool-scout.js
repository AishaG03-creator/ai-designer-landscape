#!/usr/bin/env node

/**
 * Tool Scout - Product Hunt Scraper
 * 
 * Monitors Product Hunt for new AI design tools released in the last 24 hours.
 * Extracts: Product Name, URL, One-line tagline
 * 
 * Topics monitored:
 * - Design Tools
 * - Artificial Intelligence
 */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Product Hunt topic URLs
const TOPICS = {
  designTools: 'https://www.producthunt.com/topics/design-tools',
  artificialIntelligence: 'https://www.producthunt.com/topics/artificial-intelligence'
};

// Time threshold: 24 hours ago
const TWENTY_FOUR_HOURS_AGO = Date.now() - (24 * 60 * 60 * 1000);

/**
 * Scrapes a Product Hunt topic page for recent products
 */
async function scrapeProductHuntTopic(page, topicUrl, topicName) {
  console.log(`\n🔍 Scraping ${topicName}...`);
  
  try {
    await page.goto(topicUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for products to load
    await page.waitForSelector('[data-test="post-item"]', { timeout: 10000 });

    // Extract product data
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('[data-test="post-item"]');
      const results = [];

      productElements.forEach(element => {
        try {
          // Extract product name
          const nameElement = element.querySelector('a[href^="/posts/"]');
          const name = nameElement ? nameElement.textContent.trim() : null;

          // Extract URL
          const urlPath = nameElement ? nameElement.getAttribute('href') : null;
          const url = urlPath ? `https://www.producthunt.com${urlPath}` : null;

          // Extract tagline
          const taglineElement = element.querySelector('[class*="tagline"]') || 
                                 element.querySelector('p') ||
                                 element.querySelector('[class*="description"]');
          const tagline = taglineElement ? taglineElement.textContent.trim() : null;

          // Extract date (if available)
          const dateElement = element.querySelector('time');
          const dateStr = dateElement ? dateElement.getAttribute('datetime') : null;

          if (name && url) {
            results.push({
              name,
              url,
              tagline: tagline || 'No tagline available',
              datePosted: dateStr,
              topic: topicName
            });
          }
        } catch (err) {
          console.error('Error parsing product element:', err.message);
        }
      });

      return results;
    });

    console.log(`✅ Found ${products.length} products in ${topicName}`);
    return products;

  } catch (error) {
    console.error(`❌ Error scraping ${topicName}:`, error.message);
    return [];
  }
}

/**
 * Filters products to only those from the last 24 hours
 */
function filterRecentProducts(products) {
  return products.filter(product => {
    if (!product.datePosted) {
      // If no date available, include it (manual review needed)
      return true;
    }

    const productDate = new Date(product.datePosted).getTime();
    return productDate >= TWENTY_FOUR_HOURS_AGO;
  });
}

/**
 * Removes duplicate products (same name or URL)
 */
function deduplicateProducts(products) {
  const seen = new Set();
  return products.filter(product => {
    const key = `${product.name}|${product.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Main execution function
 */
async function runToolScout() {
  console.log('🚀 Tool Scout Starting...');
  console.log(`📅 Looking for products from the last 24 hours`);
  console.log(`⏰ Current time: ${new Date().toISOString()}\n`);

  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Scrape both topics
    const allProducts = [];
    
    for (const [key, url] of Object.entries(TOPICS)) {
      const topicName = key === 'designTools' ? 'Design Tools' : 'Artificial Intelligence';
      const products = await scrapeProductHuntTopic(page, url, topicName);
      allProducts.push(...products);
      
      // Wait between requests to be polite
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Filter and deduplicate
    const recentProducts = filterRecentProducts(allProducts);
    const uniqueProducts = deduplicateProducts(recentProducts);

    // Generate report
    const report = {
      scrapedAt: new Date().toISOString(),
      timeWindow: '24 hours',
      totalFound: uniqueProducts.length,
      products: uniqueProducts.map(p => ({
        name: p.name,
        url: p.url,
        tagline: p.tagline,
        topic: p.topic,
        datePosted: p.datePosted
      }))
    };

    // Save to JSON file
    const outputPath = join(__dirname, '..', 'tool-scout-results.json');
    writeFileSync(outputPath, JSON.stringify(report, null, 2));

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TOOL SCOUT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Total products found: ${report.totalFound}`);
    console.log(`📁 Results saved to: tool-scout-results.json\n`);

    if (report.totalFound > 0) {
      console.log('🎯 Products found:\n');
      report.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   📝 ${product.tagline}`);
        console.log(`   🔗 ${product.url}`);
        console.log(`   🏷️  Topic: ${product.topic}`);
        console.log('');
      });
    } else {
      console.log('ℹ️  No new products found in the last 24 hours.');
    }

    console.log('✅ Tool Scout completed successfully!');

  } catch (error) {
    console.error('❌ Tool Scout failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the scout
runToolScout();
