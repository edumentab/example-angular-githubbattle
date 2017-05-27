let webpack = require('webpack');
let path = require('path');

module.exports = {
  devtool: 'eval',
  entry: __dirname + '/main.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    sourceMapFilename: 'source.map'
  },
  resolve: {
    extensions: [".ts",".js"]
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: ['node_modules']
    }]
  },
  /*
    Hack to avoid build warnings about "the request of a dependency is an expression"
    See https://github.com/angular/angular/issues/11580
  */
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve('./src'),
      {}
    )
  ],
}
