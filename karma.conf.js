/* eslint global-require:0 */
let babelrc = require('babelrc-rollup').default
let babel = require('rollup-plugin-babel')
let istanbul = require('rollup-plugin-istanbul')

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({

    basePath: './',

    frameworks: ['mocha', 'chai', 'sinon-chai', 'jquery-1.8.3'],

    files: [
      { pattern: 'spec/**/*.spec.js', watched: false }
    ],

    preprocessors: {
      'spec/**/*.spec.js': ['rollup']
    },

    reporters: ['mocha', 'coverage'],

    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    browsers: ['ChromeHeadless'],

    rollupPreprocessor: {
      plugins: [
        istanbul({
          exclude: ['spec/**/*.spec.js']
        }),
        babel(babelrc())
      ],
      format: 'iife',
      name: 'sidr',
      sourcemap: 'inline'
    },

    coverageReporter: {
      dir: 'coverage',
      includeAllSources: true,
      reporters: [
        {'type': 'text'},
        {'type': 'html', subdir: 'html'},
        {'type': 'lcov', subdir: './'}
      ]
    }
  })
}
