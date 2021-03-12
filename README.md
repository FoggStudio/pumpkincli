pumpkin
=======

A fully configurable CLI for express projects

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/pumpkin.svg)](https://npmjs.org/package/pumpkin)
[![Downloads/week](https://img.shields.io/npm/dw/pumpkin.svg)](https://npmjs.org/package/pumpkin)
[![License](https://img.shields.io/npm/l/pumpkin.svg)](https://github.com/LeopoldBriand-bot/PumpkinCLI/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g pumpkin
$ pumpkin COMMAND
running command...
$ pumpkin (-v|--version|version)
pumpkin/0.1.0 linux-x64 node-v10.2.0
$ pumpkin --help [COMMAND]
USAGE
  $ pumpkin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pumpkin add:crud [MODELNAME]`](#pumpkin-addcrud-modelname)
* [`pumpkin generate:routes`](#pumpkin-generateroutes)
* [`pumpkin help [COMMAND]`](#pumpkin-help-command)
* [`pumpkin init [NAME]`](#pumpkin-init-name)

## `pumpkin add:crud [MODELNAME]`

Add models and contoller for CRUD actions

```
USAGE
  $ pumpkin add:crud [MODELNAME]
```

_See code: [src/commands/add/crud.ts](https://github.com/FoggStudio/PumpkinCLI/blob/v0.1.0/src/commands/add/crud.ts)_

## `pumpkin generate:routes`

Generate route file

```
USAGE
  $ pumpkin generate:routes
```

_See code: [src/commands/generate/routes.ts](https://github.com/FoggStudio/PumpkinCLI/blob/v0.1.0/src/commands/generate/routes.ts)_

## `pumpkin help [COMMAND]`

display help for pumpkin

```
USAGE
  $ pumpkin help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `pumpkin init [NAME]`

Init a new pumpkin project

```
USAGE
  $ pumpkin init [NAME]
```

_See code: [src/commands/init.ts](https://github.com/FoggStudio/PumpkinCLI/blob/v0.1.0/src/commands/init.ts)_
<!-- commandsstop -->
