import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as exec from 'child_process'
import * as simplearchitecture from './architecture/simple'
import * as initJs6app from './language/js6'

export function build(config: any) {

    // ********************************************************
    // Init git and npm
    // ********************************************************

    exec.exec('git init', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
    });

    exec.exec('npm init -y', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
    });

    exec.exec('touch .gitignore', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFile('.gitignore', 'node_modules' , (err) => { 
        // In case of a error throw err. 
        if (err) throw err; 
    }) 
    

    // ********************************************************
    // Install all dependencies 
    // ********************************************************

    if (config.language === "Javascript ECMAScript 6") {
        initJs6app.initDependencies();
    }



    // Build Architecture
    if (config.architecture === "Simple") {
        simplearchitecture.buildArchitecture();
    }

    // Create app file with the good language
    if (config.language === "Javascript ECMAScript 6"){
        initJs6app.writeAppFile();
    }
}
