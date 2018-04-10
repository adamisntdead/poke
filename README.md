# Poke
[![npm](https://img.shields.io/npm/v/poke-site.svg)](https://www.npmjs.com/package/poke-site)
[![Build Status](https://travis-ci.org/adamisntdead/poke.svg?branch=master)](https://travis-ci.org/adamisntdead/poke)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A simple tool to check your site for broken links, media, iframes, stylesheets, scripts, forms or metadata.
Will also test for images over 500kb.

## Usage

1. Install it: `npm install -g poke-site`
2. Run it: `poke <url>` where <url> is the base of the site you want to test
3. Profit

```
  Usage: poke [options] <url>

  Options:

    -V, --version        Output the version number
    -r, --retry [value]  Broken links are retried with new hostname
    -s, --shallow        Do not check pages rooted outside of provided url
    -h, --help           Output usage information
```

Sample Output

![Sample Output](https://raw.githubusercontent.com/adamisntdead/poke/master/test/public/screenshot.png)

Usually you should run with the `--shallow` option, otherwise you might get into checking for broken links in twitter or another external site, which you may not want!
## Todo

* Could add reason for content being broken?
* Choose max size for images
* More tests
* Find duplicate pages (Md5 hash each page)
* SEO data too lang, short, missing or duplicated
* Multiple Processes?

## License

MIT