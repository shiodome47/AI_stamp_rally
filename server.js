import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large base64 images

// API Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { image } = req.body;
        const apiKey = process.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: API Key missing' });
        }

        if (!image) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "この画像は、猫、または富士山ですか？もしそうなら、その対象物だけを単語で一つ答えてください（例: 'cat', 'fuji'）。それ以外の場合は'unknown'と答えてください。回答は英語の小文字でお願いします。";

        const imagePart = {
            inlineData: {
                data: image,
                mimeType: "image/jpeg", // Assuming JPEG for simplicity, or pass mimeType from frontend
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text().trim().toLowerCase();

        console.log("Gemini Response:", text);

        const tags = [];
        if (text.includes('cat') || text.includes('neko') || text.includes('猫')) {
            tags.push('cat');
        }
        if (text.includes('fuji') || text.includes('富士')) {
            tags.push('fuji');
        }

        res.json({ tags });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'Failed to analyze image', details: error.message });
    }
});

// Serve static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
