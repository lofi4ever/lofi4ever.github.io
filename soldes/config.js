module.exports = {
  paths: {
    styles: {
      input: './css/src/**/*.scss',
      output: './css',
      libs: './css/libs/**/*.css'
    },
    scripts: {
      src: './js/src/**/*.js',
      input: './js/src/index.js',
      output: './js',
      filename: 'scripts.js',
      get outputFile() {
        return `${this.output}/${this.filename}`
      }
    }
  },
  isLocal: true
}