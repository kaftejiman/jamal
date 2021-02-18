const vscode = require('vscode');
const constants = require('../constants');
const cp = require('child_process');
const utils = require('../utils');


function runFullAnalysis(apk,outFolder) {
    const cmd = `"${utils.javaPath}" "-Xmx${utils.memLimit}" -cp "${constants.SOOT_ENGINE_DEPS_CLASSPATH}" soot.tools.CFGViewer -w -allow-phantom-refs -android-jars "${utils.androidPath}" -src-prec apk -d "${outFolder}" -output-format grimple -process-dir "${apk}" -process-multiple-dex`
    
    var engine = cp.exec(cmd, (err, stdout) => {
        utils.output.appendLine('\n' + stdout);
        if (err) {
            utils.output.appendLine('[-] ' + err);
        }
    });
    engine.on('exit', function () {
        utils.generateSummary(apk, outFolder);
        vscode.window.showInformationMessage(constants.FINISHED);
    });
}

module.exports = {
    runFullAnalysis
}