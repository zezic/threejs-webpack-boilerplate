const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

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
  ],
  // resolve: {
  //   plugins: [
  //     threeMinifier.resolver, // <=== (2) Add resolver on the FIRST line
  //     // three$: path.resolve(__dirname, 'node_modules/three/src/Three.js')
  //   ]
  // },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\\/]node_modules[\\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}