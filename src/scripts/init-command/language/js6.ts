import * as fs from 'fs'
import * as exec from 'child_process'

let startData = fs.readFileSync(require.resolve('./data/js6/start.txt'));
let serverData = fs.readFileSync(require.resolve('./data/js6/server.txt'));

export function initDependencies(path: string) {
    process.chdir(path);
    exec.exec('npm install cors --save', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    exec.exec('npm install express --save', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    exec.exec('npm install @babel/core --save-dev', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    exec.exec('npm install @babel/preset-env --save-dev', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    exec.exec('npm install @babel/register --save-dev', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    exec.exec('npm install nodemon --save-dev', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
}

export function writeAppFile(path: string) {

    process.chdir(path);
    process.chdir('./src');

    exec.exec('touch start.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFile('start.js', startData , (err) => { 
        // In case of a error throw err. 
        if (err) throw err; 
    }) 

    exec.exec('touch server.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFile('server.js', serverData , (err) => { 
        // In case of a error throw err. 
        if (err) throw err; 
    }) 
}

