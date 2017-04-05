'use strict';
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

export function activate(context: vscode.ExtensionContext) {
    let steps: IMember[] = [];
    let listOfFiles = [];

    let fillStore = () => {
        steps = [];
        listOfFiles = [];
        let getAllFiles = function(myPath) {
            if( fs.existsSync(myPath) ) {
                fs.readdirSync(myPath).forEach(function(file,index) {
                    let curPath = myPath + "/" + file;
                    if(fs.lstatSync(curPath).isDirectory()) { 
                        getAllFiles(curPath);
                    } else { 
                        if( path.extname(curPath) == '.ts'){
                            listOfFiles.push(curPath);
                        }
                    }
                });
            }
        };
    
        getAllFiles(path.join(vscode.workspace.rootPath, 'src'));

        listOfFiles.forEach((file)=>{
            let lines = fs.readFileSync(file).toString().split("\n");
            lines.forEach((i, line)=>{
                if (i.indexOf('(/^') >= 0) {
                    steps.push({
                        regex: i.substring(i.indexOf('(/^')+3, i.indexOf('$/,')),
                        file: file,
                        line: line
                    });
                }
            })
        });
    }

    fillStore();

    let goToDef = vscode.commands.registerCommand('extension.goToDef', async () => {
        let step = vscode.window.activeTextEditor.document.lineAt(vscode.window.activeTextEditor.selection.active.line).text.trim();
        let result = steps.find((elem) => {return step.search(elem.regex)>= 0;});
        let document = await vscode.workspace.openTextDocument(result.file);
        let textEditor = await vscode.window.showTextDocument(document);
        let position = new vscode.Position(result.line, 0);
        let position2 = new vscode.Position(result.line+1, 0);
        let range = new vscode.Range(position, position2);
        await textEditor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
        vscode.window.setStatusBarMessage('Go to step definition: ' + step);
    });

    let updateStore = vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) => {
        fillStore();
    });

    context.subscriptions.push(goToDef);

    context.subscriptions.push(updateStore)
}

export interface IMember {
    regex: string;
    file: string;
    line: number;
}