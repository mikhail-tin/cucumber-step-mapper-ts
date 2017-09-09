'use strict';
const fs = require('fs');
const path = require('path');
import {IStepDef} from './interfaces';
export {IStepDef};

const stEnd = {
    reg: {st: "en(/^", end: "$/"},
    q: {st: "en('", end: "',"},
    dq: {st: "en(\"", end: "\","}
};

export function GetListOfFiles(myPath) {
    let result = [];
    let getAllFiles = function(myPath) {
            if( fs.existsSync(myPath) ) {
                fs.readdirSync(myPath).forEach(function(file,index) {
                    let curPath = myPath + "/" + file;
                    if(fs.lstatSync(curPath).isDirectory()) { 
                        getAllFiles(curPath);
                    } else { 
                        if (path.extname(curPath) == '.ts'){
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

export function getStepFromString(str: string) {
    return (str.indexOf("Given") >= 0 || str.indexOf("When") >= 0 || str.indexOf("Then") >= 0) &&
    ((str.indexOf(stEnd.reg.st) && str.substring(str.indexOf(stEnd.reg.st) + stEnd.reg.st.length, str.indexOf(stEnd.reg.end)))
    || (str.indexOf(stEnd.dq.st) && str.substring(str.indexOf(stEnd.dq.st) + stEnd.dq.st.length, str.indexOf(stEnd.dq.end)))
    || (str.indexOf(stEnd.q.st) && str.substring(str.indexOf(stEnd.q.st) + stEnd.q.st.length, str.indexOf(stEnd.q.end))));
}