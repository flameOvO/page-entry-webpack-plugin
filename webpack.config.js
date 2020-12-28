const path = require('path');
const MultiEntryWebpackPlugin = require('./index.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: { 
    'test1': './example/test1.js',
    'test2': './example/test2.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {

  },
  plugins: [
    new MultiEntryWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'test1.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'test2.html',
    }),
  ]
};