const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = env => {

  let devtool = 'eval';
  let mode = 'development';

  if (env.NODE_ENV === 'prod') {
    devtool = 'hidden-source-map';
    mode = 'production';
  }

  return {
    entry: './src/app.js',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: "./dist/",
      filename: 'bundle.js'
    },
    mode,
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }]
    },
    devtool,
    devServer: {
      publicPath: "/",
      contentBase: "./dist",
      hot: true,
      watchContentBase: true
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerPort: 9000
      })
    ]
  }

}