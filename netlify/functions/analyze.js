import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { image } = JSON.parse(event.body);
        // DEBUG: Log API Key status
        console.log("--- DEBUG: API KEY CHECK ---");
        console.log("VITE_GEMINI_API_KEY:", process.env.VITE_GEMINI_API_KEY ? "Present" : "Missing");
        console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

        // Try both variable names
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("APIキーがありません");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error: API Key missing' }),
            };
        }

        if (!image) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No image data provided' }),
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use the updated model version
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = "この画像は、猫、または富士山ですか？もしそうなら、その対象物だけを単語で一つ答えてください（例: 'cat', 'fuji'）。それ以外の場合は'unknown'と答えてください。回答は英語の小文字でお願いします。";

        const imagePart = {
            inlineData: {
                data: image,
                mimeType: "image/jpeg",
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

        return {
            statusCode: 200,
            body: JSON.stringify({ tags }),
            headers: {
                'Content-Type': 'application/json',
            },
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyze image', details: error.message }),
        };
    }
};
