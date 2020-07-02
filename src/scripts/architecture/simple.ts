import * as fs from 'fs'
 
export function buildArchitecture () {
    if (!fs.existsSync('./src')){
        fs.mkdirSync('./src');
        fs.mkdirSync('./src/Controller');
        fs.mkdirSync('./src/Model');
        fs.mkdirSync('./src/Public');
        fs.mkdirSync('./src/Routes');
    }
}