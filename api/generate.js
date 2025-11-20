// File: /api/generate.js
// (Versi EKSPERIMENTAL: Menggunakan Model Gemini 3 Preview)

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Kita tetap pasang safety settings (jaga-jaga)
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
    console.log("--- MENCOBA MODEL TERBARU: gemini-3-pro-image-preview ---");
    
    // Panggil API sesuai screenshot dokumentasi kamu
    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-image-preview", // <-- Nama model baru dari screenshot
      contents: prompt,
      config: {
        // Konfigurasi gambar (sesuai screenshot)
        imageConfig: {
            aspectRatio: "1:1", // Kita set kotak (atau bisa "16:9")
            imageSize: "4K"     // Kualitas tinggi
        }
      },
      safetySettings: safetySettings
    });

    const candidates = response.candidates;

    // Logika pengambilan gambar (masih sama karena outputnya inlineData)
    if (candidates && 
        candidates[0].content &&
        candidates[0].content.parts) {
      
      // Cari part yang punya inlineData (gambar)
      const imagePart = candidates[0].content.parts.find(part => part.inlineData);
      
      if (imagePart) {
          const base64ImageString = imagePart.inlineData.data;
          console.log("Sukses menghasilkan gambar 4K dengan Gemini 3.");
          return res.status(200).json({ base64Image: base64ImageString });
      }
    }
    
    // ... (Error handling standard) ...
    if (response.promptFeedback && response.promptFeedback.blockReason) {
      console.error(`Prompt diblokir. Alasan: ${response.promptFeedback.blockReason}`);
      return res.status(400).json({ error: `Gagal: Prompt diblokir.`, details: response.promptFeedback.blockReason });
    }
    
    console.error("Tidak ada data gambar ditemukan. Respons tidak diketahui.");
    console.log("Full API Response:", JSON.stringify(response, null, 2));
    return res.status(500).json({ error: 'Failed to generate image. Empty response.' });

  } catch (error) {
    console.error('Error calling Gemini 3:', error.message);
    
    // Tangani jika model belum tersedia untuk akun kamu (404)
    if (error.message.includes("not found") || error.message.includes("404")) {
         return res.status(404).json({ 
             error: 'Model Gemini 3 belum tersedia untuk akun ini.', 
             details: 'Coba kembalikan ke gemini-2.5-flash-image.' 
         });
    }

    return res.status(500).json({ error: 'Failed to call API', details: error.message });
  }
}