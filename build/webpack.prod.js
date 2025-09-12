const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const common2 = {
  mode: 'production',
  entry: './index.js',
  plugins: [new VueLoaderPlugin()]
}

module.exports = [
  merge(common, {
    ...common2,
    experiments: {
      outputModule: true // 关键：启用 ESM 输出
    },
    output: {
      filename: 'el-tree-virtual-scroll.esm.js',
      path: path.resolve(__dirname, '../dist'),
      library: {
        type: 'module' // 输出 ES Module
      }
    },
  }),
  merge(common, {
    ...common2,
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'el-tree-virtual-scroll.umd.js',
      library: {
        name: 'elTreeVirtualScroll',
        type: 'umd'
      },
      globalObject: 'typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this'
    }
  })
]
