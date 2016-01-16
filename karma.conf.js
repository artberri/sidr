module.exports = function (config) {
    'use strict';

    config.set({

        basePath: './',

        frameworks: ['browserify', 'mocha', 'chai', 'sinon-chai', 'jquery-1.8.3'],

        files: [
            'spec/*.spec.js'
        ],

        preprocessors: {
          'spec/*.spec.js': ['browserify']
        },

        reporters: ['mocha', 'coverage'],

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS'],

        browserify: {
            debug: true,
            transform: [
                ['babelify', {
                    sourceMap: true,
                    presets: ['babel-preset-es2015']
                }],
                ['browserify-istanbul', {
                    ignore: ['**/*.spec.js'],
                    instrumenterConfig: {
                        embedSource: true
                    }
                }]
            ]
        },

        coverageReporter: {
            dir: 'dist/coverage',
            includeAllSources: true,
            reporters: [
                {'type': 'text'},
                {'type': 'html', subdir: 'html'},
                {'type': 'lcov', subdir: './'}
            ]
        }
    });
};
