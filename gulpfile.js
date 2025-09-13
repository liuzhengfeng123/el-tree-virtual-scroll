const { src, dest, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const fse = require('fs-extra')

function compileSass() {
  return src('./src/assets/styles/*.scss')
    .pipe(sass.sync({ style: 'compressed' }))
    .pipe(dest('./dist/styles'))
}

function copyFont(cb) {
  fse.copy('./src/assets/styles/fonts', './dist/styles/fonts')
  fse.copy('./src/types/index.d.ts', './dist/index.d.ts')
  fse.copy('./src/types/index.d.cts', './dist/index.d.cts')
  cb()
}

exports.default = series(compileSass, copyFont)
