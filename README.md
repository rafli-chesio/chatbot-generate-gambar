# Secure Text-to-Image AI Generator (Gemini & Vercel)

Ini adalah proyek aplikasi web yang mendemonstrasikan cara membuat generator teks-ke-gambar (text-to-image) menggunakan Google Gemini API dengan arsitektur yang aman dan modern.

Fokus utama proyek ini adalah pada **arsitektur client-server yang aman**. Alih-alih mengekspos API Key Google di frontend (browser), proyek ini menggunakan Vercel Serverless Function sebagai backend perantara untuk melindungi API key dan rahasia lainnya.

![Pratinjau Aplikasi](https://raw.githubusercontent.com/username/repo/main/assets/images/screenshot-aplikasi.png)

---

## 🚀 Fitur Utama

* **Antarmuka Sederhana:** Pengguna cukup mengetik prompt dan menekan "Generate".
* **Arsitektur Aman:** **API Key Google 100% aman** di sisi server (Vercel) dan tidak pernah terekspos ke browser klien.
* **Backend Tanpa Server (Serverless):** Menggunakan Vercel Serverless Function (Node.js) untuk menangani logika backend secara efisien.
* **Umpan Balik Real-time:** Menampilkan status *loading* saat gambar sedang dibuat dan menangani error dengan jelas.

## 🏛️ Arsitektur Keamanan (Poin Inti)

Menyimpan API key di kode frontend (HTML/CSS/JS) sangat berbahaya karena siapa pun dapat melihatnya, mencurinya, dan menggunakannya, yang dapat menyebabkan tagihan besar.

Proyek ini memecahkan masalah tersebut dengan alur kerja berikut:

1.  **Klien (Browser):** Pengguna mengetik "kucing" dan menekan "Generate". JavaScript frontend **TIDAK** memanggil Google. Sebaliknya, ia mengirim permintaan `fetch` ke backend kita sendiri: `POST /api/generate` dengan isi `{ prompt: "kucing" }`.
2.  **Backend (Vercel Serverless Function):**
    * File `/api/generate.js` menerima permintaan ini.
    * Ia kemudian secara aman mengambil `GOOGLE_API_KEY` dari **Vercel Environment Variables** (yang terenkripsi).
    * Hanya server inilah yang menggunakan API key tersebut untuk melakukan panggilan aman ke Google Gemini API.
3.  **Google AI:** Menerima permintaan dari server Vercel, memprosesnya, dan mengirimkan kembali data gambar (Base64).
4.  **Backend (Vercel):** Menerima data gambar dan meneruskannya kembali ke Klien sebagai respons.
5.  **Klien (Browser):** Menerima data gambar (string Base64) dari backend-nya sendiri dan menampilkannya di tag `<img>`.

## 🛠️ Teknologi yang Digunakan

* **Frontend:** HTML, CSS, Vanilla JavaScript (Fetch API)
* **Backend:** Vercel Serverless Function (Node.js)
* **AI API:** Google AI (`@google/genai`) - Model `gemini-2.5-flash-image`
* **Platform:** Vercel (Hosting & Functions) & GitHub (Version Control)

## ⚙️ Cara Deploy (Instalasi Ulang)

Berikut adalah langkah-langkah untuk men-deploy salinan proyek ini:

1.  **Clone Repositori**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Hubungkan ke Vercel**
    * Upload proyek ini ke repositori GitHub Anda.
    * Buka [Vercel](https://vercel.com/) dan impor repositori GitHub tersebut.
    * Vercel akan secara otomatis mendeteksi `package.json` dan folder `api`.

4.  **Siapkan Environment Variable (Paling Penting)**
    * Dapatkan API key Anda dari [Google AI Studio](https://aistudio.google.com/) atau [Google Cloud Console](https://console.cloud.google.com/).
    * Di dashboard proyek Vercel Anda, pergi ke **Settings -> Environment Variables**.
    * Buat variabel baru:
        * **Name:** `GOOGLE_API_KEY`
        * **Value:** `[tempel-api-key-anda-di-sini]`

5.  **Aktifkan Penagihan (Billing) di Google Cloud**
    * API generasi gambar Gemini (`gemini-2.5-flash-image`) memerlukan akun Google Cloud dengan **penagihan (billing) yang aktif**.
    * Ini diperlukan untuk menghapus kuota `limit: 0` pada *free tier*.
    * Buka [Google Cloud Console](https://console.cloud.google.com/), pilih proyek Anda, pergi ke **Billing**, dan pastikan akun penagihan Anda tertaut dan aktif (upgrade dari "Free Trial" ke "Full Account").

6.  **Deploy!**
    * Tekan tombol "Deploy" di Vercel. Situs Anda akan live!
