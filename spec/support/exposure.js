/**
 * Expose some libraries needed for testing
 */
require('./phantomjs-shims');
window.React = require('react/addons');
window.ReactTestUtils = window.React.addons.TestUtils;
