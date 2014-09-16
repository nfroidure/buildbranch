# gulp-build-branch
> Publish a folder to a given branch (like gh-pages).

## Usage

You can use this from the command-line or within your build system.

### Build System

First, install `gulp-build-branch` as a development dependency:

```shell
npm install gulp-build-branch --save-dev
```

Then, use in Gulp like this:

```javascript
var gulp = require('gulp');
var buildBranch = require('gulp-build-branch');

gulp.task('gh', ['build'], function() {
  return buildBranch({ folder: 'dist' });
});
```

## API

### buildBranch(options, callback)

#### options
Type: `Object`

Required. An object containing the following options.

##### options.branch
Type: `String`
Default: 'gh-pages'

The branch on wich to publish.

##### options.folder
Type: `String`
Default: 'www'

The folder in which the build is.

##### options.commit
Type: `String`
Default: 'Build %curtimestamp%'

The commit label.

##### options.cwd
Type: `String`
Default: process.cwd()

The working directory (root of the git repo).

### Contributing / Issues

You may want to contribute to this project, pull requests are welcome if you
 accept to publish under the MIT licence.
