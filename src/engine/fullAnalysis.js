const vscode = require('vscode');
const constants = require('../constants');
const cp = require('child_process');
const utils = require('../utils');

function runFullAnalysis(apk,outFolder) {
    const cmd = `"${utils.javaPath}" "-Xmx${utils.memLimit}" -cp "${constants.SOOT_ENGINE_DEPS_CLASSPATH}" soot.tools.CFGViewer -w -allow-phantom-refs -android-jars "${utils.androidPath}" -src-prec apk -d "${outFolder}" -output-format grimple -process-dir "${apk}" -process-multiple-dex`
    
    var engine = cp.exec(cmd, (err, stdout, stderr) => {

        utils.output.appendLine('\n' + stdout);
        
        if (err) {
            utils.output.appendLine('[-] ' + err + ' : ' + stderr);
            return;
        }
        
        // TODO: dont generate summary if command fails, ugly hack for now
        if (stdout.search(/Ouuups\.\.\./i) != -1) {
            utils.output.appendLine('[-] Error running engine.');
            return;
        }

        utils.generateSummary(apk, outFolder);
    });

    engine.on('error',function() {
        return;        
    })
    engine.on('exit', function () {
        vscode.window.showInformationMessage(constants.FINISHED);
    });
}

module.exports = {
    runFullAnalysis
}