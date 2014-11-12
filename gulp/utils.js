/**
 * Shared utilities for gulp tasks
 */

var config = require('./config');
var util = require('gulp-util');

module.exports = {
  srcPathFor: function(type, file) {
    return config.srcPaths[type] + file;
  },

  logError: function(msg) {
    util.log(util.colors.red(msg));
  },

  log: function(msg) {
    util.log(util.colors.green(msg));
  }
};
