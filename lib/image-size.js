const remote = require('remote-file-size')
const ora = require('ora')
const cliTruncate = require('cli-truncate')

module.exports = (maxSize = 500, images, callback) => {
  const spinner = ora('Checking The Size Of Images...').start()

  const largeImages = []

  let i = 0
  function go () {
    if (i < images.length) {
      spinner.text = spinner.text = cliTruncate(
        'Checking ' + images[i],
        process.stdout.columns - 3
      )
      testImage(images[i], (size, url) => {
        if (size / 1000 > maxSize) largeImages.push(url)

        i++
        go()
      })
    } else {
      spinner.stop()
      callback(largeImages)
    }
  }

  go()
}

// Returns { result: bool, url }
function testImage (url, callback) {
  remote(url, (err, size) => {
    if (err) {
      // skip a line for spinner
      console.log(`
failed to fetch ${url}`)
      console.log(err)
    }

    callback(size, url)
  })
}
