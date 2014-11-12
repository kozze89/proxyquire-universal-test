var gulp = require('gulp');
var karma = require('karma').server;
var utils = require('../utils');
var path = require('path');

gulp.task('karma', function(done) {

  // Update NODE_PATH to use js dir as top level (allows for neater requires in
  // our tests)
  process.env.NODE_PATH = path.normalize(path.join(
    __dirname, '../../node_modules')) + ':' +
  path.normalize(path.join(__dirname, '/../../src/js'));

  utils.log('Using ' + process.env.NODE_PATH +
    ' as base path for browserify requires');

  return karma.start({
    configFile: path.join(__dirname, '../../spec/support/karma.conf.js'),
    singleRun: true
  }, done);
});

