const vscode = require('vscode');
const engine = require('./engine/sootWrapper');
const pSymbols = require('./providers/symbolsProvider');
const pSemantics = require('./providers/semanticProvider');
const graphs = require('./graphs/cfg')

async function activate(context) {
	

	// init
	
	let smProvider = pSemantics.registerSemanticProvider();
	let syProvider = pSymbols.registerSymbolsProvider();

	let cfg = vscode.commands.registerCommand('jamal.previewcfg',function (){
		graphs.drawGraph(vscode.commands);
	});

	let dfg = vscode.commands.registerCommand('jamal.previewdfg',function (){
		// todo
	});

	let analysis = vscode.commands.registerCommand('jamal.runAnalysis', async (folder) => {

		vscode.window.showInformationMessage('Running..');
		let newUri = folder;
		if (!folder) {                      
			await vscode.commands.executeCommand('copyFilePath');
			folder = await vscode.env.clipboard.readText();  
			newUri = vscode.Uri.file(folder);
		}
		
		engine.runAnalysis(newUri.fsPath);
		
	});

	context.subscriptions.push(cfg,dfg,analysis,smProvider,syProvider);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
