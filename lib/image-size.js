const remote = require('remote-file-size')
const ora = require('ora')
const cliTruncate = require('cli-truncate')

module.exports = (images, options, callback) => {
  const maxSize = options.maxImageSize || 500
  const spinner = ora('Checking The Size Of Images...')
  if (!options.quiet) {
    spinner.start()
  }

  const largeImages = []

  let i = 0
  function go () {
    if (i < images.length) {
      if (!options.quiet) {
        spinner.text = cliTruncate(
          'Checking ' + images[i],
          process.stdout.columns - 3
        )
      }
      testImage(images[i], options, (size, url) => {
        if (size / 1000 > maxSize) largeImages.push(url)

        i++
        go()
      })
    } else {
      if (!options.quiet) {
        spinner.stop()
      }
      callback(largeImages)
    }
  }

  go()
}

// Returns { result: bool, url }
function testImage (url, options, callback) {
  remote(url, (err, size) => {
    if (err && !options.quiet) {
      // skip a line for spinner
      console.log(`
failed to fetch ${url}`)
      console.log(err)
    }

    callback(size, url)
  })
}
