const { path: pathConfig } = require('./../config.js')
const {
  conf: { entry, alias, html: htmlOptions, publicPath }
} = require(pathConfig.configPath)

/* ---------------------------------------- */
const { NODE_ENV } = process.env || 'development'
const [isProduction] = [NODE_ENV === 'production']
/* ---------------------------------------- */

const path = require('path')

const { rules } = require('./rules')
const { htmlIncludeAssets } = require('./htmlIncludeAssets.js')
const extractCSS = require('./extract.js')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const HtmlWebpackPluginList = Object.entries(entry).map(([k, v]) => {
  let { title, chunks, favicon } = htmlOptions
  let chunksArr = Array.isArray(chunks) ? chunks.concat([k]) : [k]
  
  return new HtmlWebpackPlugin({
    filename: path.resolve(pathConfig.dist, `${k}.html`),
    template: pathConfig.template,
    title: title || 'Skit Test',
    favicon: favicon || pathConfig.favicon,
    chunks: chunksArr,
    chunksSortMode: 'dependency',
    NODE_ENV
  })
})

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry,
  output: {
    filename: 'js/[name].js',
    path: pathConfig.dist,
    publicPath: publicPath || '/',
    chunkFilename: 'js/[name].js'
  },
  resolve: {
    alias,
    extensions: ['.js', '.json', '.vue']
  },
  module: {
    rules
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.buildTime': JSON.stringify(Date.now())
    }),
    new webpack.ProvidePlugin({}),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require(`${pathConfig.dll}/vendor.json`)
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(pathConfig.dll, 'js'),
        to: 'js'
      },
      {
        from: pathConfig.favicon,
        to: './'
      }
    ]),
    // new AssetsWebpackPlugin({
    //   path: pathConfig.dll,
    //   filename: 'index.json',
    //   fileTypes: ['js', 'css'],
    //   update: true,
    //   keepInMemory: true,
    //   prettyPrint: true
    // }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    })
  ],
  optimization: {
    splitChunks: {}
  },
  performance: {
    hints: false
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
}

webpackConfig.plugins.push(
  ...[
    extractCSS,
    new CleanWebpackPlugin([pathConfig.dist], {
      root: pathConfig.root,
      exclude: [],
      verbose: true,
      dry: false
    }),
    ...HtmlWebpackPluginList,
    new HtmlWebpackIncludeAssetsPlugin({
      append: false,
      resolvePaths: true,
      publicPath: './',
      assets: htmlIncludeAssets
    })
  ]
)

module.exports = { webpackConfig }
