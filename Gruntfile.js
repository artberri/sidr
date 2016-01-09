/*global module:false, require:false*/
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist'],
      cssmin: [
        'dist/stylesheets/jquery.sidr.dark.css',
        'dist/stylesheets/jquery.sidr.light.css'
      ]
    },

    copy: {
      js: {
        files: [{
          src: 'src/jquery.<%= pkg.name %>.js',
          dest: 'dist/jquery.<%= pkg.name %>.js'
        }]
      },
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
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= pkg.license %> */\n'
      },
      dist: {
        files: {
          'dist/jquery.<%= pkg.name %>.min.js': ['dist/jquery.<%= pkg.name %>.js']
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        jshintrc: true
      }
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
        files: ['src/jquery.sidr.js'],
        tasks: 'copy:js'
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
    }

  });

  grunt.registerTask('lint', [
    'jshint',
    'scsslint'
  ]);

  grunt.registerTask('qa', [
    'lint'
  ]);

  grunt.registerTask('build', [
    'copy:js',
    'compass:distmin',
    'copy:cssmin',
    'clean:cssmin',
    'compass:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('serve', [
    'clean:dist',
    'compass:dev',
    'copy:js',
    'connect:dist',
    'watch'
  ]);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'qa', 'build']);

};
