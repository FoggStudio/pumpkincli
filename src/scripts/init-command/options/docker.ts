import * as exec from 'child_process'
import * as fs from 'fs'
import {template} from 'lodash'

const dockerFileData = fs.readFileSync(require.resolve('../../../templates/options/docker/dockerFile.txt'));
const dockerComposeData = fs.readFileSync(require.resolve('../../../templates/options/docker/docker-compose.txt'));
const mongoData = fs.readFileSync(require.resolve('../../../templates/options/docker/mongodb.txt'));
const SQLData = fs.readFileSync(require.resolve('../../../templates/options/docker/mariadb.txt'));

export function initDocker(config: any) {
    process.chdir(config.path);
    exec.exec('touch Dockerfile', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('Dockerfile', dockerFileData);

    const dockerComposeTemplate = template(dockerComposeData.toString());
    const params = {
        name:config.name,
        databases:'',
    }
    if (config.databases.indexOf('MongoDB') > -1) {
        const mongoTemplate = template(mongoData.toString());
        params.databases += mongoTemplate({
            databaseName: config.databasesInfos.mongo.databaseName,
            password: config.databasesInfos.mongo.password
        })
    }

    if (config.databases.indexOf('MariaDB (SQL)') > -1) {
        const mariaTemplate = template(SQLData.toString());
        params.databases += mariaTemplate({
            databaseName:config.databasesInfos.mariadb.databaseName,
            rootPassword:config.databasesInfos.mariadb.rootPassword,
            userAccount:config.databasesInfos.mariadb.userAccount,
            userPassword:config.databasesInfos.mariadb.userPassword,
        })
    }

    const resolvedDockerComposeTemplate = dockerComposeTemplate(params)

    exec.exec('touch docker-compose.yml', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('docker-compose.yml', resolvedDockerComposeTemplate) 
    
}