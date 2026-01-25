const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/template.html' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '' },
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', {loader: 'css-loader', options: { url: false, },}],
      },
      {
        test: /\.(png|jpeg|jpg|svg|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|ttf)$/i,
        type: 'asset/resource',
      }
    ]
  }
}