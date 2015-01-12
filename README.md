# gulp-build-branch
__Publish a folder to a given branch (like gh-pages).__

This plugin initializes a separate git repo in your build folder which it then
`git fetch`es into your main repo. This means your working copy doesn't get
clobbered.

PR's welcome!

## Usage

First, install `gulp-build-branch` as a development dependency:

```shell
npm install gulp-build-branch --save-dev
```

Then, use it in a Gulp task like this:

```javascript
var gulp = require('gulp');
var buildBranch = require('gulp-build-branch');

gulp.task('githubPages', ['build'], function() {
  return buildBranch({ folder: 'dist' });
});
```

## API

### buildBranch(options)

#### options
Type: `Object`

Required. An object containing the following options.

##### options.branch
Type: `String`
Default: 'gh-pages'

The branch on which to publish.

##### options.folder
Type: `String`
Default: 'dist'

The folder in which the build is.

##### options.commit
Type: `String`
Default: 'Build %curtimestamp%'

The commit label.

##### options.cwd
Type: `String`
Default: process.cwd()

The working directory (root of the git repo).
