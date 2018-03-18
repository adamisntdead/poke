const imageSize = require('./image-size')
const newServer = require('../test/server')
const missingContent = require('./missing-content')

let app;
let site;

beforeAll(() => {
  return new Promise((resolve) => {
    app = newServer((port, server) => {
      site = `http://localhost:${port}`
      
      resolve()
    })
  })
})

afterAll(() => {
  app.close()
})

test('Will find the big image', () => {
  missingContent(site, (brokenLinks, missingLinks) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const images = workingLinks.filter(link =>
      strIncludes(url.parse(link, true).pathname, imageExtensions)
    );

    imageSize(images, largeImages => {
      expect(largeImages).toContain(`${site}/big-image.jpg`)
    });
  });
})

test('Will not find the small image', () => {
  missingContent(site, (brokenLinks, missingLinks) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const images = workingLinks.filter(link =>
      strIncludes(url.parse(link, true).pathname, imageExtensions)
    );

    imageSize(images, largeImages => {
      expect(largeImages).not.toContain(`${site}/screenshot.png`)
    });
  });
})
