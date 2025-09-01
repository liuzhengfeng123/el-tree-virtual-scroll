const fs = require('fs')
const path = require('path')

let id = 0

function recursive(directory, include, upperFolder) {
  let arr = []
  const dirs = fs.readdirSync(directory)
  dirs.forEach((fileName) => {
    let obj = {
      label: fileName,
      id: id++
    }

    if (!(obj.id % 3)) obj.disabled = true

    const filePath = path.resolve(directory, fileName)
    const stats = fs.statSync(filePath)
    const isDirectory = stats.isDirectory()
    if (
      isDirectory
      // (isDirectory && upperFolder === 'node_modules' && include.includes(fileName)) ||
      // (isDirectory && upperFolder !== 'node_modules')
    ) {
      obj.isLeaf = false
      obj.children = recursive(filePath, include, fileName)
    } else {
      obj.isLeaf = true
    }
    arr.push(obj)
  })
  return arr
}

let res = recursive(
  path.resolve(__dirname),
  [
    '.bin',
    '@babel',
    '@eslint',
    '@types',
    '@vue',
    'b4a',
    'babel-plugin-polyfill-corejs2',
    'babel-plugin-polyfill-corejs3',
    'call-bind-apply-helpers',
    'dot-case',
    'lint-staged',
    'babel-runtime',
    'math-intrinsics',
    'resolve',
    'send',
    'postcss-selector-parser',
    'webpack-merge',
    'webpack-dev-server',
    'vue-loader',
    'vue-eslint-parser',
    'proxy-addr',
    'webpack-dev-middleware',
    'webpack-cli',
    'vue-router',
    'throttle-debounce',
    'thingies',
    'es-object-atoms',
    'es-module-lexer',
    'es-errors',
    'es-module-lexer',
    'domelementtype',
    'caniuse-lite',
    'call-bind-apply-helpers',
    'braces',
    'assign-symbols',
    'undertaker',
    'tslib',
    'supports-preserve-symlinks-flag',
    'css-loader',
    'core-util-is',
    'concat-map',
    'call-bound',
    'babel-plugin-polyfill-regenerator'
  ],
  path.resolve(__dirname, '..')
)

fs.writeFileSync(path.resolve(__dirname, 'src', 'assets', 'fileStructor.json'), JSON.stringify(res))
