const vscode = require('vscode');
const u = require('../utils');
const path = require('path');
const fs = require('fs');

function drawGraph(commands) {
    
    var editor = vscode.window.activeTextEditor;
    
    if (editor) {
        let pDots = u.getProjectDots();
        if (!u.exists(pDots)) {
            vscode.window.showInformationMessage('Error: Make sure you run analysis and analysis finishes correctly, check console output for any relevant errors.');
            return;
        }
        const position = editor.selection.active;
        var document = editor.document;
        const line = position.line;
        const fn = path.basename(editor.document.fileName).replace('.grimple','');
        const sig = u.returnFunctionSignature(document,line);
        
        if (sig != '') {
            dotFile = `${pDots}\\${fn}_${sig}.dot`
        } else {
            dotFile = ''
        }
        //console.log(dotFile);
        let args = {
            document: document,
            content:  fs.readFileSync(dotFile, {encoding:'utf8', flag:'r'}), 
            allowMultiplePanels: true,
            callback: function () {},
        };
        
        vscode.commands.executeCommand("graphviz-interactive-preview.preview.beside", args);
    }
}

module.exports = { drawGraph }

