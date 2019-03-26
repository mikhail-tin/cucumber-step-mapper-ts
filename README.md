# vscode-cucumber-step-mapper

Simple way for find definition for step writen in gherkin.
Supported: TypeScript and JavaScript.

## Usage

1. Set cursor on the line in feature file.
2. Press Ctrl+F1 or Ctrl+Shift+P and enter: Go to step definition 

## Settings

* cucumber-step-mapper.srcPath - Relative path to step definition files, 'src' as default.
* cucumber-step-mapper.typeOfSrc - Type of a project (javascript or typescript), 'typescript' as default.

## Publishing Extension

Install
> npm install -g vsce

Open folder
> cd myExtension

Package
> vsce package

## License

MIT © Mikhail Tin