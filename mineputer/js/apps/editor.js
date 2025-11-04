function initEditor(bodyId) {
    require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
    require(['vs/editor/editor.main'], () => {
        monaco.editor.create(document.getElementById(bodyId), {
            value: '// Edit your code here!\nconsole.log("Hello MinePuter!");',
            language: 'javascript',
            theme: 'vs-dark' // Matches theme
        });
    });
}
