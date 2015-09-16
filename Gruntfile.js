'use strict';

var path = require('path');

module.exports = function (grunt) {

  var options = {

    configPath: path.join(process.cwd(), 'grunt'),

    init: true,

    data: {
      src: './src',
      build: './dist',
      tmp: './.tmp'
    },

    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    }

  };

  require('load-grunt-tasks')(grunt);
  require('load-grunt-config')(grunt, options);

  grunt.registerTask('default', [
    'clean',
    'jade:dev',
    'sass:dev',
    'postcss:dev',
    'browserSync:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'jade:dist',
    'sass:dist',
    'postcss:dist',
    'imagemin',
    'svgmin',
    'requirejs'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

};
