document.addEventListener('DOMContentLoaded', function() {
    const shortenBtn = document.getElementById('shortenBtn');
    const fullUrlInput = document.getElementById('fullUrl');
    const customCodeInput = document.getElementById('customCode');
    const resultContainer = document.getElementById('resultContainer');
    const shortUrlElement = document.getElementById('shortUrl');
    const copyBtn = document.getElementById('copyBtn');
    const errorMsg = document.getElementById('errorMsg');
    
    shortenBtn.addEventListener('click', async function() {
        // Reset UI
        errorMsg.style.display = 'none';
        resultContainer.style.display = 'none';
        
        const fullUrl = fullUrlInput.value.trim();
        const customCode = customCodeInput.value.trim();
        
        if (!fullUrl) {
            showError('Please enter a URL to shorten');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:4000/api/url/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullUrl: fullUrl,
                    urlCode: customCode || undefined
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                showError(data.error || 'Failed to shorten URL');
                return;
            }
            
            const shortUrl = `http://localhost:4000/${data.urlCode}`;
            shortUrlElement.textContent = shortUrl;
            resultContainer.style.display = 'block';
            
        } catch (error) {
            showError('An error occurred. Please try again.');
            console.error('Error:', error);
        }
    });
    
    copyBtn.addEventListener('click', function() {
        const shortUrl = shortUrlElement.textContent;
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    });
    
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
});