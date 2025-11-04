function initBrowser(bodyId) {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://duckduckgo.com'; // Privacy-focused default
    iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.border = 'none';
    document.getElementById(bodyId).appendChild(iframe);
    
    // URL input
    document.getElementById(bodyId).innerHTML = '<input id="url-input" placeholder="Enter URL" style="width:100%;margin-bottom:10px;"><br>' + iframe.outerHTML;
    document.getElementById('url-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') iframe.src = e.target.value;
    });
}
