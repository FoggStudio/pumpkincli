import * as fs from 'fs'
import * as exec from 'child_process'
import * as initJs5app from './init-command/language/js5'
import * as initJs6app from './init-command/language/js6'
import * as initTsapp from './init-command/language/ts'
import * as initDocker from './init-command/options/docker'
import cli from 'cli-ux'

export async function build(config: any) {

    // ********************************************************
    // Init git and npm
    // ********************************************************
    cli.action.start('Initialize git repository');
    exec.execSync('git init');
    exec.execSync('touch .gitignore');
    fs.writeFileSync('.gitignore', 'node_modules') 
    cli.action.stop();

    cli.action.start('Initialize npm');
    exec.execSync('npm init -y');
    cli.action.stop();

    // ********************************************************
    // Install all dependencies 
    // ********************************************************
    cli.action.start('Installing depedencies and adding npm scripts');
    switch (config.language) {
        case "Javascript ECMAScript 5":
            await initJs5app.initDependencies(config);
            await initJs5app.addScripts(config.path);
            break;
        case "Javascript ECMAScript 6":
            await initJs6app.initDependencies(config);
            await initJs6app.addScripts(config.path);
            break;
        case "TypeScript":
            await initTsapp.initDependencies(config);
            await initTsapp.addScripts(config.path);
            break;
        default:
            break;
    }
    cli.action.stop();
    
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
        case "Javascript ECMAScript 5":
            initJs5app.writeAppFile(config);
            break;
        case "Javascript ECMAScript 6":
            initJs6app.writeAppFile(config);
            break;
        case "TypeScript":
            initTsapp.writeAppFile(config);
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
