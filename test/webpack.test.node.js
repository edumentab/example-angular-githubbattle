const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpackMerge = require('webpack-merge');
const commonTestConfig = require('./webpack.test.common.js');

module.exports = webpackMerge(commonTestConfig, {
    target: 'node',

    mode: 'development',

    devtool: 'inline-source-map',

    module: {
        rules: [{
          test: /\.ts$/,
          include: path.resolve(__dirname, '../src'),
          exclude: [/\.e2e\.ts$/],
          loaders: [{
              loader: 'ts-loader',
          }, 'angular2-template-loader']
      }]
    },

    externals: [
        nodeExternals()
    ]
});