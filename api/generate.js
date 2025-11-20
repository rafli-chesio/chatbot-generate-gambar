// File: /api/generate.js
// (Versi Gemini 3 - Resolusi Standar/Hemat)

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Safety settings (tetap kita pasang sebagai pengaman)
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body; 
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    console.log(`Menerima prompt: "${prompt}"`);
    
    // Panggil Model Gemini 3
    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-image-preview", // Tetap pakai model pintar ini
      contents: prompt,
      config: {
        imageConfig: {
            aspectRatio: "1:1", // Rasio kotak standar
            // Kita HAPUS baris 'imageSize: "4K"'
            // Secara default ini akan menghasilkan 1024x1024 (Hemat & Cepat)
        }
      },
      safetySettings: safetySettings
    });

    const candidates = response.candidates;

    if (candidates && 
        candidates[0].content &&
        candidates[0].content.parts) {
      
      const imagePart = candidates[0].content.parts.find(part => part.inlineData);
      
      if (imagePart) {
          const base64ImageString = imagePart.inlineData.data;
          console.log("Sukses menghasilkan gambar (Standard Res).");
          return res.status(200).json({ base64Image: base64ImageString });
      }
    }
    
    // Penanganan jika diblokir
    if (response.promptFeedback && response.promptFeedback.blockReason) {
      console.error(`Prompt diblokir. Alasan: ${response.promptFeedback.blockReason}`);
      return res.status(400).json({ error: `Gagal: Prompt diblokir.`, details: response.promptFeedback.blockReason });
    }
    
    console.error("Tidak ada data gambar ditemukan.");
    return res.status(500).json({ error: 'Failed to generate image. Empty response.' });

  } catch (error) {
    console.error('Error calling Gemini 3:', error.message);
    return res.status(500).json({ error: 'Failed to call API', details: error.message });
  }
}