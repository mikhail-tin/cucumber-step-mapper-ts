'use strict';
import {ExtensionContext, commands, window, workspace, TextDocument} from 'vscode';
import {TextEditor, Range, Position, TextEditorRevealType, Selection} from 'vscode';
import {GetListOfFiles, GetStepDef, IStepDef} from './fs';
import {ConfigManager} from './configManager';
const steps: string[] = ['Given','When','Then','And','But'];

export function activate(context: ExtensionContext) {
    let steps: IStepDef[] = [];
    let config = new ConfigManager();
    let fillStore = () => steps = GetStepDef(GetListOfFiles(config.pathToSrc, config.fileExtension));
    fillStore();

    let goToDef = commands.registerCommand('extension.goToDef', async () => {
        let step = window.activeTextEditor.document.lineAt(window.activeTextEditor.selection.active.line).text.trim();
        if (!isStep(step)) {
            sendMsgToStatusBar(`Cucumber-mapper: "${step}" doesn't look like a step.`);
            return;
        }
        step = extractStep(step);
        let result = steps.find((elem) => { return step.search(elem.regex) >= 0; });
        if (!result) {
            sendMsgToStatusBar(`Cucumber-mapper: Step "${step}" was not found.`);
            return;
        }

        await scrollToNewPositon(result);
    });

    let updateStore = workspace.onDidSaveTextDocument((td: TextDocument) => {
        if (td.languageId == config.typeOfSrc && config.pathToSrc.filter(x => td.fileName.indexOf(x) >= 0).length > 0) 
            fillStore() 
        });

    context.subscriptions.push(goToDef);
    context.subscriptions.push(updateStore)
}

let isStep = step => step.indexOf("en ") >= 0 || step.indexOf("And ") >= 0 || step.indexOf("But ") >= 0;
let extractStep = step => step.replace('Given', '').replace('When', '').replace('Then', '').replace('And', '').replace('But', '').trim();
let sendMsgToStatusBar = msg => window.setStatusBarMessage(`Cucumber-mapper: ${msg}.`, 5000);
let scrollToNewPositon = async (result: IStepDef): Promise<void> => {
    let document = await workspace.openTextDocument(result.file);
    let textEditor = await window.showTextDocument(document);
    let pos = new Position(result.line, 0);
    await textEditor.revealRange(new Range(pos, pos), TextEditorRevealType.InCenterIfOutsideViewport);
    window.activeTextEditor.selection = new Selection(pos.with(pos.line, 0), pos.with(pos.line, 0));
};