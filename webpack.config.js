const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");

module.exports = {
  mode: 'development',
  entry: './main.ts',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts','.js']
  },
  module: {
    rules: [
      // all files with a `.ts` extension will be handled by `ts-loader`
      { test: /\.ts$/, loader: 'ts-loader' },

      // Ignore warnings about System.import in Angular
      { test: /[\/\\]@angular[\/\\].+\.js$/, parser: { system: true } },

      // Plugin to change templateUrl to template with require statement
      { test: /\.ts$/, loader: 'angular2-template-loader' },

      // Allow loading html with require statements for the above to work
      { test: /\.(html|css)$/, loader: 'raw-loader' }
    ]
  },
  plugins: [
    // To quench weird webpack warning, see https://github.com/angular/angular/issues/11580#issuecomment-327338189
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.resolve(__dirname, 'src'), // location of your src
      {} // a map of your routes 
    ),

    // Show OS notification on every rebuild
    new WebpackNotifierPlugin({alwaysNotify: true}),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    watchContentBase: true,
    port: 9000,
  },
  devtool: 'inline-source-map'
};


/*
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
  
  //  Hack to avoid build warnings about "the request of a dependency is an expression"
  // See https://github.com/angular/angular/issues/11580
  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve('./src'),
      {}
    )
  ],
}
*/