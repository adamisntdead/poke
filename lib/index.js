const missingContent = require('./missing-content')
const imageSize = require('./image-size')
const chalk = require('chalk')
const ora = require('ora')
const url = require('url')

function poke(site) {
  const spinner = ora('Checking For Missing Content').start();
 
  // Check for broken links, media, iframes,
  // stylesheets, scripts, forms, metadata
  missingContent(site, (brokenLinks, workingLinks) => {
    spinner.text = 'Checking Size Of Images';

    const imageExtensions = ['jpeg','jpg','png','gif','bmp']
    const images = workingLinks.filter(link => strIncludes(url.parse(link, true).pathname, imageExtensions))

    imageSize(images, (largeImages) => {
      spinner.stop()
      report(brokenLinks, largeImages)
    })
  })
}

function report(brokenLinks, largeImages) {
  if (brokenLinks.length === 0) {
    console.log(chalk.green('No Missing / Broken Content Found :)'))
  } else {
    console.log(chalk.red('Missing / Broken Content Found :('))
    brokenLinks.forEach(link => console.log(link))
  }

  if (largeImages.length === 0) {
    console.log(chalk.green('\nNo Images Over 500kb :)'))
  } else {
    console.log(chalk.red('\nImages Over 500kb found :('))
    largeImages.forEach(link => console.log(link))
  }


}

function strIncludes(str, includes) {
  let doesInclude = false

  for (let i = 0; i < includes.length; i++) {
    if (str.includes(includes[i])) {
      doesInclude = true
    }
  }

  return doesInclude;
}

module.exports = poke