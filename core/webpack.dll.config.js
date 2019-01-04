/* ---------------------------------------- */

const { path: pathConfig } = require('./../config.js')
const {
  dll: { entry }
} = require(pathConfig.configPath)

/* ---------------------------------------- */

const { NODE_ENV } = process.env || 'development'
const [isDevelopment, isProduction] = [
  NODE_ENV === 'development',
  NODE_ENV === 'production'
]
const path = require('path')
const webpack = require('webpack')
const extractCSS = require('./extract.js')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')

const LIBRARY_NAME = '__[name]_[chunkhash]__'

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry,
  output: {
    filename: `js/[name].js`,
    path: pathConfig.dll,
    publicPath: '/',
    library: LIBRARY_NAME
  },
  resolve: {
    extensions: ['.js'],
    modules: [pathConfig.nodeModules]
  },
  resolveLoader: {
    modules: [pathConfig.nodeModules]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: ['css-loader']
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'image/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/min$/),
    new CleanWebpackPlugin([pathConfig.dll], {
      root: pathConfig.root,
      verbose: false
    }),
    extractCSS,
    new webpack.DllPlugin({
      path: path.resolve(pathConfig.dll, '[name].json'),
      name: LIBRARY_NAME
    }),
    new AssetsWebpackPlugin({
      path: pathConfig.dll,
      filename: 'index.json',
      prettyPrint: true
    })
  ],
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
}

module.exports = { entry, webpackConfig }
