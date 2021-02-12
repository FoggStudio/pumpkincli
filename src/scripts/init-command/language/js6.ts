import * as fs from 'fs'
import * as exec from 'child_process'
import {template} from 'lodash'

const startData = fs.readFileSync(require.resolve('../../../templates/js6/start.txt'));
const serverData = fs.readFileSync(require.resolve('../../../templates/js6/server.txt'));
const indexRoutesData = fs.readFileSync(require.resolve('../../../templates/js6/Routes/index.txt'));
const mongoData = fs.readFileSync(require.resolve('../../../templates/js6/databases/MongoDB/databaseConnection.txt'));

export function initDependencies(config: any) {
    process.chdir(config.path);
    exec.execSync('npm install cors --save');
    exec.execSync('npm install express --save');
    exec.execSync('npm install @babel/core --save-dev');
    exec.execSync('npm install @babel/preset-env --save-dev');
    exec.execSync('npm install @babel/register --save-dev');
    exec.execSync('npm install nodemon --save-dev');
    if (config.databases.indexOf('MongoDB') > -1) {
        exec.execSync('npm install mongoose --save');
    }
}

export function addScripts(path: string) {
    process.chdir(path);
    let packaged = JSON.parse(fs.readFileSync('./package.json').toString())
    packaged.scripts['start'] = 'node ./src/start.js';
    fs.writeFileSync('./package.json', JSON.stringify(packaged, null, 4));
}

export function writeAppFile(config: any) {

    process.chdir(config.path + '/src');

    exec.exec('touch start.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('start.js', getCompiledStartTemplate()) 

    exec.exec('touch server.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('server.js', getCompiledServerTemplate(config)) 

    process.chdir(config.path + '/src/Routes');
    exec.exec('touch index.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    const routesTemplate = template(indexRoutesData.toString());
    fs.writeFileSync('index.js', routesTemplate({routes:''})) 

    process.chdir(config.path + '/src/Models');
    exec.exec('touch index.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('index.js', '') 

    process.chdir(config.path + '/src/Controllers');
    exec.exec('touch index.js', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('index.js', '') 
}

function getCompiledStartTemplate() {
    const startTemplate = template(startData.toString());
    return startTemplate();
}

function getCompiledServerTemplate(config:any) {
    const serverTemplate = template(serverData.toString());

    const params = {
        name: config.name,
        imports: '',
        dataBaseConnection: ''
    }

    if (config.databases.indexOf('MongoDB') > -1) {
        const mongoTemplate = template(mongoData.toString());
        params.imports += "import mongoose from 'mongoose';\n";
        params.dataBaseConnection += mongoTemplate({
            databaseName: config.databasesInfos.mongo.databaseName,
            address: config.options.indexOf('Docker') > -1 ? 'mongodb@mongodb' : config.databasesInfos.mongo.address
        })
    }

    return serverTemplate(params);
}
