# GitHub Secret Setup Guide

## Step-by-Step Instructions

### Step 1: Copy Your API Key

Your Gemini API key from `.env` file:
```
AIzaSyDq03MJaNSMKQa9BQaPd8UY2xgdXKBGEeE
```

**📋 Copy this key** - You'll need it in Step 4

---

### Step 2: Navigate to GitHub Repository Settings

1. Go to: **https://github.com/AishaG03-creator/ai-designer-landscape**
2. Click the **Settings** tab (top right, next to Insights)

![GitHub Settings Tab](https://docs.github.com/assets/cb-28266/images/help/repository/repo-actions-settings.png)

---

### Step 3: Open Secrets and Variables

1. In the left sidebar, scroll down to **Security** section
2. Click **Secrets and variables**
3. Click **Actions**

![Secrets Menu](https://docs.github.com/assets/cb-158788/images/help/settings/actions-secrets-menu.png)

---

### Step 4: Add New Repository Secret

1. Click the **New repository secret** button (green button, top right)

2. Fill in the form:
   - **Name:** `GEMINI_API_KEY` (must be exactly this)
   - **Secret:** `AIzaSyDq03MJaNSMKQa9BQaPd8UY2xgdXKBGEeE` (paste your API key)

3. Click **Add secret**

![Add Secret Form](https://docs.github.com/assets/cb-49844/images/help/settings/actions-secrets-add.png)

---

### Step 5: Verify Secret Was Added

You should see:
```
GEMINI_API_KEY
Updated now by you
```

✅ **Done!** The secret is now configured.

---

## Test the Workflow

### Option 1: Wait for Monday
The workflow will run automatically every Monday at 9 AM UTC.

### Option 2: Manual Trigger (Test Now)

1. Go to **Actions** tab in your repository
2. Click **Weekly Design Tool Scout** in the left sidebar
3. Click **Run workflow** button (right side)
4. Select branch: `main`
5. Click **Run workflow**

![Run Workflow](https://docs.github.com/assets/cb-36488/images/help/actions/workflow-dispatch-button.png)

---

## What Happens Next

When the workflow runs:
1. ✅ GitHub Actions fetches RSS feeds
2. ✅ Uses your `GEMINI_API_KEY` secret
3. ✅ Extracts B2B tools with AI
4. ✅ Commits new tools to `pending_tools.ts`
5. ✅ Creates a summary in the Actions tab

---

## Troubleshooting

### "Secret not found" error
- Make sure the secret name is exactly `GEMINI_API_KEY` (case-sensitive)
- Try deleting and re-adding the secret

### Workflow doesn't run
- Check that the workflow file exists: `.github/workflows/weekly-tool-scout.yml`
- Verify GitHub Actions is enabled in Settings → Actions → General

### No tools discovered
- This is normal - design blogs don't announce tools every week
- Check the workflow summary for details

---

## Security Notes

✅ **Safe to add** - GitHub encrypts secrets  
✅ **Hidden in logs** - Secret values are automatically masked  
✅ **Only you can see** - Secrets are private to your repository  
❌ **Never commit** - `.env` file is already in `.gitignore`

---

## Next Steps

After adding the secret:
1. ✅ Test the workflow manually (Option 2 above)
2. ✅ Check the Actions tab for results
3. ✅ Review new tools in Admin panel
4. ✅ Approve tools to move them live

**That's it!** Your automated B2B tool discovery is now fully set up and will run every Monday.
