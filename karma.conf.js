/* eslint global-require:0 */
var babel = require('rollup-plugin-babel'),
    istanbul = require('rollup-plugin-istanbul');

module.exports = function (config) {
    'use strict';

    config.set({

        basePath: './',

        frameworks: ['mocha', 'chai', 'sinon-chai', 'jquery-1.8.3'],

        files: [
            'spec/*.spec.js'
        ],

        preprocessors: {
            'spec/*.spec.js': ['rollup']
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

        rollupPreprocessor: {
            rollup: {
                plugins: [
                    babel({
                        presets: [
                            require('babel-preset-es2015-rollup')
                        ]
                    }),
                    istanbul({
                        exclude: ['spec/*.spec.js']
                    })
                ]
            },
            bundle: {
                sourceMap: 'inline'
            }
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
