const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.config');
const path = require('path');

module.exports = merge(base, {
  mode: 'production',
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/splashscreen.html'),
      filename: 'splashscreen.html',
      base: 'app://rse',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      base: 'app://rse',
    }),
    // You can paste your CSP in this website https://csp-evaluator.withgoogle.com/
    // for it to give you suggestions on how strong your CSP is
    new CspHtmlWebpackPlugin(
      {
        'object-src': ["'none'"],
        'worker-src': ["'none'"],
        'script-src': ["'self'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'frame-src': ["'none'"],
        'base-uri': ["'self'"],
      },
      {
        nonceEnabled: {
          'style-src': false,
        },
        hashEnabled: {
          'style-src': false,
        },
      },
    ),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      '...', // This adds default minimizers to webpack. For JS, Terser is used. // https://webpack.js.org/configuration/optimization/#optimizationminimizer
      new CssMinimizerPlugin(),
    ],
  },
  performance: {
    maxAssetSize: 1_000_000,
    maxEntrypointSize: 1_000_000,
  },
});
