const vscode = require('vscode');
const cp = require('child_process');

const soot = vscode.workspace.getConfiguration().get('conf.soot.binary.path');
const java = vscode.workspace.getConfiguration().get('conf.java.binary.path');
const android_path = vscode.workspace.getConfiguration().get('conf.android.platforms.path');
const memLimit = vscode.workspace.getConfiguration().get('conf.java.memory.limit');

function runAnalysis(apk) {
    
    apk = apk;
    let currentFolder = vscode.workspace.workspaceFolders[0].uri;
    let outFolder = vscode.Uri.joinPath(currentFolder,'\\jamalOutput').path;
    vscode.workspace.fs.createDirectory(outFolder);
    const cmd = `"${java}" "-Xmx${memLimit}" -cp "${soot}" soot.Main -w -allow-phantom-refs -android-jars "${android_path}" -src-prec apk -d "${outFolder}" -output-format grimple -process-dir "${apk}" -process-multiple-dex`
    cp.exec(cmd, (err, stdout) => {
        console.log('\n\n' + stdout);
        if (err) {
            console.log('error: ' + err);
        }
    });
}

module.exports = {
	runAnalysis
}

