#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const package = require('../package');
const poke = require('../lib');

let givenUrl = '';

program
  .version(package.version)
  .arguments('<url>')
  .option('-r, --retry [value]', 'broken links are retried with new hostname')
  .option('-s, --shallow', 'do not check pages rooted outside of provided url')
  .action(url => {
    givenUrl = url;
  });

program.parse(process.argv);

if (!givenUrl) {
  console.error(chalk.red('Error: No URL Given'));
  process.exit(1);
}

poke(givenUrl, {
  retry: program.retry,
  shallow: program.shallow,
});
