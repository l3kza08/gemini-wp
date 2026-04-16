const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send("Server is Online on Render!"));

app.post('/ask', async (req, res) => {
    try {
        // แก้ไขเป็น models/gemini-1.5-flash เพื่อให้ระบบหาเจอ
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        
        const result = await model.generateContent(req.body.prompt + " (ตอบเป็นภาษาไทยสั้นๆ 1 ประโยค)");
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (err) {
        console.error("AI Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server ready on port ${PORT}`));
