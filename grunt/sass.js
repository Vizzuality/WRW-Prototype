module.exports = {

  options: {
    sourceMap: false,
    includePaths: ['.']
  },

  compile: {
    options: {
      style: 'expanded'
    },
    files: [{
      '<%= tmp %>/styles/main.css': '<%= src %>/styles/styles.scss'
    }]
  }

};
