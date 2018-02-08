# Poke
[![npm](https://img.shields.io/npm/v/site-poke.svg)](https://www.npmjs.com/package/site-poke)

A simple tool to check your site for broken links, media, iframes, stylesheets, scripts, forms or metadata.

## Usage

1. Install it: `npm install -g site-poke`
2. Run it: `poke <url>` where <url> is the base of the site you want to test
3. Profit

```
  Usage: poke [options] <url>


  Options:

    -V, --version  output the version number
    -h, --help     output usage information
```

Sample Output

```
$ poke http://localhost:4000/

Missing / Broken Content Found :(
http://localhost:4000/request-a-demo
http://localhost:4000/terms
http://localhost:4000/news/

No Images Over 500kb :)
```

## Todo

* Could add reasosn for content being broken?
* Choose max size for images
* more tests