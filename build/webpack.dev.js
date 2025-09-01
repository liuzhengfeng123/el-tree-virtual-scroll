const path = require('path')
const { merge } = require('webpack-merge')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../examples'),
    filename: 'index.js',
    clean: true
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    static: '../examples',
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      inject: 'body'
    }),
    new VueLoaderPlugin()
  ]
}
)