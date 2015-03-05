#!/usr/bin/env node

var buildBranch = require('./index.js')
  , branch = process.argv[2]
  , dir = process.argv[3]
  , domain = process.argv[4]
;

buildBranch({
  branch: branch || 'gh-pages',
  folder: dir || 'www',
  domain: domain || '',
}, function(err) {
  if(err) {
    throw err;
  }
  console.log('Published!');
});
