module.exports = {

  options: {
    map: true,
    processors: [
      require('autoprefixer')({ browsers: ['last 2 versions'] })
    ]
  },

  dev: {
    src: '<%= tmp %>/styles/*.css'
  },

  dist: {
    options: {
      processors: [
        require('autoprefixer')({ browsers: ['last 2 versions'] }),
        require('cssnano')()
      ]
    },
    src: '<%= build %>/styles/*.css'
  }

};
