module.exports = {
  options: {
    sourceMap: true,
    sourceMapEmbed: true,
    sourceMapContents: true,
    includePaths: ['.']
  },
  compile: {
    options: {
      style: 'expanded'
    },
    files: [
      '.tmp/styles/main.css': '<% src %>/styles/main.scss'
    ]
  }
};
