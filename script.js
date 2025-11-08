// File: /script.js
// (Versi Lengkap dan Terbaru)

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!");
    
    // 1. Ambil semua elemen DOM
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');

    // Pastikan semua elemen penting ada
    if (!promptInput || !generateBtn || !loadingSpinner || !resultImage) {
        console.error("Error: Satu atau lebih elemen DOM (input, tombol, loader, gambar) tidak ditemukan.");
        return; // Hentikan eksekusi jika UI rusak
    }

    // 2. Tambahkan event listener ke tombol "Generate"
    generateBtn.addEventListener('click', async () => {
        
        console.log('Tombol diklik!');
        
        const prompt = promptInput.value;

        // Validasi input
        if (!prompt) {
            alert('Harap masukkan prompt terlebih dahulu.');
            return;
        }

        console.log(`Prompt pengguna: ${prompt}`);

        // 3. Mulai proses (UI Feedback)
        loadingSpinner.style.display = 'block';
        resultImage.style.display = 'none';
        generateBtn.disabled = true; // Nonaktifkan tombol saat loading

        try {
            // 4. Kirim permintaan ke backend
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            // 5. Tangani respons dari backend
            if (!response.ok) {
                // Jika server merespons dengan error (400, 403, 500, dll.)
                const errorData = await response.json();
                
                // Buat pesan error yang lebih baik menggunakan detail dari backend
                let errorMessage = errorData.error || 'Gagal menghasilkan gambar.';
                if (errorData.details) {
                    errorMessage += ` (Alasan: ${errorData.details})`;
                }
                throw new Error(errorMessage);
            }

            // 6. Tangani respons sukses (Jalur Sukses)
            const data = await response.json();
            
            if (!data.base64Image) {
                // Jika backend mengirim 200 OK tapi tidak ada gambar
                throw new Error('Respons sukses, tetapi tidak ada data gambar.');
            }
            
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultImage.style.display = 'block';

        } catch (error) {
            // 7. Tangani SEMUA error (Jaringan, fetch, atau dari 'throw' di atas)
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        
        } finally {
            // 8. Selesai (UI Cleanup)
            // Apapun yang terjadi, sembunyikan loading dan aktifkan kembali tombolnya
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});