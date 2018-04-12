const blc = require('broken-link-checker')
const ora = require('ora')
const cliTruncate = require('cli-truncate')
const parse5 = require('parse5')
const md5 = require('md5')

module.exports = (url, options, callback) => {
  const spinner = ora('Checking For Missing Content')
  if (!options.quiet) {
    spinner.start()
  }
  const brokenLinks = new Map()
  const pageHashes = new Map()
  const duplicateLinks = []
  const links = []

  // Options for broken-link-checker
  const blcOptions = {
    filterLevel: 3,
    honorRobotExclusions: false,
    excludedSchemes: ['data', 'geo', 'javascript', 'mailto', 'sms', 'tel', '#'],
    requestMethod: options.method
  }

  let currentPage
  let redirectedHome

  const urlChecker = new blc.UrlChecker(blcOptions, {
    link: function (result, customData) {
      const checkedUrl = result.url.resolved
      if (!options.quiet) {
        spinner.text = cliTruncate(
          'Checking ' + checkedUrl,
          process.stdout.columns - 3
        )
      }
      if (
        result.broken &&
        result.brokenReason === 'HTTP_404' &&
        !brokenLinks.has(checkedUrl)
      ) {
        brokenLinks.set(checkedUrl, currentPage)
      }
    },
    end: () => {
      siteChecker.resume()
    }
  })

  // handlers
  const handlers = {
    html: (tree, robots, response, pageUrl, customData) => {
      currentPage = response.url
      if (!redirectedHome) redirectedHome = currentPage
      const htmlString = parse5.serialize(tree)
      const htmlHash = md5(htmlString)
      const cleanedLink = pageUrl.replace(/\/$/, '') // Solve trailing slashes. I have choosen to leave querystrings
      if (
        pageHashes.has(htmlHash) &&
        pageHashes.get(htmlHash) !== cleanedLink
      ) {
        duplicateLinks.push([pageUrl, pageHashes.get(htmlHash)])
      } else {
        pageHashes.set(htmlHash, cleanedLink)
      }
    },
    link: result => {
      // When a link is checked
      const checkedUrl = result.url.resolved
      if (!options.quiet) {
        spinner.text = cliTruncate(
          'Checking ' + checkedUrl,
          process.stdout.columns - 3
        )
      }
      // Where to put the link
      if (result.broken && result.brokenReason === 'HTTP_404') {
        if (
          options.retry &&
          checkedUrl.startsWith(url) &&
          !checkedUrl.startsWith(redirectedHome)
        ) {
          // check the retry link
          urlChecker.enqueue(checkedUrl.replace(url, options.retry))
          siteChecker.pause()
        } else if (!brokenLinks.has(checkedUrl)) {
          brokenLinks.set(checkedUrl, currentPage)
        }
      } else {
        if (links.indexOf(checkedUrl) < 0) {
          // Add everything if not shallow otherwise make sure new url is rooted with base url
          if (!options.shallow) siteChecker.enqueue(checkedUrl)
          else if (checkedUrl.startsWith(url)) {
            siteChecker.enqueue(checkedUrl)
          }
          links.push(checkedUrl)
        }
      }
    },
    end: () => {
      // When all links have been checked
      if (!options.quiet) {
        spinner.stop()
      }
      callback(brokenLinks, duplicateLinks, links)
    }
  }
  const siteChecker = new blc.HtmlUrlChecker(blcOptions, handlers)

  siteChecker.enqueue(url)
}
