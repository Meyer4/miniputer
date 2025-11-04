// IndexedDB for local "storage" (free, unlimited-ish)
const DB_NAME = 'MinePuterFS';
const DB_VERSION = 1;
let db;
const request = indexedDB.open(DB_NAME, DB_VERSION);
request.onerror = () => console.error('DB error');
request.onsuccess = () => { db = request.result; initOS(); };
request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore('files', { keyPath: 'id' });
    db.createObjectStore('apps', { keyPath: 'name' });
};

// Init OS
function initOS() {
    // Load wallpaper & theme
    document.getElementById('wallpaper').style.backgroundImage = 'url(../assets/wallpapers/default.jpg)';
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Dock clicks
    document.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const app = e.target.dataset.app || e.target.classList.contains('ai') ? 'ai' : null;
            if (app) launchApp(app);
        });
    });
    
    // Start menu: Open AI or apps list
    document.getElementById('start-menu').addEventListener('click', () => toggleAI());
    
    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => { e.prompt(); }); // Viral hook
    
    // Monetization: Check for premium (localStorage flag), show donate btn
    if (!localStorage.getItem('premium')) {
        const donateBtn = document.createElement('div');
        donateBtn.innerHTML = '❤️ Support MinePuter (Free Forever)';
        donateBtn.className = 'theme-toggle'; // Style as icon
        donateBtn.onclick = () => window.open('https://buymeacoffee.com/yourname'); // Your link
        document.querySelector('.taskbar').appendChild(donateBtn);
    }
    
    // Load saved apps/files
    loadFiles();
    loadApps();
    
    // AI init
    initAI();
}

// Launch App (Windows)
function launchApp(appName) {
    const container = document.getElementById('window-container');
    const win = document.createElement('div');
    win.className = 'window';
    win.innerHTML = `
        <div class="window-header">
            <span>${appName.charAt(0).toUpperCase() + appName.slice(1)}</span>
            <button onclick="this.closest('.window').remove()">×</button>
        </div>
        <div class="window-body" id="${appName}-body"></div>
    `;
    container.appendChild(win);
    gsap.fromTo(win, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    
    // Load app content
    if (appName === 'terminal') initTerminal(`${appName}-body`);
    else if (appName === 'browser') initBrowser(`${appName}-body`);
    else if (appName === 'editor') initEditor(`${appName}-body`);
}

// File System Helpers
function saveFile(id, content) {
    const tx = db.transaction('files', 'readwrite');
    tx.objectStore('files').put({ id, content });
}
function loadFiles() {
    // Render file icons on desktop (simplified)
    const tx = db.transaction('files');
    const req = tx.objectStore('files').getAll();
    req.onsuccess = () => {
        // Add file icons to desktop (e.g., <div class="file-icon" onclick="openFile(id)">)
    };
}

// Apps Marketplace (Stub – expand with fetch from your GitHub repo)
function loadApps() {
    // Example: Add more icons dynamically
    const apps = [{ name: 'editor', icon: '✏️' }];
    apps.forEach(app => {
        const icon = document.createElement('div');
        icon.className = 'app-icon';
        icon.innerHTML = app.icon;
        icon.dataset.app = app.name;
        icon.title = app.name;
        icon.onclick = () => launchApp(app.name);
        document.getElementById('dock').appendChild(icon);
    });
}

// Drag for windows
let draggedWin;
document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.window-header')) draggedWin = e.target.closest('.window');
});
document.addEventListener('mousemove', (e) => {
    if (draggedWin) {
        gsap.to(draggedWin, { x: e.clientX - draggedWin.offsetWidth/2, y: e.clientY - 20, duration: 0.1 });
    }
});

// Theme toggle (in AI or menu)
function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}
