module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine', 'browserify'],
    logLevel: config.LOG_INFO,
    autoWatch: false,
    preprocessors : {
      'spec/**/*.js*': ['browserify'],
      'src/**/__tests__/*.js*': ['browserify']
    },
    files: [
      {pattern: 'spec/support/**/*', included: true},
      {pattern: 'spec/**/*.js*', included: true},
      {pattern: 'src/**/__tests__/*.js*', included: true},
    ],
    exclude: [
      'spec/support/karma.conf.js'
    ],
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 60000,
    reporters    : ['junit','coverage', 'dots'],
    junitReporter: {
      outputFile: 'test-results.xml'
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage'
    },
    browserify: {
      debug: true,
      transform: ['reactify'],
      plugins: ['proxyquire-universal'],
      extensions: ['.jsx']
    }
  });
};
