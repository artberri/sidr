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
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
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
      jshint: {
        files: '<config:jshint.all>',
        tasks: 'jshint'
      },
      compass: {
        files: ['src/scss/*.scss'],
        tasks: ['compass:prod' ]
      }
    },

    compass: {
      options: {
        sassDir: 'src/scss',
        bundleExec: true
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

  // Default task.
  grunt.registerTask('default', ['clean', 'qa', 'build']);

};
