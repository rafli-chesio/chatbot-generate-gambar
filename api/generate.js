// File: /api/generate.js
// VERSI BARU DENGAN SAFETY SETTINGS

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// --- TAMBAHAN BARU: Tentukan pengaturan keamanan ---
// Kita memberitahu AI untuk hanya memblokir konten jika levelnya MEDIUM atau HIGH
// Ini akan mencegah pemblokiran "false positive" seperti "Ayam" atau "Kucing Astronot"
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
];
// --- --- --- --- --- --- --- --- --- --- --- ---

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Menerima permintaan untuk prompt: ${prompt}`);
    
    // Panggil API dengan pengaturan keamanan yang baru
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      safetySettings: safetySettings // <-- TAMBAHKAN BARIS INI
    });

    const candidates = response.candidates;

    // 1. Cek jalur sukses (Happy Path)
    if (candidates && 
        candidates[0].content &&
        candidates[0].content.parts &&
        candidates[0].content.parts[0].inlineData) {
      
      const inlineData = candidates[0].content.parts[0].inlineData;
      const base64ImageString = inlineData.data;

      console.log("Sukses menghasilkan gambar.");
      return res.status(200).json({ base64Image: base64ImageString });
    }
    
    // 2. Cek jalur "diblokir" (Safety/Policy)
    else if (response.promptFeedback && response.promptFeedback.blockReason) {
      const blockReason = response.promptFeedback.blockReason;
      console.error(`Prompt diblokir oleh Google AI. Alasan: ${blockReason}`);
      
      return res.status(400).json({
        error: `Gagal: Prompt Anda diblokir oleh AI.`,
        details: `Alasan: ${blockReason}`
      });
    }
    
    // 3. Cek jalur error "tidak diketahui"
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