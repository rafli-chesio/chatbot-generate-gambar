// File: /api/generate.js
// (Versi Disederhanakan)

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Pengaturan keamanan (tetap sama)
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

// --- FUNGSI 'getEnhancedPrompt' SUDAH DIHAPUS ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ambil HANYA 'prompt'
    const { prompt } = req.body; 
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log(`Menerima prompt: "${prompt}"`);
    
    // Panggil AI hanya dengan 'prompt'
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt, // <-- Kembali menggunakan prompt asli
      safetySettings: safetySettings
    });

    const candidates = response.candidates;

    // ... (Sisa kode 'if (candidates ...)' Anda tetap sama)
    // ... (Sisa kode 'else if (response.promptFeedback ...)' Anda tetap sama)
    // ... (Sisa kode 'else {...}' Anda tetap sama)

  } catch (error) {
    console.error('Error calling Google AI API:', error.message, error.stack);
    return res.status(500).json({ error: 'Failed to call Google AI API', details: error.message });
  }
}