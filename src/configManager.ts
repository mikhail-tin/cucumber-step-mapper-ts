import * as vscode from 'vscode';
const path = require('path');

export class ConfigManager {
    private _typeOfSrc: string;
    private _pathToSrc: string;

    public get typeOfSrc(): string {
        if (!this._typeOfSrc) {
            this._typeOfSrc = String(vscode.workspace.getConfiguration('cucumber-step-mapper').get('typeOfSrc'));
        }
        return this._typeOfSrc;
    }

    public get pathToSrc(): string {
        if (!this._pathToSrc) {
            this._pathToSrc = this.getPathToSrc();
        }
        return this._pathToSrc;
    }

    private getPathToSrc(): string {
        let srcPath = String(vscode.workspace.getConfiguration('cucumber-step-mapper').get('srcPath'));
        if (!(srcPath.endsWith("/") || srcPath.endsWith("\\"))) {
            srcPath += "/";
        }
        return path.join(vscode.workspace.rootPath, srcPath);
    }
}