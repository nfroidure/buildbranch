#!/usr/bin/env node

'use strict';

var buildBranch = require('./index.js');
var branch = process.argv[2];
var dir = process.argv[3];
var domain = process.argv[4];
var noVerify = process.argv[4];

buildBranch({
  branch: branch || 'gh-pages',
  folder: dir || 'www',
  domain: domain || '',
  noVerify: !!noVerify,
}, function buildBranchCLICb(err) {
  if(err) {
    throw err;
  }
  console.log('Published!'); // eslint-disable-line
});
