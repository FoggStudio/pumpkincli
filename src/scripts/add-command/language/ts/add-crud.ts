import * as fs from 'fs'
import * as exec from 'child_process'
import {template} from 'lodash'

const mariaDbControllerData = fs.readFileSync(require.resolve('../../../../templates/ts/Controllers/maria.txt'));
const mariaDbModelData = fs.readFileSync(require.resolve('../../../../templates/ts/Models/maria.txt'));

export function writeAppFile(config: any, dataBase: String, modelName: String) {

    process.chdir(config.configuration.path + '/src');

      if (dataBase == 'MariaDB (SQL)') {
                process.chdir(config.configuration.path + '/src/Controllers');
        exec.exec(`touch ${modelName}.controller.ts`, (err, stdout, stderr) => {
            if (err) { console.log(err); return; }
        });
        fs.writeFileSync(`${modelName}.controller.ts`, getCompiledMariaControllerTemplate(modelName)) ;

        process.chdir(config.configuration.path + '/src/Models');
        exec.exec(`touch ${modelName}.model.ts`, (err, stdout, stderr) => {
            if (err) { console.log(err); return; }
        });
        fs.writeFileSync(`${modelName}.model.ts`, getCompiledMariaModelTemplate(modelName)) ;
    }
}

function getCompiledMariaControllerTemplate(modelName: String) {
    const controllerTemplate = template(mariaDbControllerData.toString());

    const params = {
        modelName: modelName
    }

    return controllerTemplate(params);
}

function getCompiledMariaModelTemplate(modelName: String) {
    const modelTemplate = template(mariaDbModelData.toString());

    const params = {
        modelName: modelName
    }

    return  modelTemplate(params);
}
