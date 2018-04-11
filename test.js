const poke = require('./lib')
const { spawn } = require('child_process')
const chalk = require('chalk')

const child = spawn('node', ['./test/server.js'], {
  cwd: process.cwd()
})

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

child.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`)
})

const port = 8000

setTimeout(() => {
  poke(`http://localhost:${port}/`, {
    shallow: true,
    maxImageSize: 500
  }, (err, results) => {
    if (err) console.log(err)
    console.log(port)
    console.log(results)

    if (
      results.largeImages.length !== 1 ||
      !results.brokenLinks.has('http://localhost:8000/nowhere.html') ||
      results.duplicateLinks.length !== 1
    ) {
      console.log(chalk.red('Tests Failed. Please check the output above'))
      child.kill('SIGINT')
      process.exit(1)
    }

    console.log('\x1Bc')
    console.log(chalk.green('Tests Passed'))
    child.kill('SIGINT')
    process.exit(0)
  })
}, 2000)
