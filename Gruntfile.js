/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('sidr.jquery.json'),
    concat: {
      dist: {
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
      },
      pkg: {
        files: {
          'package/jquery.<%= pkg.name %>.min.js': ['dist/jquery.<%= pkg.name %>.js']
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
    watch: {
      jshint: {
        files: '<config:jshint.all>',
        tasks: 'jshint'
      },
      compass: {
        files: [ 'src/scss/*.scss' ],
        tasks: [ 'compass:dev', 'compass:prod' ]
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'dist/stylesheets'
        }
      },
      prod: {
        options: {
          sassDir: 'src/scss',
          cssDir: 'package/stylesheets',
          environment: 'production'
        }
      }
    }
  });

  // Loading compass task
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'compass', 'uglify']);

};
