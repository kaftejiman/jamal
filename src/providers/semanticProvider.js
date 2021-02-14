"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var tokenTypes = ['class', 'interface', 'enum', 'function', 'variable'];
var tokenModifiers = ['declaration', 'documentation'];
var legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

function registerSemanticProvider() {
    var provider = {
        provideDocumentSemanticTokens: function (document) {
            // analyze the document and return semantic tokens
            var tokensBuilder = new vscode.SemanticTokensBuilder(legend);
            // on line 1, characters 1-5 are a class declaration
            tokensBuilder.push(new vscode.Range(new vscode.Position(1, 1), new vscode.Position(1, 5)), 'class', ['declaration']);
            return tokensBuilder.build();
        }
    };

    var selector = [
        { language: 'jimple', scheme: 'file' },
        { language: 'grimple', scheme: 'file' },
        { language: 'jimple', scheme: 'untitled' },
        { language: 'grimple', scheme: 'untitled' },
    ];

    return vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend);
}

module.exports = { registerSemanticProvider };