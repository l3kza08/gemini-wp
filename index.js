const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// เพิ่มหน้าแรกเพื่อให้เช็คได้ว่า Server ออนไลน์จริงไหม
app.get('/', (req, res) => {
    res.send("Server is Online on Render! Ready for /ask");
});

app.post('/ask', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(req.body.prompt + " (ตอบสั้น 1 ประโยค)");
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Running on port ${PORT}`));
