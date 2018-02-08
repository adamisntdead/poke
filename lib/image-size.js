const remote = require('remote-file-size');

module.exports = (images, callback) => {
  const largeImages = [];

  let i = 0;
  function go() {
    if (i < images.length) {
      testImage(images[i], (size, url) => {
        if (size / 1000 > 500) largeImages.push(url);

        i++;
        go();
      });
    } else {
      callback(largeImages);
    }
  }

  go();
};

// Returns { result: bool, url }
function testImage(url, callback) {
  remote(url, (err, size) => {
    if (err) console.log(err);

    callback(size, url);
  });
}
