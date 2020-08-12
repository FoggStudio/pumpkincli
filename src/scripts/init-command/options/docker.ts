import * as exec from 'child_process'
import * as fs from 'fs'
import * as dcBuilder from './data/docker/dockerComposeBuilder'

let dockerFileDataSimpleJS6 = fs.readFileSync(require.resolve('./data/docker/DockerFileSimpleJs6.txt'));

export function initDocker(config: any) {
    process.chdir(config.path);
    exec.exec('touch DockerFile', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFile('DockerFile', dockerFileDataSimpleJS6 , (err) => { 
        // In case of a error throw err. 
        if (err) throw err; 
    });
    exec.exec('touch docker-compose.yml', (err, stdout, stderr) => {
        if (err) { console.log(err); return; }
    });
    fs.writeFile('docker-compose.yml', dcBuilder.initDockerCompose(config.name, config.databases) , (err) => { 
        // In case of a error throw err. 
        if (err) throw err; 
    }) 
    
}