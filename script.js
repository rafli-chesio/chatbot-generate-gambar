// File: /script.js
// (Versi FINAL - Mengatasi bug CSS dan Loading)

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        // Ubah ikon tombol
        const icon = themeToggleBtn.querySelector('i');
        if (body.classList.contains('light-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!");
    
    // 1. Ambil semua elemen DOM
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');
    const resultContainer = document.querySelector('.result-container'); 
    const errorBox = document.getElementById('error-message');
    const styleSelect = document.getElementById('style-select');

    // Pastikan semua elemen penting ada
    if (!promptInput || !generateBtn || !loadingSpinner || !resultImage || !resultContainer || !styleSelect ) {
        console.error("Error: Satu atau lebih elemen DOM (input, tombol, loader, gambar, atau resultContainer) tidak ditemukan.");
        return; 
    }

    // 2. Tambahkan event listener ke tombol "Generate"
    generateBtn.addEventListener('click', async () => {
        
        console.log('Tombol diklik!');
        
        const prompt = promptInput.value;
        const style = styleSelect.value;
        if (!prompt) {
            alert('Harap masukkan prompt terlebih dahulu.');
            return;
        }

        console.log(`Prompt pengguna: ${prompt}, Style: ${style}`);

        // 3. Mulai proses (UI Feedback)
        loadingSpinner.style.display = 'block';
        resultContainer.style.display = 'none'; // Sembunyikan container hasil lama
        generateBtn.disabled = true; 

        if (errorBox) errorBox.style.display = 'none';

        try {
            // 4. Kirim permintaan ke backend
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: prompt,
                    style: style }),
            });

            // 5. Tangani respons dari backend
            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = errorData.error || 'Gagal menghasilkan gambar.';
                if (errorData.details) {
                    errorMessage += ` (Alasan: ${errorData.details})`;
                }
                throw new Error(errorMessage);
            }

            // 6. Tangani respons sukses (Jalur Sukses)
            const data = await response.json();
            
            if (!data.base64Image) {
                throw new Error('Respons sukses, tetapi tidak ada data gambar.');
            }
            
            // Tampilkan gambar DAN container-nya
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultContainer.style.display = 'block'; // <-- INI PERBAIKANNYA

        } catch (error) {
           console.error('Error:', error);
            
            // --- GANTI 'alert(...)' DENGAN KODE INI ---
            if (errorBox) {
                errorBox.textContent = 'Terjadi kesalahan: ' + error.message;
                errorBox.style.display = 'block';
            } else {
                // Fallback jika error box tidak ada
                alert('Terjadi kesalahan: ' + error.message);
            }
        
        } finally {
            // 8. Selesai (UI Cleanup)
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});