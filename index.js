const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send("Server is Online on Render!"));

app.post('/ask', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(req.body.prompt + " (ตอบสั้นๆ 1 ประโยค)");
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Render จะกำหนด Port ให้เราเองผ่าน Environment Variable
const PORT = process.env.PORT || 10000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});