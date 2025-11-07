// File: /api/generate.js
// VERSI YANG SUDAH DIPERBAIKI

import { GoogleGenAI } from "@google/genai";

// Inisialisasi seperti sebelumnya
const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Fungsi handler default untuk Vercel
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Ambil prompt dari body permintaan
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Menerima permintaan untuk prompt: ${prompt}`);
    
    // --- INI ADALAH PERBAIKANNYA ---
    
    // 1. Panggil API menggunakan 'models.generateContent'
    //    Bukan 'genAI.getGenerativeModel(...).generateContent(...)'
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt, // <-- Parameter yang benar adalah 'contents', bukan 'prompt'
    });

    // 2. Akses 'candidates' langsung dari 'response'
    //    (Bukan 'result.response' seperti di kode saya sebelumnya)
    if (response.candidates && 
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts[0].inlineData) {
      
      // 3. Ekstrak data Base64
      const inlineData = response.candidates[0].content.parts[0].inlineData;
      const base64ImageString = inlineData.data;

      console.log("Sukses menghasilkan gambar.");

      // 4. Kirim kembali string Base64 ke frontend
      return res.status(200).json({ base64Image: base64ImageString });

    } else {
      console.error("Tidak ada data gambar (inlineData) ditemukan di respons API.");
      // Jika API berhasil tapi tidak mengembalikan gambar, catat responsnya
      console.log("Full API Response:", JSON.stringify(response, null, 2));
      return res.status(500).json({ error: 'Failed to generate image. Invalid API response.' });
    }
    // --- AKHIR DARI PERBAIKAN ---

  } catch (error) {
    // Tangani error jika panggilan API gagal (misal, API key salah)
    console.error('Error calling Google AI API:', error.message, error.stack);
    return res.status(500).json({ error: 'Failed to call Google AI API', details: error.message });
  }
}