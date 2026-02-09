# GitHub Actions Setup

## Weekly Tool Scout Automation

This repository includes a GitHub Actions workflow that automatically discovers new design tools every Monday at 9 AM UTC.

### Setup Instructions

#### 1. Add Gemini API Key as GitHub Secret

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Value: Your Gemini API key from `.env` file
6. Click **Add secret**

#### 2. Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. If prompted, click **I understand my workflows, go ahead and enable them**

#### 3. Verify Workflow

The workflow will run automatically every Monday at 9 AM UTC. You can also:

- **Manual trigger:** Go to Actions → Weekly Design Tool Scout → Run workflow
- **View results:** Check the workflow run summary for discovered tools
- **Review tools:** New tools will be added to `src/data/pending_tools.ts`

### Workflow Details

- **Schedule:** Every Monday at 9 AM UTC (1 AM PST / 4 AM EST)
- **Sources:** CSS-Tricks, A List Apart, Sidebar.io, Codrops, Web Designer News
- **Auto-commit:** If new tools are found, they're automatically committed to the repo
- **Limit:** Respects the 10-tool pending queue limit

### Monitoring

Check the Actions tab to see:
- ✅ Tools discovered and added
- ℹ️ No new tools found
- ⚠️ Queue full (approve tools to make room)

### Troubleshooting

**Workflow fails with "GEMINI_API_KEY not found"**
- Make sure you added the secret correctly (step 1 above)
- Secret name must be exactly `GEMINI_API_KEY`

**No tools are being discovered**
- This is normal - design blogs don't announce new tools every week
- The workflow will keep running and will add tools when it finds them

**Queue is always full**
- Approve or reject pending tools in the Admin Review panel
- This makes room for new discoveries
