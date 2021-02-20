const p = require('path');
const ERROR_JAVA_EXIST = "No Java found in extension settings, downloading..";
const ERROR_JAVA_DOWNLOAD = "Some error happened while setting up Java, please download manually and setup extension accordingly";
const ERROR_ANDROID_DOWNLOAD = "Some error happened while downloading android-platforms, please download manually and setup extension accordingly";
const ERROR_ENGINE_DOWNLOAD = "Some error happened while downloading the analysis engine, please download manually and setup extension accordingly";
const ERROR_ANDROID_EXIST = "No android-platforms found in extension settings, downloading..";
const ERROR_ENGINE_EXIST = "No analysis engine found in extension settings, downloading..";
const FIRST_TIME_SETUP = "First time setup, please wait this may take a while";
const SETUP_COMPLETE = "Setup complete, Jamal's ready.";
const DOWNLOAD_MISSING_COMPONENT = "Downloading missing components..";
const FINISHED = "Finished, check output.";
const MANIFEST_EXTRACTED = '[+] Extracted AndroidManifest to Project folder';
const ERROR_XML_TOOL = '[-] Couldnt run XMLSource convertor';
// component links
const ANDROID_REMOTE_ADDRESS = "https://github.com/kaftejiman/android-platforms/raw/main/android-platforms.zip";
const ENGINE_REMOTE_ADDRESS = "https://github.com/kaftejiman/jamal-deps/raw/main/deps.zip";
const JAVA_REMOTE_ADDRESS = "https://github.com/kaftejiman/jamal-deps/raw/main/";
const TEST_1MB_FILE = "https://datahub.io/datahq/1mb-test/r/1mb-test_zip.zip";
const enginePath = __dirname + p.sep + 'engine';

// TODO
const SOOT_ENGINE_DEPS_CLASSPATH = `${enginePath}${p.sep}deps${p.sep}heros${p.sep}target${p.sep}classes;${enginePath}${p.sep}deps${p.sep}soot${p.sep}target${p.sep}classes;${enginePath}${p.sep}deps${p.sep}animal-sniffer-annotations-1.17.jar;${enginePath}${p.sep}deps${p.sep}ant-1.10.9.jar;${enginePath}${p.sep}deps${p.sep}ant-launcher-1.10.9.jar;${enginePath}${p.sep}deps${p.sep}asm-8.0.1.jar;${enginePath}${p.sep}deps${p.sep}asm-analysis-8.0.1.jar;${enginePath}${p.sep}deps${p.sep}asm-commons-8.0.1.jar;${enginePath}${p.sep}deps${p.sep}asm-tree-8.0.1.jar;${enginePath}${p.sep}deps${p.sep}asm-util-8.0.1.jar;${enginePath}${p.sep}deps${p.sep}axml-2.0.0.jar;${enginePath}${p.sep}deps${p.sep}byte-buddy-1.10.5.jar;${enginePath}${p.sep}deps${p.sep}byte-buddy-agent-1.10.5.jar;${enginePath}${p.sep}deps${p.sep}checker-compat-qual-2.5.2.jar;${enginePath}${p.sep}deps${p.sep}checker-qual-3.5.0.jar;${enginePath}${p.sep}deps${p.sep}com.google.guava_27.1.0.v20190517-1946.jar;${enginePath}${p.sep}deps${p.sep}commons-io-2.6.jar;${enginePath}${p.sep}deps${p.sep}dexlib2-2.4.0.jar;${enginePath}${p.sep}deps${p.sep}error_prone_annotations-2.2.0.jar;${enginePath}${p.sep}deps${p.sep}error_prone_annotations-2.3.4.jar;${enginePath}${p.sep}deps${p.sep}failureaccess-1.0.1.jar;${enginePath}${p.sep}deps${p.sep}FastInfoset-1.2.15.jar;${enginePath}${p.sep}deps${p.sep}functionaljava-4.2.jar;${enginePath}${p.sep}deps${p.sep}guava-27.1-android.jar;${enginePath}${p.sep}deps${p.sep}guava-30.1-jre.jar;${enginePath}${p.sep}deps${p.sep}hamcrest-core-1.3.jar;${enginePath}${p.sep}deps${p.sep}heros;${enginePath}${p.sep}deps${p.sep}heros-1.2.2.jar;${enginePath}${p.sep}deps${p.sep}heros.jar;${enginePath}${p.sep}deps${p.sep}istack-commons-runtime-3.0.7.jar;${enginePath}${p.sep}deps${p.sep}j2objc-annotations-1.1.jar;${enginePath}${p.sep}deps${p.sep}j2objc-annotations-1.3.jar;${enginePath}${p.sep}deps${p.sep}jasmin-3.0.2.jar;${enginePath}${p.sep}deps${p.sep}javassist-3.18.2-GA.jar;${enginePath}${p.sep}deps${p.sep}javax.activation-api-1.2.0.jar;${enginePath}${p.sep}deps${p.sep}javax.annotation-api-1.3.2.jar;${enginePath}${p.sep}deps${p.sep}java_cup-0.9.2.jar;${enginePath}${p.sep}deps${p.sep}jaxb-api-2.4.0-b180725.0427.jar;${enginePath}${p.sep}deps${p.sep}jaxb-runtime-2.4.0-b180830.0438.jar;${enginePath}${p.sep}deps${p.sep}jsr305-1.3.9.jar;${enginePath}${p.sep}deps${p.sep}jsr305-3.0.2.jar;${enginePath}${p.sep}deps${p.sep}junit-4.13.1.jar;${enginePath}${p.sep}deps${p.sep}listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar;${enginePath}${p.sep}deps${p.sep}mockito-core-3.2.4.jar;${enginePath}${p.sep}deps${p.sep}objenesis-2.6.jar;${enginePath}${p.sep}deps${p.sep}polyglot-2006.jar;${enginePath}${p.sep}deps${p.sep}slf4j-api-1.7.5.jar;${enginePath}${p.sep}deps${p.sep}slf4j-simple-1.7.5.jar;${enginePath}${p.sep}deps${p.sep}soot;${enginePath}${p.sep}deps${p.sep}stax-ex-1.8.jar;${enginePath}${p.sep}deps${p.sep}txw2-2.4.0-b180830.0438.jar;${enginePath}${p.sep}deps${p.sep}xmlpull-1.1.3.4d_b4_min.jar;`

const REQUIRED_COOL_BANNER = `
    ___                   _
   ( /                   //
    / __,  _ _ _   __,  // 
  _/_(_/(_/ / / /_(_/(_(/_ 
 //                        
(/              --Android Binary Analysis Framework--            				

`

const REGEXS = {
    rgMethod: /\s*(public|protected|private|static)\s(?!class)(.*)\s(.*)\((.*)\)/
}

module.exports = {
    REQUIRED_COOL_BANNER,
    ERROR_ANDROID_EXIST,
    ERROR_JAVA_EXIST,
    ERROR_ENGINE_EXIST,
    ERROR_JAVA_DOWNLOAD,
    ERROR_ANDROID_DOWNLOAD,
    ERROR_ENGINE_DOWNLOAD,
    FIRST_TIME_SETUP,
    DOWNLOAD_MISSING_COMPONENT,
    FINISHED,
    ENGINE_REMOTE_ADDRESS,
    ANDROID_REMOTE_ADDRESS,
    JAVA_REMOTE_ADDRESS,
    TEST_1MB_FILE,
    SOOT_ENGINE_DEPS_CLASSPATH,
    SETUP_COMPLETE,
    REGEXS,
    MANIFEST_EXTRACTED,
    ERROR_XML_TOOL
}