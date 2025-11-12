// File: /api/generate.js
// Versi Final: FIXED generateImage() + auto fallback ke Stable Diffusion (Replicate)

import { GoogleGenerativeAI } from "@google/generative-ai";
import Replicate from "replicate";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY, // Tambahkan di Environment Vercel
});

const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

// --- Rephrase otomatis untuk hindari false-block ---
function sanitizePrompt(prompt) {
  return prompt
    .replace(/\bbaju\b/gi, "tema futuristik")
    .replace(/\bmemakai\b/gi, "bergaya seperti")
    .replace(/\bmanusia\b/gi, "karakter lucu")
    .replace(/\bpose\b/gi, "berada di latar")
    .replace(/\bsensual\b/gi, "ceria dan lucu");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const safePrompt = sanitizePrompt(prompt);
  console.log("🧠 Prompt:", safePrompt);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const result = await model.generateImage({
      prompt: safePrompt,
      safetySettings,
    });

    // ✅ Cek hasil Gemini
    if (result?.data?.[0]?.b64_json) {
      console.log("✅ Gambar sukses dari Gemini!");
      return res.status(200).json({ base64Image: result.data[0].b64_json });
    }

    console.warn("⚠️ Gemini gagal memberikan gambar, fallback ke Stable Diffusion...");
  } catch (err) {
    console.error("❌ Error Gemini:", err.message);
  }

  // --- Fallback: Stable Diffusion XL (Replicate) ---
  try {
    const output = await replicate.run("stability-ai/stable-diffusion-xl-base-1.0", {
      input: {
        prompt: safePrompt,
        width: 1024,
        height: 1024,
        guidance_scale: 7,
      },
    });

    if (output?.[0]) {
      console.log("✅ Fallback sukses dari Stable Diffusion!");
      return res.status(200).json({ imageUrl: output[0], source: "replicate" });
    }

    throw new Error("Stable Diffusion tidak mengembalikan gambar.");
  } catch (err) {
    console.error("💥 Fallback juga gagal:", err.message);
    return res.status(500).json({
      error: "Gagal membuat gambar di kedua model.",
      details: err.message,
    });
  }
}
