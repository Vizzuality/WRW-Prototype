module.exports = {

  options: {
    notify: false,
    background: true
  },

  livereload: {
    options: {
      files: [
        '<%= src %>/{,*/}*.html',
        '<%= src %>/{,*/}*.jade',
        '<%= tmp %>/styles/{,*/}*.css',
        '<%= src %>/images/{,*/}*',
        '<%= src %>/scripts/{,*/}*.js'
      ],
      port: 3000,
      server: {
        baseDir: ['<%= tmp %>', '<%= src %>'],
        routes: {
          '/bower_components': './bower_components'
        }
      }
    }
  }

};
