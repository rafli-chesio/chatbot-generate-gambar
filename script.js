
console.log("JavaScript terhubung!");

const API_KEY = "AIzaSyBfAjuvJjVI7flaj89QttF7H_PAzNdwv90";  
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;


const promptInput = document.getElementById("prompt-input");
const generateBtn = document.getElementById("generate-btn");
const loadingText = document.getElementById("loading-text");
const resultImage = document.getElementById("result-image");

// 2. Menambahkan "Pendengar Acara" (Event Listener) ke tombol
// Ini berarti: "Hei JavaScript, awasi tombol 'generateBtn'. 
// Jika ada yang meng-KLIK-nya, jalankan fungsi bernama 'handleImageGeneration'."
generateBtn.addEventListener("click", handleImageGeneration);


// 3. Membuat fungsi (set instruksi) yang akan dijalankan saat tombol diklik
function handleImageGeneration() {
    console.log("Tombol diklik!");

    // Ambil teks yang diketik pengguna dari kotak input
    const prompt = promptInput.value;

    // Periksa apakah pengguna mengetik sesuatu
    if (!prompt) {
        alert("Harap masukkan teks terlebih dahulu!");
        return; // Hentikan fungsi jika tidak ada teks
    }

    console.log(`Prompt pengguna: ${prompt}`);

    // TAMPILKAN pesan "loading..."
    // Kita menghapus class 'hidden' agar elemennya muncul
    loadingText.classList.remove("hidden");

    // SEMBUNYIKAN gambar (jika ada gambar lama)
    // Kita menambahkan class 'hidden' agar elemennya hilang
    resultImage.classList.add("hidden");

    // -----
    // NANTI DI SINI...
    // Kita akan menambahkan kode untuk memanggil API AI.
    // Untuk sekarang, kita biarkan kosong.
    // -----
}