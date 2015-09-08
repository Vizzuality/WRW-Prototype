module.exports = {

  sass: {
    // We watch and compile sass files as normal but don't live reload here
    files: ['<%= src %>/styles/*.scss'],
    tasks: ['sass', 'postcss:dist']
  },

  slim: {
    files: ['<%= src %>/**/*.slim'],
    tasks: ['slim']
  }

};
