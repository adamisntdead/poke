const missingContent = require('./missing-content')
const imageSize = require('./image-size')
const chalk = require('chalk')
const url = require('url')

function poke (site, options) {
  // Check for broken links, media, iframes,
  // stylesheets, scripts, forms, metadata
  missingContent(site, options, (brokenLinks, workingLinks) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp']
    const images = workingLinks.filter(link =>
      strIncludes(url.parse(link, true).pathname, imageExtensions)
    )

    imageSize(options.maxImageSize, images, largeImages => {
      report(site, brokenLinks, largeImages, options)
    })
  })
}

function report (site, brokenLinks, largeImages, options) {
  let error = false

  while (site.endsWith('/')) {
    site = site.slice(0, -1)
  }

  if (brokenLinks.size === 0) {
    console.log(chalk.green('No Missing / Broken Content Found :)'))
  } else {
    error = true
    console.log(chalk.red('Missing / Broken Content Found :('))
    brokenLinks.forEach((origin, broken) =>
      console.log(origin + ' - ' + broken)
    )
  }

  if (largeImages.length === 0) {
    console.log(chalk.green(`\nNo Images Over ${options.maxImageSize}kb :)`))
  } else {
    error = true
    console.log(chalk.red(`\nImages Over ${options.maxImageSize}kb found :(`))
    largeImages.forEach(link => console.log(' - ' + link))
  }

  error ? process.exit(1) : process.exit(0)
}

function ensureString (str) {
  return str || ''
}

function strIncludes (str, includes) {
  let doesInclude = false

  for (let i = 0; i < includes.length; i++) {
    if (ensureString(str).includes(includes[i])) {
      doesInclude = true
    }
  }

  return doesInclude
}

module.exports = poke
