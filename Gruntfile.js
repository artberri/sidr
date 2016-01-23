/* eslint global-require:0 */
var babel = require('rollup-plugin-babel');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license %> */\n',

    clean: {
      dist: ['dist'],
      cssmin: [
        'dist/stylesheets/jquery.sidr.dark.css',
        'dist/stylesheets/jquery.sidr.light.css'
      ]
    },

    copy: {
      cssmin: {
        files: [
          {
            src: 'dist/stylesheets/jquery.sidr.light.css',
            dest: 'dist/stylesheets/jquery.sidr.light.min.css'
          },
          {
            src: 'dist/stylesheets/jquery.sidr.dark.css',
            dest: 'dist/stylesheets/jquery.sidr.dark.min.css'
          }
        ]
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/jquery.<%= pkg.name %>.min.js': ['dist/jquery.<%= pkg.name %>.js']
        }
      }
    },

    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: [
        '*.js',
        'src/**/*.js',
        'spec/*.js'
      ]
    },

    scsslint: {
      allFiles: ['src/scss/**/*'],
      options: {
        bundleExec: true,
        config: '.scss-lint.yml',
        colorizeOutput: true
      }
    },

    watch: {
      js: {
        files: ['src/jquery.sidr.js', 'src/js/*.js'],
        tasks: 'rollup'
      },
      compass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['compass:dev' ]
      }
    },

    compass: {
      options: {
        sassDir: 'src/scss',
        bundleExec: true
      },
      dev: {
        options: {
          sourcemap: true,
          cssDir: 'dist/stylesheets',
          outputStyle: 'expanded'
        }
      },
      dist: {
        options: {
          sourcemap: false,
          cssDir: 'dist/stylesheets',
          outputStyle: 'expanded',
          environment: 'production'
        }
      },
      distmin: {
        options: {
          sourcemap: false,
          cssDir: 'dist/stylesheets',
          noLineComments: true,
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        runnerPort: 9998
      }
    },

    codeclimate: {
      main: {
        options: {
          file: 'dist/coverage/lcov.info',
          token: process.env.CODECLIMATE_TOKEN,
          executable: 'node_modules/codeclimate-test-reporter/bin/codeclimate.js'
        }
      }
    },

    connect: {
      options: {
          port: 9000,
          hostname: 'localhost'
      },
      dist: {
          options: {
              open: 'http://localhost:9000/examples/index.html'
          }
      }
    },

    rollup: {
      options: {
        banner: '<%= banner %>',
        format: 'iife',
        globals: {
          jquery: 'jQuery'
        },
        plugins: [
          babel({
              exclude: './node_modules/**'
          })
        ]
      },
      files: {
        dest: 'dist/jquery.<%= pkg.name %>.js',
        src: 'src/jquery.<%= pkg.name %>.js'
      }
    }

  });

  grunt.registerTask('lint', [
    'eslint',
    'scsslint'
  ]);

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('qa', [
    'lint',
    'test'
  ]);

  grunt.registerTask('build', [
    'rollup',
    'compass:distmin',
    'copy:cssmin',
    'clean:cssmin',
    'compass:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('serve', [
    'clean:dist',
    'compass:dev',
    'rollup',
    'connect:dist',
    'watch'
  ]);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'qa', 'build']);

  grunt.registerTask('ci', ['default', 'codeclimate']);

};
