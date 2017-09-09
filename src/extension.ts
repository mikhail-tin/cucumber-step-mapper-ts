'use strict';
import {ExtensionContext, commands, window, workspace, TextDocument} from 'vscode';
import {TextEditor, Range, Position, TextEditorRevealType, Selection} from 'vscode';
import {GetListOfFiles, GetStepDef, IStepDef} from './fs';
import {ConfigManager} from './configManager'

export function activate(context: ExtensionContext) {
    let steps: IStepDef[] = [];
    let config = new ConfigManager();
    let fillStore = () => steps = GetStepDef(GetListOfFiles(config.pathToSrc));

    fillStore();

    let goToDef = commands.registerCommand('extension.goToDef', async () => {
        let step = window.activeTextEditor.document.lineAt(window.activeTextEditor.selection.active.line).text.trim();
        if (step.indexOf("en ") < 0) {
            return;
        }
        let result = steps.find((elem) => { return step.search(elem.regex) >= 0; });
        let document = await workspace.openTextDocument(result.file);
        let textEditor = await window.showTextDocument(document);
        await scrollToNewPositon(textEditor, result.line);
    });

    let updateStore = workspace.onDidSaveTextDocument((textDocument: TextDocument) =>  {
        if (textDocument.languageId == config.typeOfSrc) {
            fillStore();
        }
    });

    context.subscriptions.push(goToDef);
    context.subscriptions.push(updateStore)
}

let scrollToNewPositon = async (textEditor: TextEditor, line: number): Promise<void> => {
    let position = new Position(line, 0);
    let range = new Range(position, position);
    await textEditor.revealRange(range, TextEditorRevealType.InCenterIfOutsideViewport);
    let newPosition = position.with(position.line, 0);
    let newSelection = new Selection(newPosition, newPosition);
    window.activeTextEditor.selection = newSelection;
}