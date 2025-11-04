let aiModel = null; // Lazy load

async function initAI() {
    // Use free HF API (no key needed for public models)
    aiModel = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
}

function toggleAI() {
    const chat = document.getElementById('ai-chat');
    chat.classList.toggle('hidden');
    if (!chat.classList.contains('hidden')) {
        document.getElementById('ai-input').focus();
    }
}

document.getElementById('ai-input').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const input = e.target.value;
        const output = document.getElementById('ai-output');
        output.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
        e.target.value = '';
        
        // Call AI (simplified fetch)
        try {
            const res = await fetch(aiModel, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: input })
            });
            const data = await res.json();
            output.innerHTML += `<p><strong>AI:</strong> ${data[0]?.generated_text || 'Thinking...'}</p>`;
            output.scrollTop = output.scrollHeight;
            
            // AI Actions: e.g., if input includes 'open terminal', launchApp('terminal')
            if (input.toLowerCase().includes('open terminal')) launchApp('terminal');
        } catch (err) {
            output.innerHTML += '<p><strong>AI:</strong> Offline mode – Coming online soon!</p>';
        }
    }
});

// Voice Commands
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (e) => document.getElementById('ai-input').value = e.results[0][0].transcript;
    document.getElementById('ai-btn').addEventListener('click', () => recognition.start());
}
