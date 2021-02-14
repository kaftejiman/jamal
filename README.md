# Jamal (Just Another Mobile Analysis Layer)

Visual Studio Code extension for aiding in android mobile application analysis.

Jamal is mainly a wrapper around a *slightly* modified [Soot Framework](https://github.com/soot-oss/soot) with extra rendering for recovering Control Flow.

Given an android application `APK file`, Jamal aids in decompilation and static analysis by producing `Grimple files` which are an aggregated version of a typed `3-address intermediate representation` suitable for code inspection.

*Please report any bugs you encounter.*

## Architecture

![architecture](assets/architecture.drawio.svg)

## Quick Start

1. Start new project
2. Right click on the desired APK file, as an example I am using the [Oversecured Vulnerable Android App](https://github.com/oversecured/ovaa) select `Run analysis`.
3. Wait for soot engine to finish decompilation and analysis.
4. Result will be generated in `jamalOutput` folder in your current workspace.

![quickstart](assets/quickstart.gif)

## Features

### Syntactic and Semantic support for Soot IR

![grammar](assets/sootIR_jimple_syntax.png)

### Dynamic Control Flow inspection 

![grammar](assets/cfg.png)

### Graphviz Dot Representation 

![grammar](assets/dot.png)

Exportable dot representation of the recovered Control Flow Graph.

## Known issues

Jamal can run out of memory when analysing big APK files, please allocate more memory for the JVM from the extension settings.

## Requirements

Jamal depends on:
* [Java](https://www.oracle.com/java/technologies/javase/jdk15-archive-downloads.html)
* [Android Platforms](https://github.com/Sable/android-platforms)
* [tintinweb Interactive Graphviz](https://github.com/tintinweb/vscode-interactive-graphviz)

## Extension Settings

This extension contributes the following settings:

You can execute it by entering the following command at the command palette Ctrl+Shift+P (Cmd+Shift+P on MacOS).

|            Name             |                      Description                       |
| :-------------------------: | :----------------------------------------------------: |
|    conf.java.binary.path    |              Path to the java executable.              |
|   conf.java.memory.limit    | Maximum memory allocated to the JVM for soot analysis. |
| conf.android.platforms.path |               Path to android platforms.               |


* `explorer/context`: contributes jamal.runAnalysis, jamal.previewcfg.
* `editor/context`  : contributes jamal.previewcfg.

## Release Notes

### 0.1.1

* Added limited support for CFG navigation (still needs work)
* Included slightly modified soot component
* Added very basic semantics/symbols providers
  
### 0.1.0

* Initial release of Jamal as an MVP (minimal viable product)

