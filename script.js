
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Javascript terhubung!");
    
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');
    const resultContainer = document.querySelector('.result-container');

    if (!promptInput || !generateBtn || !loadingSpinner || !resultImage) {
        console.error("Error: Satu atau lebih elemen DOM (input, tombol, loader, gambar) tidak ditemukan.");
        return; 
    }

    generateBtn.addEventListener('click', async () => { 
        
        console.log('Tombol diklik!');
        
        const prompt = promptInput.value;

        // Validasi input
        if (!prompt) {
            alert('Harap masukkan prompt terlebih dahulu.');
            return;
        }

        console.log(`Prompt pengguna: ${prompt}`);

        loadingSpinner.style.display = 'block';
        if (resultContainer) resultContainer.style.display = 'none';
        generateBtn.disabled = true; 

        try {
        
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {

                const errorData = await response.json();
 
                let errorMessage = errorData.error || 'Gagal menghasilkan gambar.';
                if (errorData.details) {
                    errorMessage += ` (Alasan: ${errorData.details})`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (!data.base64Image) {
  
                throw new Error('Respons sukses, tetapi tidak ada data gambar.');
            }
            
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            if (resultContainer) resultContainer.style.display = 'block';

        } catch (error) {
       
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        
        } finally {
           
            loadingSpinner.style.display = 'none';
            generateBtn.disabled = false;
        }
    });
});