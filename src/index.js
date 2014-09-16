// Publish task
var exec = require('child_process').exec,
  path = require('path'),
  rimraf = require('rimraf'),
  fs = require('fs')
;

function buildBranch(options, callback) {

  var execOptions = {},
    command = ''
  ;

  // Checking options
  options.folder = options.folder || 'www';
  options.branch = options.branch || 'gh-pages';
  options.cname = options.cname || 'CNAME';
  options.commit = options.commit || 'Build '+(new Date());
  options.cwd = options.cwd || process.cwd();
  execOptions.cwd = options.cwd;

  // Switch to ghpages branch
  fs.exists(path.join(options.cwd, options.folder, '.git'), function(exists) {

    if(!exists) {
      command = 'git init ' + options.folder;
    }else{
      command = ':'; // noop
    }

    exec(command, execOptions, function(err) {
      if(err) {
        callback(err); return;
      }

      // Add the domain cname field
      if(options.domain) {
        fs.writeFileSync(path.join(options.cwd, options.folder, options.cname), options.domain);
      }

      // Commit files
      command = '(cd ' + options.folder + ' && ' +
              'git add -A . && ' +
              'git commit -m "' + options.commit.replace('"', '\\"') + '" )';

      exec(command, execOptions, function(err) {
        if(err) {
          callback(); return;
        }

        // Fetch branch into our repo.
        command = 'git fetch ' + options.folder + ' master:' + options.branch;

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
