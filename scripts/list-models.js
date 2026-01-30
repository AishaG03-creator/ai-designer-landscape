#!/usr/bin/env node

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * List Models Script
 * 
 * Queries the Gemini API to list all available models for your API key
 */

async function listModels() {
    console.log('🔍 Fetching available Gemini models...\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('❌ Error: GEMINI_API_KEY not found in .env file');
        console.error('Please add your API key to the .env file');
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // List all available models
        const models = await genAI.listModels();

        console.log(`✅ Found ${models.length} available models:\n`);
        console.log('='.repeat(60));

        models.forEach((model, index) => {
            console.log(`\n${index + 1}. ${model.name}`);
            console.log(`   Display Name: ${model.displayName || 'N/A'}`);
            console.log(`   Description: ${model.description || 'N/A'}`);

            if (model.supportedGenerationMethods) {
                console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
            }
        });

        console.log('\n' + '='.repeat(60));
        console.log('\n💡 To use a model, copy its name (e.g., "models/gemini-pro")');
        console.log('   and update the model in professional-tool-scout.js\n');

    } catch (error) {
        console.error('❌ Error fetching models:');
        console.error(`   ${error.message}`);

        if (error.message.includes('API key')) {
            console.error('\n💡 Tip: Check that your API key is valid');
            console.error('   Get a new key at: https://aistudio.google.com/apikey');
        }

        process.exit(1);
    }
}

// Run the script
listModels();
