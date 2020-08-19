const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: "./dist/",
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }]
  },
  devtool: 'eval',
  devServer: {
    publicPath: "/",
    contentBase: "./dist",
    hot: true,
    watchContentBase: true
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 9000
    // })
  ]
}