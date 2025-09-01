"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const undici_1 = require("undici");
const router = (0, express_1.Router)();
router.get('/trends', async (_req, res) => {
    // placeholder: return static trends for now
    return res.json({
        keywords: [
            { term: 'high waves', count: 128, sentiment: -0.1 },
            { term: 'flood', count: 86, sentiment: -0.2 },
            { term: 'debris', count: 42, sentiment: -0.05 }
        ]
    });
});
router.post('/nlp/classify', async (req, res) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey)
        return res.status(500).json({ error: 'OPENROUTER_API_KEY missing' });
    const { text } = req.body;
    const r = await (0, undici_1.fetch)('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b:free',
            messages: [
                { role: 'system', content: 'Classify coastal hazard type (tsunami, high_waves, flood, unusual_tide, debris, distress, other) and sentiment (-1 to 1).' },
                { role: 'user', content: text }
            ]
        })
    });
    const data = await r.json();
    return res.json(data);
});
exports.default = router;
