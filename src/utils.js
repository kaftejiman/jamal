const fetchFile = require('@particle/fetch-file');
const crypto = require('crypto');
const vscode = require('vscode');
const os = require('os');
const fs = require('fs');
const p = require('path');
const constants = require('./constants');
const decompress = require('decompress');
const StreamZip = require('node-stream-zip');
const cp = require('child_process');
let conf = vscode.workspace.getConfiguration();
let javaPath = conf.get('conf.java.binary.path');
let androidPath = conf.get('conf.android.platforms.path');
let engineClasspathPath = conf.get("conf.engine.deps.path");
const androidPath_ = __dirname + p.sep + 'engine' + p.sep + 'android-platforms';
let memLimit = conf.get('conf.java.memory.limit');
const enginePath = __dirname + p.sep + 'engine';
const toolsPath = __dirname + p.sep + 'tools';
const depsPath = __dirname + p.sep + 'engine' + p.sep + 'deps';
let ext = '';
let output = vscode.window.createOutputChannel("Jamal");


// setup global os agnostic configs
if (os.platform() === "win32") {
    ext = '.exe';
} else if(os.platform() === "linux") {
    ext = '';
} else {
    ext = null;
}

function needSetup() {
    
    javaPath = conf.get('conf.java.binary.path');
    androidPath = conf.get('conf.android.platforms.path');
    engineClasspathPath = conf.get("conf.engine.deps.path");
    
    if (javaPath == '' || androidPath == '' || engineClasspathPath == '')
        return true;
    return false;
}

// for identifying dot files 
function returnFunctionSignature(document,ln) {
    let line = document.lineAt(ln);
    const methodMatch = line.text.match(constants.REGEXS.rgMethod);
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
        out = `${type}_${name}(${args})`.replaceAll(' ','');
    }
    return out;
}

function getShaSum(filename) {
    let algorithm = 'sha1';
    let shasum = crypto.createHash(algorithm);
    s = fs.ReadStream(filename)
    s.on('data', function(data) {
        shasum.update(data)
    })
    s.on('end', function() {
        var hash = shasum.digest('hex');
        return hash;
    })
}

function getFilesizeInMegaBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes / (1024*1024);
}

function getFilesInDir(directory) {
    return fs.readdirSync(directory);
}

function getProjectRootUri() {
  return vscode.workspace.workspaceFolders[0].uri;
}

function getProjectDecompilation() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.workspace.workspaceFolders[0].uri,
    ).uri;
    return vscode.Uri.joinPath(curr, p.sep + 'jamalOutput' + p.sep + 'decompiled').fsPath;
}

function getProjectLibs() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.workspace.workspaceFolders[0].uri,
    ).uri;
    return vscode.Uri.joinPath(curr, p.sep + 'jamalOutput' + p.sep + 'libs').fsPath;
}

function getProjectTaint() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.workspace.workspaceFolders[0].uri,
    ).uri;
    return vscode.Uri.joinPath(curr, p.sep + 'jamalOutput' + p.sep + 'taint_analysis').fsPath;
}

function getProjectDebug() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.workspace.workspaceFolders[0].uri,
    ).uri;
    return vscode.Uri.joinPath(curr, p.sep + 'jamalOutput' + p.sep + 'debug').fsPath;
}

function getProjectDots() {
    let curr = vscode.workspace.getWorkspaceFolder(
        vscode.workspace.workspaceFolders[0].uri,
    ).uri;
    return vscode.Uri.joinPath(curr, p.sep + 'jamalOutput' + p.sep + 'dots' ).fsPath;
}

function getProjectTools() {
    return toolsPath;
}

function getXMLPrinter() {
    return toolsPath + p.sep + 'axmlprinter.jar';
}

function getTimeNow() {
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    return `at [${day}/${month}/${year} - ${hours}:${minutes}:${seconds}]`;
}

function parseLibs(apk, outFolder) {
    
    files = getFilesInDir(getProjectLibs());
    files.forEach(element => {
        // parse lib
    });
    return "some lib meta data";
}

