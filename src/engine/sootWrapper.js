const vscode = require('vscode');
const cp = require('child_process');
const u = require('../utils');
const java = vscode.workspace.getConfiguration().get('conf.java.binary.path');
const android_path = vscode.workspace.getConfiguration().get('conf.android.platforms.path');
const memLimit = vscode.workspace.getConfiguration().get('conf.java.memory.limit');


function runAnalysis(apk) {
    
    let enginePath = __dirname;
    let currentFolder = vscode.workspace.workspaceFolders[0].uri;
    let outFolder = vscode.Uri.joinPath(currentFolder,'\\jamalOutput').fsPath;
    u.makeFolders(outFolder);
    
    // fixme I am ugly
    const soot = `${enginePath}\\deps\\heros\\target\\classes;${enginePath}\\deps\\soot\\target\\classes;${enginePath}\\deps\\animal-sniffer-annotations-1.17.jar;${enginePath}\\deps\\ant-1.10.9.jar;${enginePath}\\deps\\ant-launcher-1.10.9.jar;${enginePath}\\deps\\asm-8.0.1.jar;${enginePath}\\deps\\asm-analysis-8.0.1.jar;${enginePath}\\deps\\asm-commons-8.0.1.jar;${enginePath}\\deps\\asm-tree-8.0.1.jar;${enginePath}\\deps\\asm-util-8.0.1.jar;${enginePath}\\deps\\axml-2.0.0.jar;${enginePath}\\deps\\byte-buddy-1.10.5.jar;${enginePath}\\deps\\byte-buddy-agent-1.10.5.jar;${enginePath}\\deps\\checker-compat-qual-2.5.2.jar;${enginePath}\\deps\\checker-qual-3.5.0.jar;${enginePath}\\deps\\com.google.guava_27.1.0.v20190517-1946.jar;${enginePath}\\deps\\commons-io-2.6.jar;${enginePath}\\deps\\dexlib2-2.4.0.jar;${enginePath}\\deps\\error_prone_annotations-2.2.0.jar;${enginePath}\\deps\\error_prone_annotations-2.3.4.jar;${enginePath}\\deps\\failureaccess-1.0.1.jar;${enginePath}\\deps\\FastInfoset-1.2.15.jar;${enginePath}\\deps\\functionaljava-4.2.jar;${enginePath}\\deps\\guava-27.1-android.jar;${enginePath}\\deps\\guava-30.1-jre.jar;${enginePath}\\deps\\hamcrest-core-1.3.jar;${enginePath}\\deps\\heros;${enginePath}\\deps\\heros-1.2.2.jar;${enginePath}\\deps\\heros.jar;${enginePath}\\deps\\istack-commons-runtime-3.0.7.jar;${enginePath}\\deps\\j2objc-annotations-1.1.jar;${enginePath}\\deps\\j2objc-annotations-1.3.jar;${enginePath}\\deps\\jasmin-3.0.2.jar;${enginePath}\\deps\\javassist-3.18.2-GA.jar;${enginePath}\\deps\\javax.activation-api-1.2.0.jar;${enginePath}\\deps\\javax.annotation-api-1.3.2.jar;${enginePath}\\deps\\java_cup-0.9.2.jar;${enginePath}\\deps\\jaxb-api-2.4.0-b180725.0427.jar;${enginePath}\\deps\\jaxb-runtime-2.4.0-b180830.0438.jar;${enginePath}\\deps\\jsr305-1.3.9.jar;${enginePath}\\deps\\jsr305-3.0.2.jar;${enginePath}\\deps\\junit-4.13.1.jar;${enginePath}\\deps\\listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar;${enginePath}\\deps\\mockito-core-3.2.4.jar;${enginePath}\\deps\\objenesis-2.6.jar;${enginePath}\\deps\\polyglot-2006.jar;${enginePath}\\deps\\slf4j-api-1.7.5.jar;${enginePath}\\deps\\slf4j-simple-1.7.5.jar;${enginePath}\\deps\\soot;${enginePath}\\deps\\stax-ex-1.8.jar;${enginePath}\\deps\\txw2-2.4.0-b180830.0438.jar;${enginePath}\\deps\\xmlpull-1.1.3.4d_b4_min.jar;`

    const cmd = `"${java}" "-Xmx${memLimit}" -cp "${soot}" soot.tools.CFGViewer -w -allow-phantom-refs -android-jars "${android_path}" -src-prec apk -d "${outFolder}" -output-format grimple -process-dir "${apk}" -process-multiple-dex`
    console.log(cmd);

    var engine = cp.exec(cmd, (err, stdout) => {
        console.log('\n' + stdout);
        if (err) {
            console.log('error: ' + err);
        }
    });
    
    engine.on('exit', function () {
        vscode.window.showInformationMessage('Finished, check output for more details.');

    });

}

module.exports = {
	runAnalysis
}

