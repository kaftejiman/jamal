# JAMAL (Just Anoth Mobile Analysis Layer)

Visual Studio Code extension for aiding in android mobile analysis.

Jamal is mainly a wrapper around [Soot Framework](https://github.com/soot-oss/soot) with extra rendering for recovering Control Flow.

Given an android application `APK file`, Jamal produces Grimple files which are an aggregated version of a typed 3-address intermediate representation suitable for decompilation and code inspection.

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

### Syntactic support for Soot IR

![grammar](assets/sootIR_jimple_syntax.png)

### Graphviz Dot Representation 

Exportable dot representation for the recovered Control Flow Graph and Data Flow Graph.

## Known issues

Jamal can run out of memory when analysing big APK files, please allocate more memory for the JVM from the extension settings.

## Requirements

Jamal depends on:
* [Java](https://www.oracle.com/java/technologies/javase/jdk15-archive-downloads.html)
* [Soot jar component](https://repo1.maven.org/maven2/org/soot-oss/soot/4.2.1/soot-4.2.1-jar-with-dependencies.jar)
* [Android Platforms](https://github.com/Sable/android-platforms)

## Extension Settings

This extension contributes the following settings:

You can execute it by entering the following command at the command palette Ctrl+Shift+P (Cmd+Shift+P on MacOS).

| Name                        | Description                                            |
| :--------------------------:|:------------------------------------------------------:|
| conf.soot.binary.path       | Path to the Soot jar binary.                           |
| conf.java.binary.path       | Path to the java executable.                           |
| conf.java.memory.limit      | Maximum memory allocated to the JVM for soot analysis. |
| conf.android.platforms.path | Path to android platforms.                             |


* `explorer/context`: contributes jamal.runAnalysis, jamal.previewcfg and jamal.previewdfg.
* `editor/context`  : contributes jamal.previewcfg and jamal.previewdfg.

## Release Notes

### 0.1.0

Initial release of Jamal as an MVP (minimal viable product)

