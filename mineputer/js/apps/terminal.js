function initTerminal(bodyId) {
    const term = new Terminal();
    term.open(document.getElementById(bodyId));
    term.write('Welcome to MinePuter Terminal! Type "ls" for files, "ai help" for AI.$ ');
    
    term.onData((data) => {
        // Simulate commands
        if (data === 'ls\n') term.write('Files: docs.txt app.js\n');
        else if (data.includes('ai ')) {
            // Pipe to AI
            term.write(`AI: ${data.replace('ai ', '')} (integrated)\n`);
        }
        term.write('\r$ ');
    });
}