async function extractLibs(apk) {
    return new Promise(async () => {
        
        makeFolder(getProjectLibs());
        const zip = new StreamZip.async({ file: apk });
        await zip.extract('lib/', getProjectLibs());
        await zip.close();
    })
}

function extractManifest(apk, outFolder) {    
    return new Promise(async () => {

        const zip = new StreamZip.async({ file: apk });
        const data = await zip.entryData('AndroidManifest.xml');
        await zip.close();
        let xmlReader = getXMLPrinter();
        let xmlBak = outFolder + p.sep + 'AndroidManifest.xml.bak';
        makeFile(xmlBak, data, function(){});
        cp.exec(`${javaPath} -jar ${xmlReader} ${xmlBak} `, (err, stdout) => {
            let xmlManifest = outFolder + p.sep + 'AndroidManifest.xml';
            makeFile(xmlManifest, stdout, function () {
                output.appendLine(constants.MANIFEST_EXTRACTED);
            });
            if (err) {
                output.appendLine(constants.ERROR_XML_TOOL);
            }
        });
    })
}

function parseManifest(manifestFile) {
    return "some manifest data";
}

function generateSummary(apk,outFolder) {
    let sApk = p.basename(apk);
    let sSize = getFilesizeInMegaBytes(apk).toPrecision(3);
    let sSum = getShaSum(apk);
    let sDecFn = getFilesInDir(getProjectDots()).length;
    let sParsedF = getFilesInDir(getProjectDecompilation()).length;
    let date = getTimeNow();
    //let summaryManifest = '';
    

    /*extractManifest(apk, outFolder).then(
        () => {
            summaryManifest = parseManifest(outFolder + p.sep + 'AndroidManifest.xml');
        }
    );*/    

    extractLibs(apk).then(
        () => {
            output.appendLine("[+] Found native libs, extracted to project folder..");
        }
    ); 

    let template = `
                        === Summary ===

    ${date}
    Filename                   : ${sApk}
    File size                  : ${sSize} mb
    md5sum                     : ${sSum}
    Total parsed files         : ${sParsedF}
    Total decompiled functions : ${sDecFn} 
    ` //     Android Manifest Summary   : ${summaryManifest}

    let summPath = outFolder + p.sep + 'summary.txt';
    makeFile(summPath, template, function () {
        output.appendLine("[+] Created summary file");
    });
    
    // show in editor as active window
    const sumUri = vscode.Uri.file(summPath);
    vscode.window.showTextDocument(sumUri);

    return;
}


