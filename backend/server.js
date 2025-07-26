const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

require('dotenv').config();
const app = express();
const PORT = 3001;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

// Use memory storage for multer (no file saved to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload endpoint: parses PDF and sends notes to Mistral
app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const pdfData = await pdfParse(pdfBuffer);
        const notes = pdfData.text;


        const mistralRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ process.env.OPENROUTER_API_KEY,
                'HTTP-Referer': 'http://localhost:5173/'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    {
                        role: 'user',
                        content: `Turn the following study notes into important questions:\n\n${notes}\n\nReturn only questions as an unordered list.`,
                    },
                ],
            }),
        });
        const result = await mistralRes.json();
        const content = result.choices?.[0]?.message?.content || '';
        const questions = content
            .split('\n')
            .map(q => q.trim().replace(/^(\d+[\.\)\-\:])\s*/, ''))
            .filter(q => q.length > 0);

        res.json({ questions });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process PDF or generate questions' });
    }
});

app.listen(PORT, () => {
    console.log(`Nyaa server running at Port: ${PORT}`);
});
