import {Command} from '@oclif/command';
import fs = require('fs');
import yaml = require('js-yaml');
import {config} from '../../types/config.type';
import {template} from 'lodash';

const routesTemplate = fs.readFileSync(require.resolve('../../templates/ts/Routes/index.txt'));
const crudRoutesTemplate = fs.readFileSync(require.resolve('../../templates/ts/Routes/routeCrud.txt'));

/**
 * This command should be used for every MVC routes you want
 */
export default class GenerateRoutes extends Command {
  static description = 'Generate route file'

  async run() {

    // Load pumpkin config file 
    const fileContents = fs.readFileSync('./pumpkin.yaml', 'utf8');
    const config = yaml.safeLoad(fileContents) as config;
    
    try {  
        if(config) {
            let imports = '';
            let definitions = '';
            let routes = '';
            config.exposed.routes.forEach(crud => {
                imports += `import { ${crud}Controller } from "../Controllers";\n`
                definitions += `public ${crud.toLowerCase()}Controller: ${crud}Controller = new ${crud}Controller();\n`
                console.log(crud)
                routes += this.getCRUDTemplate(crud);
            });
            process.chdir(config.configuration.path + '/src/Routes');
            fs.writeFileSync(`index.ts`, this.getRoutesTemplate(imports, definitions, routes)) ;
        } else {
            console.warn('Cannot found pumplin file');
        }
      
    } catch(e) {
      console.log("Error in genrate/routes.ts")
      console.log(e)
    }
  }

  getRoutesTemplate(imports: String, definitions: String, routes: String) {
    const route = template(routesTemplate.toString());

    const params = {
      imports,
      definitions,
      routes,
    }

    return route(params);
  }

  getCRUDTemplate(name: String) {
    const crud = template(crudRoutesTemplate.toString());
    console.log(crud);
    console.log(crud({name}))
    return crud({name})
  }
}
