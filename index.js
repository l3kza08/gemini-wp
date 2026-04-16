const express = require('express');
const axios = require('axios'); // ต้องเพิ่ม axios ใน package.json ด้วย
const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: req.body.prompt + " (ตอบสั้น 1 ประโยค)" }]
        }, {
            headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });
        res.json({ text: response.data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// เพิ่มฟังก์ชันใน Endpoint /scan-food
app.post('/scan-food', async (req, res) => {
    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openai/gpt-4o-mini",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: req.body.prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${req.body.image}` } }
                ]
            }]
        }, {
            headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` }
        });
        res.json({ text: response.data.choices[0].message.content });
    } catch (err) { res.status(500).json({ error: "Failed" }); }
});

app.listen(process.env.PORT || 10000, '0.0.0.0');
