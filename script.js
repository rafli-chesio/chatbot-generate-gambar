document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!"); 
    
    // Ambil elemen-elemen yang dibutuhkan
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');

    generateBtn.addEventListener('click', async () => {
        
        console.log('Tombol diklik!'); 
        
        const prompt = promptInput.value;

        if (!prompt) {
            alert('Harap masukkan prompt terlebih dahulu.');
            return;
        }

        console.log(`Prompt pengguna: ${prompt}`); 

        // Nampilin status loading
        loadingSpinner.style.display = 'block';
        resultImage.style.display = 'none';

        try {
            // Kirim request ke backend
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

            // Ambil data JSON dan tampilkan gambar
            const data = await response.json();
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultImage.style.display = 'block';

        } catch (error) {
            // Untuk nanganin error
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        
        } finally {
            // Ngehide loading, saran Heri
            loadingSpinner.style.display = 'none';
        }
        
    });
});