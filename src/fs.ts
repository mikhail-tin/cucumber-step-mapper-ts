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

export function GetListOfFiles(myPaths) {
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

    for(let x = 0; x <= myPaths.length; x++){
        getAllFiles(myPaths[x]);
    }
    return result;
}

export function GetStepDef(files: string[]) {
    let result: IStepDef[] = [];
    files.forEach((file) => {
        let lines = fs.readFileSync(file).toString().split("\n");
        lines.forEach((i, line)=>{
            let step = getStepFromString(i);
            if (step) {
                result.push({ regex: step, file: file, line: line });
            }
        });
    });
    return result;
}

export function getStepFromString(str: string) {
    return (str.indexOf("Given") >= 0 || str.indexOf("When") >= 0 || str.indexOf("Then") >= 0) &&
    ((str.indexOf(stEnd.reg.st) >= 0 && str.substring(str.indexOf(stEnd.reg.st) + stEnd.reg.st.length, str.indexOf(stEnd.reg.end)))
    || (str.indexOf(stEnd.dq.st) >= 0  && str.substring(str.indexOf(stEnd.dq.st) + stEnd.dq.st.length, str.indexOf(stEnd.dq.end)))
    || (str.indexOf(stEnd.q.st) >= 0 && str.substring(str.indexOf(stEnd.q.st) + stEnd.q.st.length, str.indexOf(stEnd.q.end))));
}
