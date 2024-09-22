const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.config");
const path = require("path");

module.exports = merge(base, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    host: "localhost",
    port: "40992",
    hot: true,
    compress: true,
    static: path.resolve(__dirname, "build"),
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/splashscreen.html"),
      filename: "splashscreen.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
    }),
    new CspHtmlWebpackPlugin(
      {
        "object-src": ["'none'"],
        "worker-src": ["'none'"],
        "script-src": ["'self'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "frame-src": ["'none'"],
        "base-uri": ["'self'"],
      },
      {
        nonceEnabled: {
          "style-src": false,
        },
        hashEnabled: {
          "style-src": false,
        },
      },
    ),
  ],
});
