# buildbranch
> Publish a folder to a given branch (like gh-pages).

## Usage

You can use this from the command-line or within your build system.

### Command-line

First, install `buildbranch` globally:

```shell
npm install buildbranch -g
```

Then, from your master branch, run `buildbranch` with the branch and directory
 you want to publish. It will default to `gh-pages` and `www`.

```shell
buildbranch gh-pages www example.com
```

### Build System

First, install `buildbranch` as a development dependency:

```shell
npm install buildbranch --save-dev
```

Then, use it in your build system:

```javascript
  buildBranch({
    branch: 'gh-pages',
    remote: 'origin',
    ignore: ['.git', 'www', 'node_modules'],
    folder: 'www',
    domain: 'example.com',
  }, function(err) {
    if(err) {
      throw err;
    }
    console.log('Published!');
  });
```

For example in gulp you can do it like this:

```javascript
var gulp = require('gulp');
var buildBranch = require('buildbranch');

gulp.task('gh', ['build'], function(done) {
  buildBranch({ folder: 'dist' }, done);
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

##### options.remote
Type: `String`
Default: 'origin'

The remote repository on wich to publish.

##### options.folder
Type: `String`
Default: 'www'

The folder in wich the build is.

##### options.domain
Type: `String`

The domain name that will fill the cname file.

##### options.cname
Type: `String`
Default: 'CNAME'

The name of the file enabling custom domain name on you build platform.

##### options.commit
Type: `String`
Default: 'Build $'

The commit label, the first `$` occurrence in the given string will be replaced
 by the current date.

##### options.cwd
Type: `String`
Default: process.cwd()

The working directory (root of the git repo).

##### options.ignore
Type: `Array`

A list of files to ignore. 'node_modules' and '.git' will be automatically
 added to the ignore list.

#### callback
Type: `Function`

Required. Called when the publication is done.

### Contributing / Issues

You may want to contribute to this project, pull requests are welcome if you
 accept to publish under the MIT licence.
