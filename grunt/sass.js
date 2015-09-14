module.exports = {

  options: {
    sourceMap: false,
    includePaths: ['.']
  },

  dev: {
    options: {
      style: 'expanded'
    },
    files: [{
      '<%= tmp %>/styles/main.css': '<%= src %>/styles/styles.scss'
    }]
  },

  dist: {
    files: [{
      '<%= build %>/styles/main.css': '<%= src %>/styles/styles.scss'
    }]
  }

};
