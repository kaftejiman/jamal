const vscode = require('vscode');
const engine = require('./engine/sootWrapper');
const pSymbols = require('./providers/symbolsProvider');
const pSemantics = require('./providers/semanticProvider');
const graphs = require('./graphs/cfg');
const utils = require('./utils');
const constants = require('./constants');

function activate(context) {
	
	// setup output
	utils.output.show();
	utils.output.append(constants.REQUIRED_COOL_BANNER);

	
	// register providers
	let smProvider = pSemantics.registerSemanticProvider();
	let syProvider = pSymbols.registerSymbolsProvider();

	// register CFG preview component
	let cfg = vscode.commands.registerCommand('jamal.previewcfg',function (){
		graphs.drawGraph();
	});

	// register engine analyzer component
	let analysis = vscode.commands.registerCommand('jamal.runAnalysis', async (folder) => {	
		utils.sanityChecks();
		engine.runAnalysis(folder);
	});
	
	context.subscriptions.push(cfg, analysis, smProvider, syProvider);

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
