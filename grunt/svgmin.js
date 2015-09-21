module.exports = {

  options: {
    plugins: [{
      removeViewBox: false
    }, {
      removeUselessStrokeAndFill: false
    }]
  },

  compile: {
    files: [{
      expand: true,
      cwd: '<%= src %>/img',
      src: ['**/*.svg'],
      dest: '<%= build %>/img'
    }]
  }

};
