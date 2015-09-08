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
      src: ['{,*/}*.slim'],
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
      src: ['{,*/}*.slim'],
      dest: '<%= build %>',
      ext: '.html'
    }]
  }

};
