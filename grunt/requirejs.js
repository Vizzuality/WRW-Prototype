module.exports = {

  compile: {
    options: {
      mainConfigFile: '<%= src %>/scripts/config.js',
      baseUrl: '<%= src %>/scripts',
      name: '../../bower_components/almond/almond',
      include: ['main'],
      out: '<%= build %>/scripts/main.js'
    }
  }

};
