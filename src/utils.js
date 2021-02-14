const fs = require('fs');
const path = require('path');
const vscode = require('vscode')

function makeDirSync(dir)
{
    if (fs.existsSync(path.dirname(dir)))
        return;
    if (!fs.existsSync(path.dirname(dir))) {
        this.makeDirSync(path.dirname(dir));
    }
    fs.mkdirSync(dir);
}

function makeFolders(f)
{
    return makeDirSync(f); 
}

function returnFunctionSignature(document,ln) {

    var line = document.lineAt(ln);
    const rgMethod = /\s*(public|protected|private|static)\s(?!class)(.*)\s(.*)\((.*)\)/i;
    const methodMatch = line.text.match(rgMethod);
    let out = '';
    let args = '';
    if (methodMatch !== null ) {
        
        const name = methodMatch[3];
        const type = methodMatch[2];
        if (typeof (methodMatch[4]) != "undefined") {
            args = methodMatch[4];
        } else {
            args = '';
        }
        // let rg = RegExp('/\s/i');
        out = `${type}_${name}(${args})`.replaceAll(' ','');
    }
    return out;
}

function getProjectRoot() {
  return vscode.workspace.getWorkspaceFolder(
    vscode.window.activeTextEditor.document.uri
  ).uri.fsPath;
}

function getProjectDecompilation() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.window.activeTextEditor.document.uri,
    ).uri;
    return vscode.Uri.joinPath(curr,'\\jamalOutput\\decompilation').fsPath;
}

function getProjectDots() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.window.activeTextEditor.document.uri,
    ).uri;
    return vscode.Uri.joinPath(curr,'\\jamalOutput\\dots').fsPath;
}

function exists(file) {
    try {
        fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    makeFolders,
    returnFunctionSignature,
    getProjectRoot,
    getProjectDecompilation,
    getProjectDots,
    exists
}

