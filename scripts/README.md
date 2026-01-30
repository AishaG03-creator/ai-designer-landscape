# 🔍 Tool Scout

Automated Product Hunt scraper for discovering new AI design tools.

## What It Does

Tool Scout monitors Product Hunt's **Design Tools** and **Artificial Intelligence** topics to find products released in the last 24 hours.

For each product, it extracts:
- ✅ Product Name
- ✅ Product URL
- ✅ One-line tagline
- ✅ Topic category
- ✅ Date posted

## Installation

1. Navigate to the scripts directory:
   ```bash
   cd scripts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the scout:
```bash
npm run scout
```

Or directly:
```bash
node tool-scout.js
```

## Output

Results are saved to `tool-scout-results.json` in the project root:

```json
{
  "scrapedAt": "2026-01-29T20:00:00.000Z",
  "timeWindow": "24 hours",
  "totalFound": 5,
  "products": [
    {
      "name": "Example AI Tool",
      "url": "https://www.producthunt.com/posts/example-ai-tool",
      "tagline": "AI-powered design assistant",
      "topic": "Design Tools",
      "datePosted": "2026-01-29T12:00:00.000Z"
    }
  ]
}
```

## Scheduling (Optional)

To run Tool Scout automatically every day:

### macOS/Linux (cron)
```bash
# Run daily at 9 AM
0 9 * * * cd /path/to/ai-designer-landscape/scripts && npm run scout
```

### Windows (Task Scheduler)
Create a scheduled task to run `npm run scout` daily.

## Notes

- The script uses Puppeteer (headless Chrome) to scrape Product Hunt
- Results include products from both monitored topics
- Duplicates are automatically removed
- Products without dates are included (manual review recommended)
