module.exports = {

  compile: {
    files: [{
      expand: true,
      cwd: '<%= src %>/img',
      src: ['**/*.{png,jpg,gif}'],
      dest: '<%= build %>/img'
    }]
  }

};
