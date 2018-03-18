# Poke
[![npm](https://img.shields.io/npm/v/poke-site.svg)](https://www.npmjs.com/package/poke-site)
[![Build Status](https://travis-ci.org/adamisntdead/poke.svg?branch=master)](https://travis-ci.org/adamisntdead/poke)


A simple tool to check your site for broken links, media, iframes, stylesheets, scripts, forms or metadata.
Will also test for images over 500kb.

## Usage

1. Install it: `npm install -g poke-site`
2. Run it: `poke <url>` where <url> is the base of the site you want to test
3. Profit

```
  Usage: poke [options] <url>


  Options:

    -V, --version  output the version number
    -h, --help     output usage information
```

Sample Output

![Sample Output](https://raw.githubusercontent.com/adamisntdead/poke/master/test/public/screenshot.png)

## Todo

* Could add reason for content being broken?
* Choose max size for images
* more tests