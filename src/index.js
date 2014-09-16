// Publish task
var path = require('path'),
  util = require('gulp-util'),
  gift = require('gift'),
  q = require('q');

function parseOptions(options) {
  options.folder = options.folder || 'www';
  options.branch = options.branch || 'gh-pages';
  options.cname = options.cname || 'CNAME';
  options.commit = options.commit || 'Build '+(new Date());
  options.cwd = options.cwd || process.cwd();
  return options;
}

function buildBranch(options_) {
  var options, distRepoDir, distRepo, rootRepo, deferred;
  options = parseOptions(options_);
  deferred = q.defer();

  distRepoDir = path.join(options.cwd, options.folder);
  rootRepo = gift(options.cwd);


  // First, init repository in our dist dir
  gift.init(distRepoDir, function(err, repo) {

    // Check if repo, which may exist already, has any changes.
    repo.status(function(err, status) {
      if(status.clean) {
        util.log("BuildBranch:", util.colors.blue("No changes to be deployed."));
        deferred.resolve();

      }else{

        // Otherwise, add everything to new repo,
        repo.add('* -A', function(err) {
          if(err) throw err;

          // Commit,
          repo.commit(options.commit, function(err) {

            // And fetch the branch from our root repo.
            rootRepo.remote_fetch(options.folder + '/ master:' + options.branch, function(err) {
              if(err) throw err;

              deferred.resolve();
            });

          });
        });
      }
    });
  });

  return deferred.promise;
}

module.exports = buildBranch;
