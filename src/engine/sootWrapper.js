const vscode = require('vscode');
const utils = require('../utils');
const p = require('path');
const runFullAnalysis = require('./fullAnalysis').runFullAnalysis;

async function runAnalysis(folder) {

    if (!utils.needSetup()) {
        vscode.window.showInformationMessage('Running..');
        
        // locate apk
        let newUri = folder;
        if (!folder) {
            await vscode.commands.executeCommand('copyFilePath');
            folder = await vscode.env.clipboard.readText();
            newUri = vscode.Uri.file(folder);
        }
        let apk = newUri.fsPath;
        let outFolder = vscode.Uri.joinPath(utils.getProjectRootUri(), p.sep + 'jamalOutput').fsPath;
        
        // create output folder
        utils.makeFolder(outFolder);
    
        // run full analysis
        runFullAnalysis(apk, outFolder);

    }
}

module.exports = {
	runAnalysis
}

