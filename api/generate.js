// File: /api/generate.js
// (Versi BARU dengan Prompt Engineering)

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Pengaturan keamanan (tetap sama)
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];

// --- FUNGSI BARU UNTUK PROMPT ENGINEERING ---
function getEnhancedPrompt(prompt, style) {
    let stylePrompt = "";
    switch (style) {
        case 'cinematic':
            stylePrompt = "foto sinematik, pencahayaan dramatis, detail tinggi, 4k";
            break;
        case 'anime':
            stylePrompt = "gaya anime, gambar digital, seni konsep, 2D, berwarna cerah";
            break;
        case 'photorealistic':
            stylePrompt = "foto sangat realistis, tajam, seperti diambil dengan kamera DSLR, pencahayaan alami";
            break;
        case 'low_poly':
            stylePrompt = "gaya low-poly, 3D render, warna solid, geometris";
            break;
        default:
            stylePrompt = "kualitas tinggi"; // Default jika tidak ada style
    }
    
    // Gabungkan prompt pengguna dengan gaya yang dipilih
    return `${prompt}, ${stylePrompt}`;
}
// --- --- --- --- --- --- --- --- --- ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Ambil 'prompt' DAN 'style' dari body
    const { prompt, style } = req.body; 
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 2. BUAT PROMPT BARU
    const enhancedPrompt = getEnhancedPrompt(prompt, style);
    
    console.log(`Menerima prompt: "${prompt}", Style: "${style}"`);
    console.log(`Mengirim prompt ke AI: "${enhancedPrompt}"`);
    
    // 3. Panggil AI dengan prompt yang sudah disempurnakan
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: enhancedPrompt, // <-- Gunakan prompt baru
      safetySettings: safetySettings
    });

    const candidates = response.candidates;

    // ... (Sisa kode 'if (candidates ...)' Anda tetap sama) ...
    // ... (Sisa kode 'else if (response.promptFeedback ...)' Anda tetap sama) ...
    // ... (Sisa kode 'else {...}' Anda tetap sama) ...

  } catch (error) {
    console.error('Error calling Google AI API:', error.message, error.stack);
    return res.status(500).json({ error: 'Failed to call Google AI API', details: error.message });
  }
}