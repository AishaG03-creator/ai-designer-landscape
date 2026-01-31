/**
 * Vercel Serverless Function: Approve Tool
 * 
 * This endpoint receives an approved tool and adds it to constants.ts via GitHub API.
 * It then removes the tool from pending_tools.ts.
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password, tool, categoryId } = req.body;

        // Verify admin password
        if (password !== process.env.VITE_ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate required fields
        if (!tool || !categoryId) {
            return res.status(400).json({ error: 'Missing required fields: tool, categoryId' });
        }

        // GitHub API configuration
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = 'AishaG03-creator';
        const GITHUB_REPO = 'ai-designer-landscape';
        const BRANCH = 'main';

        if (!GITHUB_TOKEN) {
            return res.status(500).json({ error: 'GitHub token not configured' });
        }

        // Step 1: Get current constants.ts file
        const constantsPath = 'constants.ts';
        const constantsResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${constantsPath}?ref=${BRANCH}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!constantsResponse.ok) {
            throw new Error(`Failed to fetch constants.ts: ${constantsResponse.statusText}`);
        }

        const constantsData = await constantsResponse.json();
        const constantsContent = Buffer.from(constantsData.content, 'base64').toString('utf-8');

        // Step 2: Add the tool to the appropriate category
        const categoryRegex = new RegExp(
            `(id:\\s*'${categoryId}',[\\s\\S]*?tools:\\s*\\[)([\\s\\S]*?)(\\s*\\])`,
            'g'
        );

        const newToolEntry = `
      {
        name: '${tool.name.replace(/'/g, "\\'")}',
        url: '${tool.url}',
        description: '${tool.description.replace(/'/g, "\\'")}'
      },`;

        const updatedConstants = constantsContent.replace(
            categoryRegex,
            (match, before, toolsContent, after) => {
                return `${before}${newToolEntry}${toolsContent}${after}`;
            }
        );

        // Step 3: Get current pending_tools.ts file
        const pendingPath = 'src/data/pending_tools.ts';
        const pendingResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${pendingPath}?ref=${BRANCH}`,
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!pendingResponse.ok) {
            throw new Error(`Failed to fetch pending_tools.ts: ${pendingResponse.statusText}`);
        }

        const pendingData = await pendingResponse.json();
        const pendingContent = Buffer.from(pendingData.content, 'base64').toString('utf-8');

        // Step 4: Remove the tool from pending_tools.ts
        const toolRegex = new RegExp(
            `\\s*{\\s*name:\\s*'${tool.name.replace(/[.*+?^${}()|[\]\\\\]/g, '\\$&')}',[\\s\\S]*?dateAdded:[\\s\\S]*?}\\s*,?`,
            'g'
        );

        let updatedPending = pendingContent.replace(toolRegex, '');

        // Clean up empty categories
        updatedPending = updatedPending.replace(
            /{\s*id:\s*'\d+',\s*title:\s*'[^']+',\s*tools:\s*\[\s*\]\s*},?\s*/g,
            ''
        );

        // Step 5: Commit both files to GitHub
        const commitMessage = `Approve tool: ${tool.name} → Category ${categoryId}`;

        // Update constants.ts
        const updateConstantsResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${constantsPath}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: Buffer.from(updatedConstants).toString('base64'),
                    sha: constantsData.sha,
                    branch: BRANCH,
                }),
            }
        );

        if (!updateConstantsResponse.ok) {
            const errorData = await updateConstantsResponse.json();
            throw new Error(`Failed to update constants.ts: ${JSON.stringify(errorData)}`);
        }

        // Update pending_tools.ts
        const updatePendingResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${pendingPath}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Remove approved tool: ${tool.name}`,
                    content: Buffer.from(updatedPending).toString('base64'),
                    sha: pendingData.sha,
                    branch: BRANCH,
                }),
            }
        );

        if (!updatePendingResponse.ok) {
            const errorData = await updatePendingResponse.json();
            throw new Error(`Failed to update pending_tools.ts: ${JSON.stringify(errorData)}`);
        }

        return res.status(200).json({
            success: true,
            message: `Tool "${tool.name}" approved and added to category ${categoryId}`,
            deployment: 'Vercel will auto-deploy in ~2 minutes',
        });

    } catch (error) {
        console.error('Approval error:', error);
        return res.status(500).json({
            error: 'Failed to approve tool',
            details: error.message,
        });
    }
}