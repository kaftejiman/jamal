const vscode = require('vscode');
const utils = require('../utils');
const path = require('path');
const fs = require('fs');

function drawGraph() {
    
    if (!utils.needSetup()) {
        
        var editor = vscode.window.activeTextEditor;
        let dotFile = '';

        if (editor) {
            let pDots = utils.getProjectDots();
            if (!utils.exists(pDots)) {
                vscode.window.showInformationMessage('Error: Make sure you run analysis and analysis finishes correctly, check console output for any relevant errors.');
                return;
            }
        
            const position = editor.selection.active;
            var document = editor.document;
            const line = position.line;
            const fn = path.basename(editor.document.fileName).replace('.grimple', '');
            const sig = utils.returnFunctionSignature(document, line);
        
            if (sig != '') {
                dotFile = `${pDots}\\${fn}_${sig}.dot`
            } else {
                dotFile = ''
            }
            
            let args = {
                document: document,
                content: fs.readFileSync(dotFile, { encoding: 'utf8', flag: 'r' }),
                allowMultiplePanels: true,
                callback: function () { },
            };
        
            vscode.commands.executeCommand("graphviz-interactive-preview.preview.beside", args);
        }
    }
}

module.exports = { drawGraph }

