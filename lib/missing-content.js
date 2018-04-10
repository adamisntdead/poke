const blc = require('broken-link-checker')
const ora = require('ora')
const cliTruncate = require('cli-truncate')

module.exports = (url, options, callback) => {
  const spinner = ora('Checking For Missing Content').start()
  const brokenLinks = new Map()
  const links = []

  let currentPage
  let redirectedHome
  const urlChecker = new blc.UrlChecker(options, {
    link: function (result, customData) {
      const checkedUrl = result.url.resolved
      spinner.text = cliTruncate(
        'Checking ' + checkedUrl,
        process.stdout.columns - 3
      )
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
    },
    link: result => {
      // When a link is checked
      const checkedUrl = result.url.resolved
      spinner.text = cliTruncate(
        'Checking ' + checkedUrl,
        process.stdout.columns - 3
      )
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
          // Add everyting if not shallow otherwise make sure new url is rooted with base url
          if (!options.shallow) siteChecker.enqueue(checkedUrl)
          else if (checkedUrl.startsWith(url)) siteChecker.enqueue(checkedUrl)
          links.push(checkedUrl)
        }
      }
    },
    end: () => {
      // When all links have been checked
      spinner.stop()
      callback(brokenLinks, links)
    }
  }
  const siteChecker = new blc.HtmlUrlChecker(options, handlers)

  siteChecker.enqueue(url)
}
