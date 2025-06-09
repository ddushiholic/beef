const args = require('yargs').argv;
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const production = !!args.production;
const command = args._[0];

/* Configuration */
const { MJS, CJS, PATH } = require('./config.json');

/* Check */
const entries = [path.resolve(__dirname, `../${PATH.src}`) + MJS.entry];
command == 'check' ? entries.push(path.resolve(__dirname, `../${PATH.src}`) + CJS.entry) : '';

const webpackConfig = {
  mode: production ? 'production' : 'development',

  entry: {
    'main.fed': entries,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      // Transpile ES6 to ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /jquery.+\.js$/,
        loader: 'expose-loader',
        options: {
          exposes: ['$', 'jQuery'],
        },
      },
      // {
      //   test: /jquery.+\.js$/,
      //   use: [
      //     {
      //       loader: 'expose-loader',
      //       options: 'jQuery',
      //     },
      //     {
      //       loader: 'expose-loader',
      //       options: '$',
      //     },
      //   ],
      // },
      // // Bundle and CSS extract
      // {
      //   test: /\.css$/i,
      //   use: ['style-loader', 'css-loader'],
      // },
      // // Bootstrap 4
      // {
      //   test: /bootstrap\/dist\/js\/umd\//,
      //   use: 'imports-loader?jQuery=jquery',
      // },
    ],
  },

  devtool: !production && 'source-map',

  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors.fed',
          // name(module) {
          //   const packageName = module.context.match(
          //     /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
          //   )[1];
          //   return `lib/${packageName}`;
          // },
        },
      },
    },
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: `빌드 날짜: ${new Date().toLocaleString()}`,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/jquery-ui-dist/jquery-ui.min.js',
          to: '../lib',
        },
        {
          from: './node_modules/jquery-ui-dist/jquery-ui.min.css',
          to: '../lib',
        },
      ],
    }),
  ],

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  target: ['web', 'es5']
};

module.exports = webpackConfig;
