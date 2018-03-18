const missingContent = require('./missing-content');
const newServer = require('../test/server')

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

test('Will find the missing page', () => {
  missingContent(site, brokenLinks => {
    expect(brokenLinks).toContain(`${site}/nowhere.html`)
  });
})

test('Will not find the existing page', () => {
  missingContent(site, brokenLinks => {
    expect(brokenLinks).not.toContain(`${site}/index.html`)
    expect(brokenLinks).not.toContain(`${site}/another-page.html`)
  });
})

test('Will find the missing script', () => {
  missingContent(site, brokenLinks => {
    expect(brokenLinks).toContain(`${site}/main.js`)
  });
})