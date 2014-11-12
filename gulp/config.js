/**
 * Configuration file for gulp tasks
 */

module.exports = {
  srcPaths: {
    js: 'src/js/',
    img: 'src/images/',
    styles: 'src/styles/',
    html: 'src/index.html'
  },
  port: process.env.PYM_PORT || 9000,
  notifications: process.env.GULP_NOTIFICATIONS
};
