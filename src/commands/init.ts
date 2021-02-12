import {Command} from '@oclif/command'
import * as inquirer from 'inquirer'
import fs = require('fs');
import yaml = require('js-yaml');
import * as builder from '../scripts/builder'

export default class Init extends Command {
  static description = 'Init a new pumpkin project'


  static args = [{name: 'name'}]

  static project = {
    configuration : {
      name: '',
      path: '',
      language: null,
      tests: {
        isTested : false,
        testTools: []
      },
      databases: [],
      databasesInfos: {
        mongo: {},
        maria: {},
      },
      libraries: [],
      websockets: false,
      options: []
    },
    exposed: []
  }

  async run() {

    const {args} = this.parse(Init)

    try {  
      if(args.name) {
        Init.project.configuration.name = args.name.toLowerCase();
      } else {
        Init.project.configuration.name = 'pumpkin-project';
      }
      

      console.log("  ___                 _   _         ___ _    ___ ");
      console.log(" | _ \\_  _ _ __  _ __| |_(_)_ _    / __| |  |_ _|");
      console.log(" |  _/ || | '  \\| '_ \\ / / | ' \\  | (__| |__ | | ");
      console.log(" |_|  \\_,_|_|_|_| .__/_\\_\\_|_||_|  \\___|____|___|");
      console.log("                |_|                              ");

      const promptLanguage : any = await inquirer.prompt([
        {
          type: 'list',
          message: 'Choose your API language',
          name: 'language',
          choices: ['Javascript ECMAScript 5', 'Javascript ECMAScript 6', 'TypeScript']
        }
      ]);
      Init.project.configuration.language = promptLanguage.language;

      const promptTestsTools : any = await inquirer.prompt([
        {
          type: 'list',
          message: 'Select test tools you wanna use',
          name: 'testTools',
          choices: ['Jest']
        }
      ]);
      Init.project.configuration.tests.testTools = promptTestsTools.testTools;

      const promptDataBases : any = await inquirer.prompt([
        {
          type: 'checkbox',
          message: 'Choose databases you need',
          name: 'dataBases',
          choices: ['MariaDB (SQL)', 'MongoDB']
        }
      ]);
      Init.project.configuration.databases = promptDataBases.dataBases;

      const promptlibraries : any = await inquirer.prompt([
        {
          type: 'checkbox',
          message: 'Choose libraries you need',
          name: 'libraries',
          choices: ['nodeMailer', 'GraphQL', 'socketIO']
        }
      ]);
      Init.project.configuration.libraries = promptlibraries.libraries;

      if(Init.project.configuration.libraries.find(element => element === 'socketIO')) {
        Init.project.configuration.websockets = true;
        
      }

      const promptOptions : any = await inquirer.prompt([
        {
          type: 'checkbox',
          message: 'Choose options you need',
          name: 'options',
          choices: ['Docker']
        }
      ]);
      Init.project.configuration.options = promptOptions.options;

      if(promptDataBases.dataBases.indexOf('MongoDB') > -1 ) {
        const promptMongoOptions : any = await inquirer.prompt([
          {
            type: 'input',
            message: 'Name of Mongo DB database',
            name: 'databaseName',
          },
          {
            type: 'password',
            message: 'Password of root Mongo DB account',
            name: 'password',
          }
        ]);
        let promptMongoAddress : any 
        if(promptOptions.options.indexOf('Docker') === -1){
          promptMongoAddress = await inquirer.prompt([
            {
              type: 'input',
              message: 'Address of Mongo DB database',
              name: 'address',
              default: 'localhost',
            }
          ]);
        } else {
          promptMongoAddress = {address: 'mongodb@mongodb'}
        }
        Init.project.configuration.databasesInfos.mongo = {
          databaseName: promptMongoOptions.databaseName,
          password: promptMongoOptions.password,
          address: promptMongoAddress.address
        };
      }
    } catch(e) {
      console.log("error in init.ts")
      console.log(e)
    }

    try {
      fs.mkdirSync('./'+Init.project.configuration.name);
      process.chdir('./'+Init.project.configuration.name);
      Init.project.configuration.path = process.cwd();
    } catch(e) {
      console.error(e);
    }

    let yamlStr = yaml.safeDump(Init.project.configuration);
    fs.writeFileSync('pumpkin.yaml', yamlStr, 'utf8');
    
    await builder.build(Init.project.configuration);
  }
}
