'use strict';

const exec = require('child_process').exec;
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

function buildBranch(options, callback) {

  let curBranch = 'master';
  const execOptions = {};
  let command = '';

  // Checking options
  options.folder = options.folder || 'www';
  options.branch = options.branch || 'gh-pages';
  options.remote = options.remote || 'origin';
  options.ignore = options.ignore || [];
  options.ignore.push('.git', 'node_modules', options.folder);
  options.cname = options.cname || 'CNAME';
  options.commit = (options.commit || 'Build $').replace('$', (new Date()).toISOString());
  options.cwd = options.cwd || process.cwd();
  options.noVerify = options.noVerify || false;
  execOptions.cwd = options.cwd;

  // Remember the current branch
  command = 'git rev-parse --abbrev-ref HEAD';

  exec(command, execOptions, (err, stdout) => {
    if(err) {
      callback(err); return;
    }

    curBranch = stdout.trim();

    // Switch to ghpages branch
    command = 'git branch -D ' + options.branch + ';' +
      ' git checkout --orphan ' + options.branch + ';' +
      ' git rm -r --cached .';

    exec(command, execOptions, (err) => {
      let ignore;

      if(err) {
        callback(err); return;
      }

      // delete all files except the untracked ones
      ignore = options.ignore.slice(0);
      fs.readdirSync(options.cwd).forEach((file) => {
        if(-1 === ignore.indexOf(file)) {
          rimraf.sync(path.join(options.cwd, file));
        }
      });
      // Check if build folder exists and is not empty
      if(!fs.existsSync(options.folder) || !fs.readdirSync(options.folder).length) {
        callback(new Error('Build folder doesn\'t exist or is empty.')); return;
      }
      fs.readdirSync(path.join(options.cwd, options.folder))
        .forEach((file) => {
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
      command = 'git add .;' +
        ' git commit -m "' + options.commit.replace('"', '\\"') + '"' +
        (options.noVerify ? ' --no-verify' : '');
      exec(command, execOptions, (err) => {
        if(err) {
          callback(err); return;
        }

        // Pushing commit
        command = 'git push -f ' + options.remote + ' ' + options.branch + ';' +
                  ' git checkout ' + curBranch + ' ;' +
                  ' git checkout .';

        exec(command, execOptions, (err) => {
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
