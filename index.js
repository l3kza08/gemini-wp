const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

// ตรวจสอบการโหลด API Key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: คีย์ GEMINI_API_KEY หายไปจาก Environment Variables!");
}

const genAI = new GoogleGenerativeAI(apiKey);

app.get('/', (req, res) => res.send("Server is Online!"));

app.post('/ask', async (req, res) => {
    try {
        console.log("📩 รับข้อมูลจากแอป:", req.body);
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
        
        const result = await model.generateContent(req.body.prompt + " (ตอบเป็นภาษาไทยสั้นๆ 1 ประโยค)");
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ AI ตอบกลับ:", text);
        res.json({ text: text });
    } catch (err) {
        console.error("❌ AI ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server ready on port ${PORT}`));
