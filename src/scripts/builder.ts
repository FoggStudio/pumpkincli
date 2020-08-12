import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as exec from 'child_process'
import * as simplearchitecture from './init-command/architecture/simple'
import * as initJs6app from './init-command/language/js6'
import * as initDocker from './init-command/options/docker'
import * as utils from './init-command/utils/dataBaseHelper'

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
        initJs6app.initDependencies(config.path);
    }

    // ********************************************************
    // Create folders and files
    // ********************************************************

    // Build Architecture
    if (config.architecture === "Simple") {
        simplearchitecture.buildArchitecture(config.path);
    }

    // Create app file with the good language
    if (config.language === "Javascript ECMAScript 6"){
        initJs6app.writeAppFile(config.path);
    }

    // Add dataBases connections
    if (config.databases.length > 0) {
        config.databases.forEach((element: string) => {
            utils.addDtabaseConnection(element, config)
        });
    }

    // Create dockerFile, docker-compose.yaml and .dockerignore
    if (config.options.indexOf('Docker') > -1) {
        initDocker.initDocker(config);
    }

}
