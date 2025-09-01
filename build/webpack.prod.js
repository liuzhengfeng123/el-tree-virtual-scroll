const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'el-tree-virtual-scroll.js',
    clean: true,
    library: {
      name: 'elTreeVirtualScroll',
      type: 'umd'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
})