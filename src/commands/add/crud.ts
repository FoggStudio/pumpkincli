import {Command} from '@oclif/command'
import * as inquirer from 'inquirer'
import fs = require('fs');
import yaml = require('js-yaml');
import {config} from '../../types/config.type';
import {writeAppFile} from '../../scripts/add-command/language/ts/add-crud';

/**
 * This command should be used for every MVC routes you want
 */
export default class AddCRUD extends Command {
  static description = 'Add models and contoller for CRUD actions'

  static args = [{name: 'modelName'}] // The name of the model

  async run() {

    // Load pumpkin config file 
    const fileContents = fs.readFileSync('./pumpkin.yaml', 'utf8');
    const config= yaml.safeLoad(fileContents) as config;
    const {args} = this.parse(AddCRUD);
    
    const regex = /^[a-zA-Z]+$/;
    //This check for project name 
    try {  
      if(args.modelName && regex.test(args.modelName)) {
        if(config) {
          // Ask for project desired databases
          const crudDatabase : any = await inquirer.prompt([
            {
              type: 'list',
              message: 'Choose databases that your CRUD will use',
              name: 'database',
              choices: config.configuration.databases
            }
          ]);
          writeAppFile(config, crudDatabase.database, args.modelName)
        } else {
          console.warn('Cannot found pumplin file');
        }
      } else {
        console.warn('Incorrect model name');
      }
      
    } catch(e) {
      console.log("Error in add/crud.ts")
      console.log(e)
    }
  }
}
