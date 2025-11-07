import { GoogleGenAI } from "@google/genai";

// Menginisialisasi GoogleGenerativeAI dengan API Key dari Vercel Environment Variables
const genAI = new GoogleGenAI(process.env.GOOGLE_API_KEY);

// Fungsi handler default untuk Vercel Serverless Function
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Ambil prompt dari body permintaan frontend
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 2. Panggil API Google AI
    // Menggunakan model yang diminta (atau model generasi gambar yang tersedia)
    // Catatan: Nama model bisa berubah. Per 2024-2025, 'gemini-2.5-flash-image' 
    // adalah salah satu model yang bisa menghasilkan gambar.
    console.log(`Menerima permintaan untuk prompt: ${prompt}`);
    
    // Dapatkan instance model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    // Hasilkan konten (gambar)
    // Kita perlu menyertakan parameter untuk memberitahu model bahwa kita ingin output gambar
    const result = await model.generateContent({
        prompt: prompt,
        // Parameter ini mungkin diperlukan untuk memaksa output gambar
        // sesuaikan berdasarkan dokumentasi terbaru
        generationConfig: {
            "response_mime_type": "image/png", 
        }
    });
    
    // Dapatkan respons dari model
    const response = result.response;

    // 3. Ekstrak data gambar Base64
    // Respons gambar biasanya ada di 'parts' sebagai inlineData
    if (response.candidates && 
        response.candidates[0].content &&
        response.candidates[0].content.parts &&
        response.candidates[0].content.parts[0].inlineData) {
      
      const inlineData = response.candidates[0].content.parts[0].inlineData;
      
      // Data sudah dalam format Base64, tapi tanpa prefix
      const base64ImageString = inlineData.data;

      console.log("Sukses menghasilkan gambar.");

      // 4. Kirim kembali string Base64 ke frontend
      return res.status(200).json({ base64Image: base64ImageString });

    } else {
      console.error("Tidak ada data gambar (inlineData) ditemukan di respons API.");
      // Jika respons tidak mengandung data gambar yang diharapkan
      return res.status(500).json({ error: 'Failed to generate image. Invalid API response.' });
    }

  } catch (error) {
    // Tangani error jika panggilan API gagal
    console.error('Error calling Google AI API:', error.message);
    return res.status(500).json({ error: 'Failed to call Google AI API', details: error.message });
  }
}