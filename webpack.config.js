/**
 * Copyright (c) 2017 hustcc
 * License: MIT
 * GitHub: https://github.com/hustcc/immutability-util
 **/

var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    loaders: [{
      test: /.js$/,
      loader: 'babel-loader'
    }]
  }
};