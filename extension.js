
const vscode = require('vscode');
const engine = require('./sootWrapper')

async function activate(context) {
	
	let cfg = vscode.commands.registerCommand('jamal.previewcfg',function (){
		vscode.window.showInformationMessage('Dummy cfg');
	});
	
	let dfg = vscode.commands.registerCommand('jamal.previewdfg',function (){
		vscode.window.showInformationMessage('Dummy dfg');
	});

	let analysis = vscode.commands.registerCommand('jamal.runAnalysis', async (folder) => {

		vscode.window.showInformationMessage('Running..');
		let newUri = folder;
		if (!folder) {                      
			await vscode.commands.executeCommand('copyFilePath');
			folder = await vscode.env.clipboard.readText();  
			newUri = await vscode.Uri.file(folder);
		}
		//console.log(newUri);
		
		engine.runAnalysis(newUri.path);
		
	});

	context.subscriptions.push(cfg,dfg,analysis);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
