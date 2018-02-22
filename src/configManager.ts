import * as vscode from 'vscode';
const path = require('path');

export class ConfigManager {
    private _typeOfSrc: string;
    private _pathToSrc: string[];
    private _fileExtension: string;

    public get typeOfSrc(): string {
        if (!this._typeOfSrc) this._typeOfSrc = String(vscode.workspace.getConfiguration('cucumber-step-mapper').get('typeOfSrc'));
        return this._typeOfSrc;
    }

    public get pathToSrc(): string[] {
        if (!this._pathToSrc) this._pathToSrc = this.getPathToSrc();
        return this._pathToSrc;
    }

    public get fileExtension(): string {
        if(!this._fileExtension){
            this._fileExtension = '.rb';
        }
        return this._fileExtension;
    }

    private getPathToSrc(): string[] {
        let value = String(vscode.workspace.getConfiguration('cucumber-step-mapper').get('srcPath'));
        let arr = value.split(',');
        let arr2 = arr.map(x=> {return path.normalize(path.join(vscode.workspace.rootPath, x.trim())) });
        let arr3 = arr2.map(x=> { if(!(x.endsWith("/") || x.endsWith("\\"))) return x += path.sep;});
        return arr3;
    }
}