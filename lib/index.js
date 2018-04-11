const missingContent = require('./missing-content')
const imageSize = require('./image-size')
const chalk = require('chalk')
const url = require('url')

function poke (site, options, callback = () => {}) {
  // Check for broken links, media, iframes,
  // stylesheets, scripts, forms, metadata
  missingContent(site, options, (brokenLinks, duplicateLinks, workingLinks) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp']
    const images = workingLinks.filter(link =>
      strIncludes(url.parse(link, true).pathname, imageExtensions)
    )

    imageSize(options.maxImageSize, images, largeImages => {
      report(site, brokenLinks, largeImages, duplicateLinks, options)
      callback(null, {
        brokenLinks,
        largeImages,
        duplicateLinks
      })
    })
  })
}

function report (site, brokenLinks, largeImages, duplicateLinks, options) {
  while (site.endsWith('/')) {
    site = site.slice(0, -1)
  }

  if (brokenLinks.size === 0) {
    console.log(chalk.bgGreen('No Missing / Broken Content Found'))
  } else {
    console.log(chalk.bgRed('Missing / Broken Content Found'))
    brokenLinks.forEach((origin, broken) =>
      console.log(chalk.underline(origin) + ' - ' + chalk.underline(broken))
    )
  }

  if (largeImages.length === 0) {
    console.log(chalk.bgGreen(`\nNo Images Over ${options.maxImageSize}kb`))
  } else {
    console.log(chalk.bgRed(`\nImages Over ${options.maxImageSize}kb found`))
    largeImages.forEach(link => console.log(chalk.underline(link)))
  }

  if (duplicateLinks.length === 0) {
    console.log(chalk.bgGreen(`\nNo Duplicate Pages Found`))
  } else {
    console.log(chalk.bgRed('\nDuplicate Pages Found'))
    duplicateLinks.forEach(link => console.log(`${chalk.underline(link[0])} and ${chalk.underline(link[1])}`))
  }
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
