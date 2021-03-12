import {Command} from '@oclif/command'
import * as inquirer from 'inquirer'
import fs = require('fs');
import yaml = require('js-yaml');
import * as builder from '../scripts/builder'
/**
 * The init command should be used once by project to build them
 */
export default class Init extends Command {
  static description = 'Init a new pumpkin project'

  static args = [{name: 'name'}] // The name of the project

  // The future config file
  static project = {
    configuration : {
      name: '',
      path: '',
      language: null,
      databases: [],
      databasesInfos: {
        mongo: {},
        mariadb: {},
      },
      options: []
    },
    exposed: {
      routes: []
    }
  }

  async run() {

    const {args} = this.parse(Init)

    //This check for project name 
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

      // Ask for project language
      const promptLanguage : any = await inquirer.prompt([
        {
          type: 'list',
          message: 'Choose your API language',
          name: 'language',
          choices: ['Javascript ECMAScript 5', 'Javascript ECMAScript 6', 'TypeScript']
        }
      ]);
      Init.project.configuration.language = promptLanguage.language;

      // Ask for project desired databases
      const promptDataBases : any = await inquirer.prompt([
        {
          type: 'checkbox',
          message: 'Choose databases you need',
          name: 'dataBases',
          choices: ['MariaDB (SQL)', 'MongoDB']
        }
      ]);
      Init.project.configuration.databases = promptDataBases.dataBases;

      // Ask for project options
      const promptOptions : any = await inquirer.prompt([
        {
          type: 'checkbox',
          message: 'Choose options you need',
          name: 'options',
          choices: ['Docker']
        }
      ]);
      Init.project.configuration.options = promptOptions.options;

      // Ask for mongo database configuration
      if(promptDataBases.dataBases.indexOf('MongoDB') > -1 ) {
        const promptMongoOptions : any = await inquirer.prompt([
          {
            type: 'input',
            message: 'Name of Mongo DB database',
            name: 'mongoDatabaseName',
          },
          {
            type: 'password',
            message: 'Password of root Mongo DB account',
            name: 'mongoRootPassword',
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
          databaseName: promptMongoOptions.mongoDatabaseName,
          password: promptMongoOptions.mongoRootPassword,
          address: promptMongoAddress.address
        };
      }

      // Ask for mariadb database configuration
      if(promptDataBases.dataBases.indexOf('MariaDB (SQL)') > -1 ) {
        const promptMariaOptions : any = await inquirer.prompt([
          {
            type: 'input',
            message: 'Name of Maria DB database',
            name: 'mariaDatabaseName',
          },
          {
            type: 'password',
            message: 'Password of root Maria DB account',
            name: 'mariaRootpassword',
          },
          {
            type: 'input',
            message: 'Name of Maria DB user account',
            name: 'userAccount',
          },
          {
            type: 'password',
            message: 'Password of Maria DB account',
            name: 'userPassword',
          }
        ]);
        let promptMariaAddress : any 
        if(promptOptions.options.indexOf('Docker') === -1){
          promptMariaAddress = await inquirer.prompt([
            {
              type: 'input',
              message: 'Address of Maria DB database',
              name: 'address',
              default: 'localhost',
            }
          ]);
        } else {
          promptMariaAddress = {address: 'mariadb@mariadb'}
        }
        Init.project.configuration.databasesInfos.mariadb = {
          databaseName: promptMariaOptions.mariaDatabaseName,
          rootPassword: promptMariaOptions.mariaRootpassword,
          userAccount: promptMariaOptions.userAccount,
          userPassword: promptMariaOptions.userPassword,
          address: promptMariaAddress.address
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

    // generate config file
    let yamlStr = yaml.safeDump(Init.project);
    fs.writeFileSync('pumpkin.yaml', yamlStr, 'utf8');
    
    // Run builder
    await builder.build(Init.project.configuration);
  }
}
