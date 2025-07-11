// server.js
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');

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

        // Call Mistral via Ollama
        const mistralRes = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'mistral',
                prompt: `Turn the following study notes into important questions:\n\n${notes}\n\nReturn only questions as a list WITHOUT NUMBERS.`,
                stream: false,
            }),
        });

        const result = await mistralRes.json();
        const questions = result.response
            .split('\n')
            .map(q => q.trim())
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
