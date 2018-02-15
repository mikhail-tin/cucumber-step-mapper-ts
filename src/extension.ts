'use strict';
import {ExtensionContext, commands, window, workspace, TextDocument} from 'vscode';
import {TextEditor, Range, Position, TextEditorRevealType, Selection} from 'vscode';
import {GetListOfFiles, GetStepDef, IStepDef} from './fs';
import {ConfigManager} from './configManager'

export function activate(context: ExtensionContext) {
    let steps: IStepDef[] = [];
    let config = new ConfigManager();
    let fillStore = () => steps = GetStepDef(GetListOfFiles(config.pathToSrc, config.fileExtension));
    fillStore();

    let goToDef = commands.registerCommand('extension.goToDef', async () => {
        let step = window.activeTextEditor.document.lineAt(window.activeTextEditor.selection.active.line).text.trim();
        if (step.indexOf("hen ") < 0 && step.indexOf("And") < 0 && step.indexOf("But") < 0) {
            window.setStatusBarMessage(`Cucumber-mapper: "${step}" doesn't look like a step.`, 5000);
            return;
        }
        step = step.replace('Given', '').replace('When', '').replace('Then', '').replace('And', '').replace('But', '').trim();
        let result = steps.find((elem) => { 
            return step.search(elem.regex) >= 0; 
        });
        if (!result) {
            window.setStatusBarMessage(`Cucumber-mapper: Step "${step}" was not found.`, 5000);
            return;
        }
        let document = await workspace.openTextDocument(result.file);
        let textEditor = await window.showTextDocument(document);
        await scrollToNewPositon(textEditor, result.line);
    });

    let updateStore = workspace.onDidSaveTextDocument((td: TextDocument) => (td.languageId == config.typeOfSrc) && fillStore() );

    context.subscriptions.push(goToDef);
    context.subscriptions.push(updateStore)
}

let scrollToNewPositon = async (textEditor: TextEditor, line: number): Promise<void> => {
    let pos = new Position(line, 0);
    await textEditor.revealRange(new Range(pos, pos), TextEditorRevealType.InCenterIfOutsideViewport);
    window.activeTextEditor.selection = new Selection(pos.with(pos.line, 0), pos.with(pos.line, 0));
}