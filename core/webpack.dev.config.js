const { path: pathConfig } = require('./../config.js')
const {
  conf: { entry, alias }
} = require(pathConfig.configPath)

/* ---------------------------------------- */
// const { NODE_ENV } = process.env || 'development'
// const [isDevelopment, isProduction] = [
//   NODE_ENV === 'development',
//   NODE_ENV === 'production'
// ]
/* ---------------------------------------- */

const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const webpackConfig = {
  mode: 'development',
  devtool: '#cheap-module-source-map',
  entry,
  output: {
    filename: 'js/[name].js',
    path: pathConfig.dist,
    publicPath: '/'
  },
  resolve: {
    alias,
    extensions: ['.js', '.json', '.vue']
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'image/[name].[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                css: ['vue-style-loader', 'css-loader'],
                scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
                sass: ['vue-style-loader', 'css-loader', 'sass-loader'],
                js: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-syntax-dynamic-import']
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    }),
    new webpack.DllReferencePlugin({
      manifest: require(`${pathConfig.dll}/vendor.json`)
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({}),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.ModuleConcatenationPlugin()
    // new HtmlWebpackIncludeAssetsPlugin({
    //   append: false,
    //   assets: htmlAssets
    // })
  ],
  optimization: {},
  performance: {
    maxEntrypointSize: 300000,
    hints: false
  },
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false
  }
}

module.exports = { webpackConfig }
