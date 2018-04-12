#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const version = require('../package').version
const poke = require('../lib')

let givenUrl = ''

program
  .version(version)
  .arguments('<url>')
  .option('-r, --retry [value]', 'broken links are retried with new hostname')
  .option('-s, --shallow', 'do not check pages rooted outside of provided url')
  .option(
    '-m, --max-img-size [value]',
    'looks for images that are over this size in kb. Defaults to 500'
  )
  .option('-q, --quiet', 'Supress warnings and loading messages(for ci)')
  .option(
    '-m, --method [head|post]',
    'HTTP method used to check links, defaults to head'
  )
  .option('--skip-images', 'Skip the image checks')
  .action(url => {
    givenUrl = url
  })

program.parse(process.argv)

if (!givenUrl) {
  console.error(chalk.red('Error: No URL Given'))
  process.exit(1)
}

if (
  program.method &&
  (program.method.toLowerCase() !== 'get' &&
    program.method.toLowerCase() !== 'head')
) {
  console.error(chalk.red('Error: method must be head or get'))
  process.exit(1)
}

poke(
  givenUrl,
  {
    retry: program.retry,
    shallow: program.shallow,
    quiet: program.quiet,
    method: program.method || 'head',
    skipImages: program.skipImages,
    maxImageSize: program.maxImgSize || 500
  },
  () => {
    process.exit(0)
  }
)
