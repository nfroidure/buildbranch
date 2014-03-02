// Publish task
var exec = require('child_process').exec
  , path = require('path')
  , rimraf = require('rimraf')
  , fs = require('fs')
;

function buildBranch(options, callback) {

  var curBranch = 'master'
    , execOptions = {}
    , command = ''
  ;

  // Checking options
  options.folder = options.folder || 'www';
  options.branch = options.branch || 'gh-pages';
  options.ignore = options.ignore || [];
  options.ignore.push('.git', 'node_modules', options.folder);
  options.cname = options.cname || 'CNAME';
  options.commit = options.commit || 'Build '+(new Date());
  options.cwd = options.cwd || process.cwd();
  execOptions.cwd = options.cwd;

  // Remember the current branch
  command = 'git rev-parse --abbrev-ref HEAD'

  exec(command, execOptions, function(err, stdout, stderr) {
    if(err) {
      callback(err); return;
    }

    curBranch = stdout.trim();

    // Switch to ghpages branch
    command = 'git branch -D ' + options.branch + ';'
      +' git checkout --orphan ' + options.branch + ';'
      +' git rm -r --cached .';

    exec(command, execOptions, function(err) {
      var ignore;
      if(err) {
        callback(err); return;
      }

      // delete all files except the untracked ones
      ignore = options.ignore.slice(0);
      fs.readdirSync(options.cwd).forEach(function(file) {
        if(-1 === ignore.indexOf(file)) {
          rimraf.sync(path.join(options.cwd, file));
        }
      });
      fs.readdirSync(path.join(options.cwd, options.folder))
        .forEach(function(file) {
          fs.renameSync(path.join(options.cwd, options.folder, file),
            path.join(options.cwd, file));
        });
      fs.rmdirSync(path.join(options.cwd, options.folder));

      // Add the domain cname field
      if(options.domain) {
        fs.writeFileSync(path.join(options.cwd, options.cname), options.domain);
      }

      // Add a new ignore file
      ignore.push('.gitignore');
      fs.writeFileSync(path.join(options.cwd, '.gitignore'), ignore.join('\n'));

      // Commit files
      command = 'git add .;'
              + ' git commit -m "' + options.commit.replace('"', '\\"') + '"';
      exec(command, execOptions, function(err) {
        if(err) {
          callback(err); return;
        }

        // Pushing commit
        command = 'git push -f origin ' + options.branch + ';'
                + ' git checkout ' + curBranch + ' ;'
                + ' git checkout .';

        exec(command, execOptions, function(err) {
          if(err) {
            callback(err); return;
          }

          callback();

        });
      });
    });
  });
}

module.exports = buildBranch;

