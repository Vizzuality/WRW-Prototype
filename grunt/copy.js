module.exports = {

  data: {
    expand: true,
    cwd: '<%= src %>/scripts',
    src: '{,*/}{,*/}{,*/}*.{csv,json}',
    dest: '<%= build %>/scripts'
  },

  favicon: {
    src: '<%= src %>/favicon.ico',
    dest: '<%= build %>/favicon.ico'
  }

};
