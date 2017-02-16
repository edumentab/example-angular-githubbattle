module.exports = {
  entry: './main.ts',
  output: {
    path: './dist',
    filename: 'bundle.js',
    sourceMapFilename: 'source.map'
  },
  resolve: {
    extensions: [".ts",".js",""]
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      exclude: ['node_modules']
    }]
  }
}