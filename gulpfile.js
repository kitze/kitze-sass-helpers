// dependencies
var gulp        = require('gulp'),
    git         = require('gulp-git'),
    bump        = require('gulp-bump'),
    filter      = require('gulp-filter'),
    _           = require('underscore'),
    tag_version = require('gulp-tag-version'),
    jsdoc       = require('gulp-jsdoc'),
    shell       = require('shelljs');

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 ? v0.1.1
 *     gulp feature   # makes v0.1.1 ? v0.2.0
 *     gulp release   # makes v0.2.1 ? v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance) {
  gulp.src(['./bower.json'])
    .pipe(bump({type: importance}))
    .pipe(gulp.dest('./'));

  gulp.src(['./js', './sass', './tests', './gulpfile.js', './bower.json'])
    .pipe(git.commit('Bumps package version including changes in all files.'))
    .pipe(filter('bower.json'))
    .pipe(tag_version());
}

gulp.task('push', function () {
  shell.exec('git push -u origin master --tags');
});

gulp.task('doc', function () {
  gulp.src(["./js/*.js", "README.md"])
    .pipe(jsdoc('./documentation-output'))
});
gulp.task('patch', function () {
  return inc('patch');
});
gulp.task('feature', function () {
  return inc('minor');
});
gulp.task('release', function () {
  return inc('major');
});