#!/usr/bin/env node

'use strict';

const buildBranch = require('./index.js');
const branch = process.argv[2];
const dir = process.argv[3];
const domain = process.argv[4];
const noVerify = process.argv[5];

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
