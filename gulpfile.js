const { src, dest, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const fse = require('fs-extra')

function compileSass() {
  return src('./src/assets/styles/*.scss')
    .pipe(sass.sync({ style: 'compressed' }))
    .pipe(dest('./dist/lib'))
}

function copyFont(cb) {
  fse.copy('./src/assets/styles/fonts', './dist/lib/fonts')
  cb()
}

exports.default = series(compileSass, copyFont)
