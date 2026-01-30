const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔑 Checking API Key...");

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                console.error("❌ API Error:", response.error.message);
            } else if (response.models) {
                console.log("✅ SUCCESS! Here are your available models:");
                // Filter for "generateContent" models only
                const contentModels = response.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
                contentModels.forEach(m => console.log(`   - ${m.name.replace('models/', '')}`));
            } else {
                console.log("⚠️ Unexpected response:", data);
            }
        } catch (e) {
            console.error("❌ Parse Error:", e.message);
        }
    });
}).on('error', (e) => {
    console.error("❌ Connection Error:", e.message);
});
