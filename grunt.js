/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:sidr.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.<%= pkg.name %>.js>'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'package/jquery.<%= pkg.name %>.min.js'
      }
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    watch: {
      lint: {
        files: '<config:lint.files>',
        tasks: 'lint'
      },
      compass: {
        files: [ 'src/stylesheets/*.scss' ],
        tasks: [ 'compass:dev', 'compass:prod' ]
      }
    },
    jshint: {
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
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    compass: {
      dev: {
        src: 'src/stylesheets',
        dest: 'dist/stylesheets',
        linecomments: true,
        forcecompile: true,
        debugsass: true
      },
      prod: {
        src: 'src/stylesheets',
        dest: 'package/stylesheets',
        outputstyle: 'compressed',
        linecomments: false,
        forcecompile: true,
        debugsass: false
      }
    }
  });

  // Loading compass task
  grunt.loadNpmTasks('grunt-compass');

  // Default task.
  grunt.registerTask('default', 'lint concat min compass');

};
