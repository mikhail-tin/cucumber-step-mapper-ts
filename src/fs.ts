'use strict';
const fs = require('fs');
const path = require('path');
import {IStepDef} from './interfaces';

export {IStepDef};

export function GetListOfFiles(myPath) {
    let result = [];
    let getAllFiles = function(myPath) {
            if( fs.existsSync(myPath) ) {
                fs.readdirSync(myPath).forEach(function(file,index) {
                    let curPath = myPath + "/" + file;
                    if(fs.lstatSync(curPath).isDirectory()) { 
                        getAllFiles(curPath);
                    } else { 
                        if( path.extname(curPath) == '.ts'){
                            result.push(curPath);
                        }
                    }
                });
            }
        };
    getAllFiles(myPath);
    return result;
}

export function GetStepDef(files: string[]) {
    let result: IStepDef[] = [];
    files.forEach((file) => {
        let lines = fs.readFileSync(file).toString().split("\n");
        lines.forEach((i, line)=>{
            if (i.indexOf('(/^') >= 0) {
                result.push({
                    regex: i.substring(i.indexOf('(/^')+3, i.indexOf('$/,')),
                    file: file,
                    line: line
                });
            }
        });
    });
    return result;
}