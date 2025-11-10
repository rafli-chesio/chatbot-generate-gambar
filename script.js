// --- KODE BARU UNTUK THEME TOGGLE ---
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
// --- AKHIR KODE BARU ---

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!");
    
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');
    
    // --- INI ADALAH PERBAIKANNYA ---
    // Menggunakan getElementById (atau querySelector dengan '#')
    const resultContainer = document.getElementById('result-container');
    // --- --- --- --- --- --- --- ---
    
    const errorBox = document.getElementById('error-message');
    const styleSelect = document.getElementById('style-select'); 

    // Pastikan semua elemen penting ada
    if (!promptInput || !generateBtn || !loadingSpinner || !resultImage || !resultContainer || !errorBox || !styleSelect) {
        console.error("Error: Satu atau lebih elemen DOM (input, tombol, loader, gambar, resultContainer, errorBox, atau styleSelect) tidak ditemukan.");
        // Kita periksa satu per satu untuk debug
        if (!resultContainer) console.error("resultContainer tidak ditemukan!");
        // ... (dan seterusnya)
        return; 
    }

    // 2. Tambahkan event listener ke tombol "Generate"
    generateBtn.addEventListener('click', async () => {
        
        console.log('Tombol diklik!');
        
        const prompt = promptInput.value;
        const style = styleSelect.value; 

        if (!prompt) {
            // Tampilkan error di errorBox, bukan alert
            if (errorBox) {
                errorBox.textContent = 'Harap masukkan prompt terlebih dahulu.';
                errorBox.style.display = 'block';
            } else {
                alert('Harap masukkan prompt terlebih dahulu.');
            }
            return;
        }

        console.log(`Prompt pengguna: ${prompt}, Style: ${style}`);

        // 3. Mulai proses (UI Feedback)
        loadingSpinner.style.display = 'block';
        resultContainer.style.display = 'none';
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
                    style: style 
                }),
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
            
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultContainer.style.display = 'block'; 

        } catch (error) {
            // 7. Tangani SEMUA error
            console.error('Error:', error);
            if (errorBox) {
                errorBox.textContent = 'Terjadi kesalahan: ' + error.message;
                errorBox.style.display = 'block';
            } else {
                alert('Terjadi kesalahan: ' + error.message);
            }
        
        } finally {
            // 8. Selesai (UI Cleanup)
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});