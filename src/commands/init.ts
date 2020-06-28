import {Command} from '@oclif/command'
import * as inquirer from 'inquirer'
import fs = require('fs');
import yaml = require('js-yaml');

export default class Init extends Command {
  static description = 'Init a new pumpkin project'


  static args = [{name: 'name'}]

  static configuration = {
    name: '',
    language: null,
    architecture: null,
    tests: {
      isTested : false,
      testTools: []
    },
    databases: [],
    libraries: [],
    websockets: false,
    options: []
  }

  async run() {

    const {args, flags} = this.parse(Init)

    if(args.name) {
      Init.configuration.name = args.name;
    } else {
      Init.configuration.name = 'pumpkinProject';
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
    Init.configuration.language = promptLanguage.language;

    const promptArchitechture : any = await inquirer.prompt([
      {
        type: 'list',
        message: 'Choose a folder architecture',
        name: 'architecture',
        choices: ['Simple']
      }
    ]);
    Init.configuration.architecture = promptArchitechture.architecture;

    const promptTestsTools : any = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select test tools you wanna use',
        name: 'testTools',
        choices: ['Jest']
      }
    ]);
    Init.configuration.tests.testTools = promptTestsTools.testTools;

    const promptDataBases : any = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Choose databases you need',
        name: 'dataBases',
        choices: ['MariaDB (SQL)', 'MongoDB', 'ElasticSearch']
      }
    ]);
    Init.configuration.databases = promptDataBases.dataBases;

    const promptlibraries : any = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Choose databases you need',
        name: 'libraries',
        choices: ['UnderscoreJs', 'nodeMailer', 'GraphQL', 'Inversify', 'socketIO']
      }
    ]);
    Init.configuration.libraries = promptlibraries.libraries;

    const isSocketIO =  Init.configuration.libraries.find(element => element === 'socketIO');

    if(isSocketIO != undefined) {
      Init.configuration.websockets = true;
      
    }

    const promptOptions : any = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Choose options you need',
        name: 'options',
        choices: ['Docker', 'Uglify']
      }
    ]);
    Init.configuration.options = promptOptions.options;

    console.log(Init.configuration)
    let yamlStr = yaml.safeDump(Init.configuration);
    fs.writeFileSync('pumpkin.yaml', yamlStr, 'utf8');
  }
}
