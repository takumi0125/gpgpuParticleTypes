#!/usr/bin/env node
'use strict';

const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const utr = require('./utr.js');

const defaultTask = require('./task.js');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

program
.name("utr")
.version('2.0.0')
.option('-t, --taskfile [taskfile]', 'task file path')

// execTask task command
program
.arguments('<taskName>')
.action(async (taskName)=> {
  const tasks = program.taskfile? require(path.resolve(program.taskfile)): defaultTask;
  utr.setTasks(tasks);

  if(!tasks[taskName]) {
    utr.error([ 'task error' ], `task:${taskName} doesn't exist.`);
    return;
  }

  await utr.execTask(taskName);
});

console.log(chalk.bold.greenBright('====================================='));
console.log(chalk.bold.greenBright(' unshift task runner'));
console.log(chalk.bold.greenBright('====================================='));
console.log(chalk.bold.cyan(`mode: ${process.env.NODE_ENV}`));

program.parse(process.argv);