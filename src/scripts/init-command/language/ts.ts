import * as fs from 'fs'
import * as exec from 'child_process'
import {template} from 'lodash'

const startData = fs.readFileSync(require.resolve('../../../templates/ts/start.txt'));
const serverData = fs.readFileSync(require.resolve('../../../templates/ts/server.txt'));
const mongoData = fs.readFileSync(require.resolve('../../../templates/ts/mongo-database.txt'));
const SQLData = fs.readFileSync(require.resolve('../../../templates/ts/sql-database.txt'));
const testSQLData = fs.readFileSync(require.resolve('../../../templates/ts/test-sql.txt'));


export function initDependencies(config: any) {
    process.chdir(config.path);
    exec.execSync('npm install --save express body-parser');
    exec.execSync('npm install --save-dev typescript ts-node @types/express @types/node');
    if (config.databases.indexOf('MongoDB') > -1) {
        exec.execSync('npm install mongoose --save');
        exec.execSync('npm install --save-dev @types/mongoose');
    }
    if (config.databases.indexOf('MariaDB (SQL)') > -1) {
        exec.execSync('npm install --save sequelize mariadb');
        exec.execSync('npm install --save-dev @types/bluebird @types/validator @types/sequelize');
    }
}

export function addScripts(path: string) {
    process.chdir(path);
    let packaged = JSON.parse(fs.readFileSync('./package.json').toString())
    packaged.scripts['build'] = 'tsc';
    packaged.scripts['start'] = 'ts-node ./src/start.ts';
    packaged.scripts['start:prod'] = 'nodemon ./dist/server.js';
    packaged.scripts['deploy'] = 'npm run build && npm run start:prod';
    fs.writeFileSync('./package.json', JSON.stringify(packaged, null, 4));
}

export function writeAppFile(config: any) {

    process.chdir(config.path + '/src');

    exec.exec('touch start.ts', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('start.ts', getCompiledStartTemplate()) 

    exec.exec('touch server.ts', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('server.ts', getCompiledServerTemplate(config)) 

    process.chdir(config.path + '/src/Routes');
    exec.execSync('touch index.ts');

    process.chdir(config.path + '/src/Models');
    exec.exec('touch index.ts', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });

    process.chdir(config.path + '/src/Controllers');
    exec.exec('touch index.ts', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });

    if (config.databases.indexOf('MongoDB') > -1) {
        process.chdir(config.path + '/src');
        exec.exec('touch mongo-database.ts', (err, stdout, stderr) => {
            if (err) { console.log(err); return; }
        });
        fs.writeFileSync('mongo-database.ts', getCompiledMongoDatabaseTemplate(config)) 
    }

    if (config.databases.indexOf('MariaDB (SQL)') > -1) {
        process.chdir(config.path + '/src');
        exec.exec('touch sql-database.ts', (err, stdout, stderr) => {
            if (err) { console.log(err); return; }
        });
        fs.writeFileSync('sql-database.ts', getCompiledSQLDatabaseTemplate(config)) 
    }
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
        runConstructorFunctions: '',
        functions: ''
    }

    if (config.databases.indexOf('MariaDB (SQL)') > -1) {
        params.runConstructorFunctions += "this.testConnection();";
        params.functions += testSQLData.toString();
        params.imports += `import { sqlDatabase } from "./sql-database";\n`
    }

    return serverTemplate(params);
}

function getCompiledSQLDatabaseTemplate(config:any) {
    const SQLTemplate = template(SQLData.toString());

    const params = {
        databaseName: config.databasesInfos.mariadb.databaseName,
        username: config.databasesInfos.mariadb.userAccount,
        password: config.databasesInfos.mariadb.userPassword,
        dialect: 'mariadb',
        host: config.databasesInfos.mariadb.address,
    }

    return SQLTemplate(params);
}

// TODO: Add mongo template for database file
function getCompiledMongoDatabaseTemplate(config:any) {
    const mongoTemplate = template(mongoData.toString());

    const params = {}

    return mongoTemplate(params);
}
