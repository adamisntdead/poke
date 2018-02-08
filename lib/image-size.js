const remote = require('remote-file-size');

module.exports = (images, callback) => {
  const largeImages = []

  let i = 0;
  const cb = (bigger) => {
    if (bigger) largeImages.push(images[i])

    if (++i < largeImages.length) {
      testImage(images[i], cb)
    } else {
      callback(largeImages)
    }
  }

  testImage(images[0], cb)
}

// Returns { result: bool, url }
function testImage(url, callback) {
  remote(url, (err, size) => {
    if (err) callback(err)

    callback(size / 1000 > 500) // Bigger then 500kb
  })
}
