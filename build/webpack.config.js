const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, '..'),
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
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
  },
  devtool: 'source-map',
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: (file) => {
          return /node_modules/.test(file)
        },
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ]
  }
}