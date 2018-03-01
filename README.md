# Box-Packer NodeJS module [![Build Status](https://travis-ci.org/aleksandar-babic/box_packer_node.svg?branch=master)](https://travis-ci.org/aleksandar-babic/box_packer_node)
This module is 1:1 port of Ruby box_packer gem (https://github.com/mushishi78/box_packer) written for NodeJS. Module can be required as every other node module using require() method.
```javascript
# Minified version
const BoxPacker = require('./lib/box-packer-module/dist')
# Original version
const BoxPacker = require('./lib/box-packer-module/src')
```

Module has method pack({container, items}) exposed, with exactly same signature as original (ruby version).
Example of module usage:
```javascript
const BoxPacker = require('../src/index')

BoxPacker.pack({
  container: {
    dimensions: [15, 20, 13],
    weight_limit: 50
  },
  items: [
    {
      dimensions: [2, 3, 5],
      weight: 47
    },
    {
      dimensions: [2, 3, 5],
      weight: 47
    },
    {
      dimensions: [3, 3, 1],
      weight: 24
    },

    {
      dimensions: [1, 1, 4],
      weight: 7
    }
  ]
})
  .then(packings => {
    console.dir(packings, {depth: null})
  })
  .catch(err => {
    // Handle error
    console.error(err)
  })
```

> Module is returning **Promise**, not plain Object (can run async).

Module has its own package.json and in it scripts:

1. build - runs babel-minify to minify index.js from src, output is saved in dist directory
2. build:prod - runs babel-minify to minify index.js from src, output is saved in dist directory, sets BABEL_ENV=production varaible
3. test - runs Jest testing framework and all module unit tests once
4. test:watch - runs Jest testing framework and all module unit tests on every file save(change)

> Example (with same values as example from original repo) can be found in examples/example.js