// file exists and accessible?
function exists(file) {
    try {
        fs.accessSync(file, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (err) {
        return false;
    }
}

function makeFile(file, content, callback) {
    fs.writeFile(file, content, callback);
}

function makeFolder(dir){
    if (fs.existsSync(p.dirname(dir)))
        return;
    if (!fs.existsSync(p.dirname(dir))) {
        this.makeDirSync(p.dirname(dir));
    }
    fs.mkdirSync(dir);
}

// for downloading missing components
// requirements: archive .zip
const promiseDownloadUnpack = (url, dest) => {
    return new Promise(() => {
        
        const onProgress = () => {
            output.append(".");
        }
        let component = p.basename(url);
        dest = dest + p.sep + component;
        fetchFile(url, dest, { onProgress, interval: 4000 }).then(
            () => {
                decompress(dest, dest.replace('.zip', '')).then( () => {
                    output.appendLine(`\n[*] Installed ${component.replace('.zip','')}`);
                });
            });
    });
}

function ensureJava() {
    if (javaPath == '') {
            
        // download java from kaftejiman repo according to current os configs
        let file = '';
        vscode.window.showInformationMessage(constants.ERROR_JAVA_EXIST);
        switch (os.platform()) {
            case 'win32':
                switch (os.arch()) {
                    case 'x64':
                        file = `java-win-64.zip`;
                        break;
                    case 'x32':
                        file = `java-win-32.zip`;
                        break;
                    default:
                        vscode.window.showInformationMessage(constants.JAVA_DOWNLOAD_ERROR);
                        return;
                }
                break;
            case 'linux':
                switch (os.arch()) {
                    case 'x64':
                        file = `java-linux-64.zip`;
                        break;
                    case 'x32':
                        file = `java-linux-32.zip`;
                        break;
                    default:
                        vscode.window.showInformationMessage(constants.ERROR_JAVA_DOWNLOAD);
                        return;
                }
                break;
            default:
                vscode.window.showInformationMessage(constants.ERROR_JAVA_DOWNLOAD);
                
        }
        let javaLocalPath = __dirname + p.sep + 'engine' + p.sep + 'java';
        let javaRemoteAddress = constants.JAVA_REMOTE_ADDRESS + file;
        let javaComponentName = p.basename(javaRemoteAddress).replace('.zip', '');
        let javaBinaryPath = __dirname + p.sep + 'engine' + p.sep + 'java' + p.sep + javaComponentName + p.sep + 'bin' + p.sep + 'java' + ext;

        const promiseJavaFound = new Promise(() => {
            if (exists(javaBinaryPath)) {
                conf.update('conf.java.binary.path', javaBinaryPath);
            } else {
                vscode.window.showInformationMessage(constants.ERROR_JAVA_DOWNLOAD);
            }
        });

        promiseDownloadUnpack(javaRemoteAddress, javaLocalPath).then(() => {
            promiseJavaFound
        });

    }
    
}

function ensureAndroids() {
    if (androidPath == '') { 
        vscode.window.showInformationMessage(constants.ERROR_ANDROID_EXIST);

        const promiseAndroidFound = new Promise(() => {
            if (fs.existsSync(androidPath_)) {
                conf.update('conf.android.platforms.path', androidPath_);
            } else {
                vscode.window.showInformationMessage(constants.ERROR_ANDROID_DOWNLOAD);
            }
        });
        
        promiseDownloadUnpack(constants.ANDROID_REMOTE_ADDRESS, enginePath).then(() => {
            promiseAndroidFound
        });
    }
}

function ensureEngine() {
    if (engineClasspathPath == '') {   
        vscode.window.showInformationMessage(constants.ERROR_ENGINE_EXIST);

        const promiseEngineFound = new Promise(() => {
            if (fs.existsSync(depsPath)) {
                conf.update('conf.engine.deps.path', depsPath);
            } else {
                vscode.window.showInformationMessage(constants.ERROR_ENGINE_DOWNLOAD);
            }
        });
        
        // constants.ANDROID_REMOTE_ADDRESS
        promiseDownloadUnpack(constants.ENGINE_REMOTE_ADDRESS, enginePath).then(() => {
            promiseEngineFound
        });
    }
}

function sanityChecks(){
        
    let msg = '';

    if (androidPath == '' && engineClasspathPath == '' && javaPath == '')
        msg = constants.FIRST_TIME_SETUP;
    if (androidPath == '' || engineClasspathPath == '' || javaPath == '')
        msg = constants.DOWNLOAD_MISSING_COMPONENT;  

    if (needSetup()) {
        vscode.window.showInformationMessage(msg);
        
        const promiseEnsureJava = new Promise(() => {
            ensureJava()
        });
        const promiseEnsureEngine = new Promise(() => {
            ensureEngine();
        });
        const promiseEnsureAndroid = new Promise(() => {
            ensureAndroids();
        });

        promiseEnsureJava.then(
            promiseEnsureAndroid.then(
                promiseEnsureEngine.then(() => {
                        vscode.window.showInformationMessage(constants.SETUP_COMPLETE);
                    }
                )
            )
        );

        output.append('[*] Setting up..');
    }
}

module.exports = {
    output,
    needSetup,
    javaPath,
    androidPath,
    memLimit,
    makeFolder,
    returnFunctionSignature,
    getProjectRootUri,
    getProjectDecompilation,
    getProjectDots,
    getProjectDebug,
    getProjectLibs,
    getProjectTaint,
    getProjectTools,
    exists,
    sanityChecks,
    generateSummary
}

