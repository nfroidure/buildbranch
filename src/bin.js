#!/usr/bin/env node

var buildBranch = require('./index.js')
  , branch = process.argv[2]
  , dir = process.argv[3]
;

buildBranch({
  branch: branch || 'gh-pages',
  folder: dir || 'www',
}, function(err) {
  if(err) {
    throw err;
  }
  console.log('Published!');
});
