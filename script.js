// Menunggu sampai semua elemen HTML dimuat
document.addEventListener('DOMContentLoaded', () => {

    // Ambil elemen-elemen yang dibutuhkan
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultImage = document.getElementById('result-image');

    // Tambahkan event listener ke tombol "Generate"
    generateBtn.addEventListener('click', async () => {
        
        const prompt = promptInput.value;

        // Validasi: jangan kirim jika prompt kosong
        if (!prompt) {
            alert('Harap masukkan prompt terlebih dahulu.');
            return;
        }

        // Tampilkan status loading dan sembunyikan gambar sebelumnya
        loadingSpinner.style.display = 'block';
        resultImage.style.display = 'none';

        try {
            // Kirim permintaan ke backend /api/generate
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                // Jika server merespons dengan error (spt 400, 500)
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menghasilkan gambar.');
            }

            // Ambil data JSON dari respons
            const data = await response.json();

            // Tampilkan gambar
            // 'data.base64Image' berisi string Base64 yang dikirim dari backend
            resultImage.src = 'data:image/png;base64,' + data.base64Image;
            resultImage.style.display = 'block';

        } catch (error) {
            // Tangani error jaringan atau error dari server
            console.error('Error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        
        } finally {
            // Apapun yang terjadi (sukses atau gagal), sembunyikan loading
            loadingSpinner.style.display = 'none';
        }
    });
});