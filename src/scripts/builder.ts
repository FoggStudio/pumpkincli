import * as fs from 'fs'
import * as exec from 'child_process'
import * as initJs6app from './init-command/language/js6'
import * as initDocker from './init-command/options/docker'

export async function build(config: any) {

    // ********************************************************
    // Init git and npm
    // ********************************************************

    exec.execSync('git init');

    exec.execSync('npm init -y');

    exec.execSync('touch .gitignore');

    fs.writeFileSync('.gitignore', 'node_modules') 
    

    // ********************************************************
    // Install all dependencies 
    // ********************************************************

    switch (config.language) {
        case "Javascript ECMAScript 6":
            await initJs6app.initDependencies(config);
            await initJs6app.addScripts(config.path);
            break;
    
        default:
            break;
    }

    // ********************************************************
    // Create folders and files
    // ********************************************************
   
    process.chdir(config.path);
    if (!fs.existsSync('./src')){
        fs.mkdirSync('./src');
        fs.mkdirSync('./src/Controllers');
        fs.mkdirSync('./src/Models');
        fs.mkdirSync('./src/Public');
        fs.mkdirSync('./src/Routes');
    }



    // ********************************************************
    // Build template files depending on language
    // ********************************************************

    switch (config.language) {
        case "Javascript ECMAScript 6":
            initJs6app.writeAppFile(config);
            break;
    
        default:
            break;
    }

    // ********************************************************
    // Build options files
    // ********************************************************

    // Create dockerFile, docker-compose.yaml and .dockerignore
    if (config.options.indexOf('Docker') > -1) {
        initDocker.initDocker(config);
    }

}
