import * as exec from 'child_process'
import * as fs from 'fs'
import {template} from 'lodash'

const dockerFileData = fs.readFileSync(require.resolve('../../../templates/options/docker/dockerFile.txt'));
const dockerComposeData = fs.readFileSync(require.resolve('../../../templates/options/docker/docker-compose.txt'));
const mongoData = fs.readFileSync(require.resolve('../../../templates/options/docker/mongodb.txt'));

export function initDocker(config: any) {
    process.chdir(config.path);
    exec.exec('touch DockerFile', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('Dockerfile', dockerFileData);

    const dockerComposeTemplate = template(dockerComposeData.toString());
    const params = {
        name:config.name,
        databases:'',
        links:''
    }
    if (config.databases.length > 0) {
        params.links += 'links:\n'
    }
    if (config.databases.indexOf('MongoDB') > -1) {
        params.links+= '      - mongodb';
        const mongoTemplate = template(mongoData.toString());
        params.databases += mongoTemplate({
            databaseName: config.databasesInfos.mongo.databaseName,
            password: config.databasesInfos.mongo.password
        })
    }

    const resolvedDockerComposeTemplate = dockerComposeTemplate(params)

    exec.exec('touch docker-compose.yml', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFileSync('docker-compose.yml', resolvedDockerComposeTemplate) 
    
}