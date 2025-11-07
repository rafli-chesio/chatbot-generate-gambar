// script.js (Versi Lengkap dan Benar)

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!"); // <-- Ini yang Anda lihat di log sebelumnya
    
    // Ambil elemen-elemen yang dibutuhkan
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');

    // Tambahkan event listener ke tombol "Generate"
    generateBtn.addEventListener('click', async () => {
        
        console.log('Tombol diklik!'); // <-- Ini baris 21 Anda
        
        const prompt = promptInput.value;

        if (!prompt) {
            alert('Harap masukkan prompt terlebih dahulu.');
            return;
        }

        console.log(`Prompt pengguna: ${prompt}`); // <-- Ini baris 32 Anda

        // --- PASTIKAN SEMUA KODE DI BAWAH INI ADA! ---
        // --- INI KEMUNGKINAN BESAR HILANG DARI FILE ANDA ---

        // 1. Tampilkan status loading
        loadingSpinner.style.display = 'block';
        resultImage.style.display = 'none';

        try {
            // 2. Kirim permintaan ke backend
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menghasilkan gambar.');
            }

            // 3. Ambil data JSON dan tampilkan gambar
            const data = await response.json();
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultImage.style.display = 'block';

        } catch (error) {
            // 4. Tangani error
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        
        } finally {
            // 5. Sembunyikan loading (apapun yang terjadi)
            loadingSpinner.style.display = 'none';
        }
        
        // --- AKHIR DARI BAGIAN YANG HILANG ---
    });
});