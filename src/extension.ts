'use strict';
import * as vscode from 'vscode';
import {GetListOfFiles, GetStepDef, IStepDef} from './fs';
import {ConfigManager} from './configManager'

export function activate(context: vscode.ExtensionContext) {
    let steps: IStepDef[] = [];
    let config = new ConfigManager();

    let fillStore = () => steps = GetStepDef(GetListOfFiles(config.pathToSrc));

    fillStore();

    let goToDef = vscode.commands.registerCommand('extension.goToDef', async () => {
        let step = vscode.window.activeTextEditor.document.lineAt(vscode.window.activeTextEditor.selection.active.line).text.trim();
        let result = steps.find((elem) => { return step.search(elem.regex) >= 0; });
        let document = await vscode.workspace.openTextDocument(result.file);
        let textEditor = await vscode.window.showTextDocument(document);
        await vscode.commands.executeCommand('revealLine', {lineNumber: result.line, at: 'top'});
    });

    let updateStore = vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) =>  {
        if (textDocument.languageId == config.typeOfSrc) {
            fillStore();
        }
    });

    context.subscriptions.push(goToDef);
    context.subscriptions.push(updateStore)
}