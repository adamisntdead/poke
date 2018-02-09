const blc = require('broken-link-checker');
const ora = require('ora');
const cliTruncate = require('cli-truncate');

module.exports = (url, callback) => {
  const spinner = ora('Checking For Missing Content').start();
  const brokenLinks = [];
  const links = [];

  // Options for broken-link-checker
  const blcOptions = {
    filterLevel: 3,
    honorRobotExclusions: false,
    excludedSchemes: ['data', 'geo', 'javascript', 'mailto', 'sms', 'tel', '#']
  };

  // handlers
  const handlers = {
    link: result => {
      // When a link is checked
      const url = result.url.resolved;
      spinner.text = cliTruncate('Checking ' + url, process.stdout.columns - 3);
      // Where to put the link
      if (result.broken && result.brokenReason === 'HTTP_404') {
        if (brokenLinks.indexOf(url) < 0) brokenLinks.push(url);
      } else {
        if (links.indexOf(url) < 0) links.push(url);
      }
    },
    end: () => {
      // When all links have been checked
      spinner.stop();
      callback(brokenLinks, links);
    }
  };

  const siteChecker = new blc.SiteChecker(blcOptions, handlers);

  siteChecker.enqueue(url);
};
