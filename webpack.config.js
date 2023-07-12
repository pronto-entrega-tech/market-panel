const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web', // Our app can run without electron
  entry: './src/index.tsx', // The entry point of our app; these entry points can be named and we can also have multiple if we'd like to split the webpack bundle into smaller files to improve script loading speed between multiple pages of our app
  output: {
    path: path.resolve(__dirname, 'build'), // Where all the output files get dropped after webpack is done with them
    filename: 'bundle.js', // The name of the webpack bundle that's generated
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  module: {
    rules: [
      {
        // loads .html files
        test: /\.html$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              {
                tag: 'img',
                attribute: 'data-src',
                type: 'src',
              },
            ],
          },
        },
      },
      // loads .js/jsx and .ts/tsx files
      {
        test: /\.(j|t)sx?$/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'babel-loader',
        options: {
          plugins: [isDevelopment && 'react-refresh/babel'].filter(Boolean),
        },
        resolve: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
      // loads .css files
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/'),
        ],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        resolve: {
          extensions: ['.css'],
        },
      },
      // loads svg as react component
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      // loads images and fonts
      {
        test: /\.(png|jpg|woff2)$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    // fix "process is not defined" error;
    // https://stackoverflow.com/a/64553486/1837080
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
    new CleanWebpackPlugin(),
  ],
};
