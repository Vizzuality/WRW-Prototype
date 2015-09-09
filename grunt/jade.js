module.exports = {

  options: {},

  dev: {
    options: {
      data: {
        env: 'development'
      }
    },
    files: [{
      expand: true,
      cwd: '<%= src %>',
      src: ['{,*/}*.jade'],
      dest: '<%= tmp %>',
      ext: '.html'
    }]
  },

  dist: {
    options: {
      data: {
        env: 'development'
      }
    },
    files: [{
      expand: true,
      cwd: '<%= src %>',
      src: ['{,*/}*.jade'],
      dest: '<%= build %>',
      ext: '.html'
    }]
  }

};
