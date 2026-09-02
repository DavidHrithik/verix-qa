require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3005;

// Configure Azure OpenAI client
const API_KEY = process.env.VITE_OPENAI_API_KEY || '';
const BASE_URL = process.env.VITE_OPENAI_BASE_URL || 'https://aif-hackathon-nonprod-eastus-001.services.ai.azure.com/openai/v1';
const MODEL = process.env.VITE_OPENAI_MODEL || 'gpt-5.6-sol';

// Initialize with a dummy key if empty so it doesn't crash the server on boot
const openai = new OpenAI({
  apiKey: API_KEY || 'dummy_key_to_prevent_crash_on_boot',
  baseURL: BASE_URL,
});

app.post('/api/agent/execute', async (req, res) => {
  const { prompt, headless = false } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured in .env.local' });
  }

  try {
    // 1. Generate Playwright script using AI
    console.log('[Agent] Generating script for prompt:', prompt);
    const systemPrompt = `You are an expert Playwright automation agent.
Generate a complete, valid Node.js script using Playwright that fulfills the user's request.
The script MUST:
1. Require 'playwright' and launch a chromium browser. Set headless: ${headless}.
2. Take a screenshot at the very end and save it to exactly this path: "temp/screenshot.png"
3. Output console logs for important steps (e.g. "Navigating to URL", "Clicking button").
4. Call browser.close() at the end.
5. Wrap the code in an async IIFE or a main() function and call it, catching any errors and exiting with process.exit(1).

Do not output ANY markdown fences or explanatory text. OUTPUT ONLY VALID JAVASCRIPT CODE.`;

    const aiResponse = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    });

    let scriptCode = aiResponse.choices[0]?.message?.content || '';
    scriptCode = scriptCode.replace(/^```javascript\s*/i, '').replace(/^```js\s*/i, '').replace(/```\s*$/i, '').trim();

    // 2. Write script to temp file
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Clear old screenshot if exists
    const screenshotPath = path.join(tempDir, 'screenshot.png');
    if (fs.existsSync(screenshotPath)) {
      fs.unlinkSync(screenshotPath);
    }

    const scriptPath = path.join(tempDir, 'run.js');
    fs.writeFileSync(scriptPath, scriptCode);

    // 3. Execute the script
    console.log('[Agent] Executing script...');
    exec(`node ${scriptPath}`, { cwd: __dirname }, (error, stdout, stderr) => {
      console.log('[Agent] Execution complete.');
      
      let screenshotBase64 = null;
      if (fs.existsSync(screenshotPath)) {
        screenshotBase64 = fs.readFileSync(screenshotPath, 'base64');
      }

      res.json({
        success: !error,
        code: scriptCode,
        stdout,
        stderr,
        screenshot: screenshotBase64 ? `data:image/png;base64,${screenshotBase64}` : null
      });
    });

  } catch (error) {
    console.error('[Agent] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Agent Backend running on http://localhost:${PORT}`);
});
