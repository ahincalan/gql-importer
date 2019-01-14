#!/usr/bin/env node

const chalk = require('chalk');
const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');
const {helpSections, optionDefinitions} = require('./src/const');
const options = commandLineArgs(optionDefinitions, {stopAtFirstUnknown: true});
const usage = commandLineUsage(helpSections);
const {GqlParser} = require('./src/parser');

async function run() {
  if (options['_unknown']) {
    for (const i in options['_unknown']) {
      if (options['_unknown'].hasOwnProperty(i))
        console.log(chalk.red(options['_unknown'][i] + ' Command not found'));
    }
    return;
  }

  if (options['help']) {
    console.log(chalk.blue(usage));
  }

  if (!options['url']) {
    console.error(chalk.red('host --url not found'));
    return;
  }

  const gp = new GqlParser(options);

  if (options['type']) {
    gp.getType(options['type']);
  } else {
    gp.getSchema();
  }

}

run().catch(e => {
  console.error(e);
  process.exit(1);
});


