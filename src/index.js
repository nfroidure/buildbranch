// Publish task
var path = require('path'),
  util = require('gulp-util'),
  gift = require('gift'),
  q = require('q'),
  distRepoDir, distRepo, rootRepo, deferred, options = {};

function parseOptions(options_) {
  options.folder = options_.folder || 'dist';
  options.branch = options_.branch || 'gh-pages';
  options.cname = options_.cname || 'CNAME';
  options.commit = options_.commit || 'Build '+(new Date());
  options.cwd = options_.cwd || process.cwd();
  return options;
}

function fetchFromRootRepo() {
  rootRepo.remote_fetch('-f ' + options.folder + '/ master:' + options.branch, function(err) {
    if(err) throw err;

    deferred.resolve();
  });
}

function buildBranch(options_) {
  parseOptions(options_);
  deferred = q.defer();

  distRepoDir = path.join(options.cwd, options.folder);
  rootRepo = gift(options.cwd);


  // First, init repository in our dist dir
  gift.init(distRepoDir, function(err, repo) {

    // Check if repo, which may exist already, has any changes.
    repo.status(function(err, status) {
      if(status.clean) {
        util.log("BuildBranch:", util.colors.blue("No changes to be deployed."));

        // Fetch it anyway, in cases where multiple deploy branches might be wanted.
        fetchFromRootRepo();

      }else{

        // Otherwise, add everything to new repo,
        repo.add('-A', function(err) {
          if(err) throw err;

          // Commit,
          repo.commit(options.commit, function(err) {
            // And fetch the branch from our root repo.
            fetchFromRootRepo();
          });
        });
      }
    });
  });

  return deferred.promise;
}

module.exports = buildBranch;
