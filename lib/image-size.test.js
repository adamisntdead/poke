/* eslint-env jest */

const imageSize = require('./image-size')
const newServer = require('../test/server')
const missingContent = require('./missing-content')
const url = require('url')

let app
let site

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
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp']
    const images = missingLinks.filter(link =>
      url.parse(link, true).pathname.includes(imageExtensions)
    )

    imageSize(500, images, largeImages => {
      expect(largeImages).toContain(`${site}/big-image.jpg`)
    })
  })
})

test('Will not find the small image', () => {
  missingContent(site, (brokenLinks, missingLinks) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp']
    const images = missingLinks.filter(link =>
      url.parse(link, true).pathname.includes(imageExtensions)
    )

    imageSize(500, images, largeImages => {
      expect(largeImages).not.toContain(`${site}/screenshot.png`)
    })
  })
})
