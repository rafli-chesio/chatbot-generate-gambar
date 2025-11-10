// --- KODE THEME TOGGLE (TETAP SAMA) ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
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
// --- AKHIR KODE THEME TOGGLE ---

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!");
    
    // Hapus referensi ke 'styleSelect'
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');
    const resultContainer = document.getElementById('result-container');
    const errorBox = document.getElementById('error-message');

    // Hapus 'styleSelect' dari pemeriksaan
    if (!promptInput || !generateBtn || !loadingSpinner || !resultImage || !resultContainer || !errorBox) {
        console.error("Error: Satu atau lebih elemen DOM (input, tombol, loader, gambar, resultContainer, atau errorBox) tidak ditemukan.");
        return; 
    }

    // Tambahkan event listener ke tombol "Generate"
    generateBtn.addEventListener('click', async () => {
        
        console.log('Tombol diklik!');
        
        // Hanya ambil 'prompt'
        const prompt = promptInput.value;

        if (!prompt) {
            if (errorBox) {
                errorBox.textContent = 'Harap masukkan prompt terlebih dahulu.';
                errorBox.style.display = 'block';
            } else {
                alert('Harap masukkan prompt terlebih dahulu.');
            }
            return;
        }

        console.log(`Prompt pengguna: ${prompt}`); // Log disederhanakan

        // ... (UI Feedback tetap sama)
        loadingSpinner.style.display = 'block';
        resultContainer.style.display = 'none';
        generateBtn.disabled = true;
        if (errorBox) errorBox.style.display = 'none';

        try {
            // Kirim HANYA 'prompt'
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: prompt 
                }),
            });

            // ... (Sisa 'if (!response.ok)' tetap sama)
            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = errorData.error || 'Gagal menghasilkan gambar.';
                if (errorData.details) {
                    errorMessage += ` (Alasan: ${errorData.details})`;
                }
                throw new Error(errorMessage);
            }

            // ... (Sisa 'try...catch...finally' tetap sama)
            const data = await response.json();
            
            if (!data.base64Image) {
                throw new Error('Respons sukses, tetapi tidak ada data gambar.');
            }
            
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultContainer.style.display = 'block'; 

        } catch (error) {
            console.error('Error:', error);
            if (errorBox) {
                errorBox.textContent = 'Terjadi kesalahan: ' + error.message;
                errorBox.style.display = 'block';
            } else {
                alert('Terjadi kesalahan: ' + error.message);
            }
        
        } finally {
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});