'use strict';
const fs = require('fs');
const path = require('path');

export interface IStepDef {
    regex: string;
    file: string;
    line: number;
}

const v1 = {st: "en(/^", end: "$/)"},
      v2 = {st: "en('", end: "')"},
      v3 = {st: "en(\"", end: "\")"};

export function GetListOfFiles(myPaths, ext) {
    let result = [];
    let getAllFiles = function(myPath) {
        if( fs.existsSync(myPath) ) {
            fs.readdirSync(myPath).forEach(function(file,index) {
                let curPath = myPath + "/" + file;
                if(fs.lstatSync(curPath).isDirectory()) { 
                    getAllFiles(curPath);
                } else { 
                    if (path.extname(curPath) == ext){
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

function getStepFromString(str: string) {
    return (str.indexOf("Given") >= 0 || str.indexOf("When") >= 0 || str.indexOf("Then") >= 0) &&
        ((str.indexOf(v1.st) >= 0 && str.substring(str.indexOf(v1.st) + v1.st.length-1, str.indexOf(v1.end)+1)) || 
         (str.indexOf(v3.st) >= 0 && str.substring(str.indexOf(v3.st) + v3.st.length, str.indexOf(v3.end))) || 
         (str.indexOf(v2.st) >= 0 && str.substring(str.indexOf(v2.st) + v2.st.length, str.indexOf(v2.end))));
}