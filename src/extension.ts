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

        let position = new vscode.Position(result.line, 0); // TODO: it is work unexpected
        let position2 = new vscode.Position(result.line+1, 0);
        let range = new vscode.Range(position, position2);
        await textEditor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
    });

    let updateStore = vscode.workspace.onDidSaveTextDocument((textDocument: vscode.TextDocument) =>  {
        if (textDocument.languageId == config.typeOfSrc) {
            fillStore();
        }
    });

    context.subscriptions.push(goToDef);
    context.subscriptions.push(updateStore)
}