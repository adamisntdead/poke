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

    if (options.skipImages) {
      const success = report(site, brokenLinks, [], duplicateLinks, options)
      callback(success, {
        brokenLinks,
        duplicateLinks
      })
    } else {
      imageSize(images, options, largeImages => {
        const success = report(
          site,
          brokenLinks,
          largeImages,
          duplicateLinks,
          options
        )
        callback(success, {
          brokenLinks,
          largeImages,
          duplicateLinks
        })
      })
    }
  })
}

function report (site, brokenLinks, largeImages, duplicateLinks, options) {
  let success = true
  while (site.endsWith('/')) {
    site = site.slice(0, -1)
  }

  if (brokenLinks.size === 0) {
    console.log(chalk.green('No Missing / Broken Content Found'))
  } else {
    console.log(chalk.red('Missing / Broken Content Found'))
    brokenLinks.forEach((origin, broken) =>
      console.log(chalk.underline(origin) + ' - ' + chalk.underline(broken))
    )
    success = false
  }
  if (Array.isArray(largeImages) && !options.skipImages) {
    if (largeImages.length === 0) {
      console.log(chalk.green(`\nNo Images Over ${options.maxImageSize}kb`))
    } else {
      console.log(chalk.red(`\nImages Over ${options.maxImageSize}kb found`))
      largeImages.forEach(link => console.log(' - ' + link))
      success = false
    }
  }

  if (!options.skipDuplicates) {
    if (duplicateLinks.length === 0) {
      console.log(chalk.green(`\nNo Duplicate Pages Found`))
    } else {
      console.log(chalk.red('\nDuplicate Pages Found'))
      duplicateLinks.forEach(link =>
        console.log(
          `${chalk.underline(link[0])} and ${chalk.underline(link[1])}`
        )
      )
      success = false
    }
  }
  return success
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
