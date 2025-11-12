// File: /api/generate.js
// (Versi BARU - Menggunakan IMAGEN 3.0)

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

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
    console.log("--- MENCOBA MODEL 'IMAGEN 3.0' ---");
    
    // Panggil API menggunakan sintaks 'generateImages'
    const response = await genAI.models.generateImages({
      // --- PERUBAHAN DI SINI ---
      model: "imagen-3.0-generate-002", // Sesuai dokumentasi Anda
      // --- --- --- --- --- --- ---
      prompt: prompt,
      config: {
          numberOfImages: 1, // Kita hanya butuh 1 gambar
      },
    });

    // 'response' berisi array 'generatedImages'
    if (response.generatedImages && response.generatedImages.length > 0) {
        
        const generatedImage = response.generatedImages[0];
        const imgBytes = generatedImage.imageBytes; 
        
        // Ubah data biner (Buffer) menjadi string Base64
        const base64ImageString = Buffer.from(imgBytes).toString('base64');
        
        console.log("Sukses menghasilkan gambar dari IMAGEN 3.0.");
        
        return res.status(200).json({ base64Image: base64ImageString });

    } else {
        // Ini terjadi jika Imagen gagal diam-diam
        console.error("Gagal mengambil gambar dari Imagen 3.0, respons tidak diketahui.");
        console.log("Full API Response:", JSON.stringify(response, null, 2));
        return res.status(500).json({ error: 'Failed to generate image. Invalid API response from Imagen.' });
    }

  } catch (error) {
    // Tangani error jika API key-nya tidak diizinkan, dll.
    console.error('Error calling Google AI (Imagen 3.0) API:', error.message, error.stack);
    return res.status(500).json({ error: 'Failed to call Google AI API', details: error.message });
  }
}