const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: process.env.NODE_ENV === 'production' ? '/todo-garden/' : '/',
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
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (url) => {
                  if (url.startsWith('/images/')) {
                    return false;
                  }
                  return true;
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpeg|jpg|svg|ico)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/i,
        type: "asset/resource",
      },
    ]
  }
}