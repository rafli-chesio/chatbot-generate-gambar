// File: /api/generate.js
// (Versi FINAL: Menggabungkan Logika Style + Safety Settings)

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// --- 1. KITA MASUKKAN SAFETY SETTINGS ---
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];
// --- --- --- --- --- --- --- --- --- ---

// --- 2. KITA TETAP GUNAKAN FUNGSI PROMPT ENGINEERING ---
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
            stylePrompt = "kualitas tinggi";
    }
    return `${prompt}, ${stylePrompt}`;
}
// --- --- --- --- --- --- --- --- --- ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, style } = req.body; 
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const enhancedPrompt = getEnhancedPrompt(prompt, style);
    
    console.log(`Menerima prompt: "${prompt}", Style: "${style}"`);
    console.log(`Mengirim prompt ke AI: "${enhancedPrompt}"`);
    
    // --- 3. PANGGIL API DENGAN KEDUA FITUR ---
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: enhancedPrompt,
      safetySettings: safetySettings // <-- PERBAIKAN DITAMBAHKAN DI SINI
    });
    // --- --- --- --- --- --- --- --- --- ---

    const candidates = response.candidates;

    if (candidates && 
        candidates[0].content &&
        candidates[0].content.parts &&
        candidates[0].content.parts[0].inlineData) {
      
      const inlineData = candidates[0].content.parts[0].inlineData;
      const base64ImageString = inlineData.data;

      console.log("Sukses menghasilkan gambar.");
      return res.status(200).json({ base64Image: base64ImageString });
    }
    
    else if (response.promptFeedback && response.promptFeedback.blockReason) {
      const blockReason = response.promptFeedback.blockReason;
      console.error(`Prompt diblokir oleh Google AI. Alasan: ${blockReason}`);
      
      return res.status(400).json({
        error: `Gagal: Prompt Anda diblokir oleh AI.`,
        details: `Alasan: ${blockReason}`
      });
    }
    
    else {
      console.error("Tidak ada data gambar (inlineData) ditemukan. Respons tidak diketahui:");
      console.log("Full API Response:", JSON.stringify(response, null, 2));
      return res.status(500).json({ error: 'Failed to generate image. Invalid API response from Google.' });
    }

  } catch (error) {
    console.error('Error calling Google AI API:', error.message, error.stack);
    return res.status(500).json({ error: 'Failed to call Google AI API', details: error.message });
  }
}