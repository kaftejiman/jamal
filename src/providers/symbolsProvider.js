var vscode = require("vscode");

function registerSymbolsProvider() {
	var SootDocumentSymbolProvider = (function () {
		function SootDocumentSymbolProvider() {
		}
		SootDocumentSymbolProvider.prototype.provideDocumentSymbols = function (document, token) {
			return new Promise(function (resolve, reject) {
            
				// parse 
				var symbols = [];
				for (var j = 0; j < document.lineCount; j++) {
					var line = document.lineAt(j);
					// lazy, parse methods
					const rgMethod = /\s*(public|protected|private)\s(?!class)(.*)\s(.*)\(/i;
					const methodMatch = line.text.match(rgMethod);
										
					if (methodMatch !== null ) {
						symbols.push({
							name: methodMatch[3],
							kind: vscode.SymbolKind.Function,
							location: new vscode.Location(document.uri, line.range)
						});
					}
					
				}
				resolve(symbols);
			
            
			});
		};
		return SootDocumentSymbolProvider;
	}());
    

	return vscode.languages.registerDocumentSymbolProvider	({ language: "soot" }, new SootDocumentSymbolProvider());
}

module.exports = { registerSymbolsProvider };
