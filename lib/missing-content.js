const blc = require('broken-link-checker')

module.exports = (url, callback) => {
  const brokenLinks = []
  const links = []

  // Options for broken-link-checker
  const blcOptions = {
    filterLevel: 3,
    excludedSchemes: ['data', 'geo', 'javascript', 'mailto', 'sms', 'tel', '#']
  }

  // handlers
  const handlers = {
    link: (result) => { // When a link is checked
      const url = result.url.resolved
      // Where to put the link
      if (result.broken) {
        if (brokenLinks.indexOf(url) < 0) brokenLinks.push(url)
      } else {
        if (links.indexOf(url) < 0) links.push(url)
      }
    },
    end: () => { // When all links have been checked
      callback(brokenLinks, links)
    }
  }

  const siteChecker = new blc.SiteChecker(blcOptions, handlers)

  siteChecker.enqueue(url)
}
