const extractCSS = require('./extract.js')

const { NODE_ENV } = process.env
const [isDevelopment, isProduction] = [
  NODE_ENV === 'development',
  NODE_ENV === 'production'
]

const rules = [
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
  }
]

const rules4Prod = [
  {
    test: /\.vue$/,
    use: [
      {
        loader: 'vue-loader',
        options: {
          loaders: {
            css: extractCSS.extract({
              fallback: 'vue-style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true
                  }
                }
              ]
            }),
            sass: extractCSS.extract({
              fallback: 'vue-style-loader',
              use: [
                'sass-loader',
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true
                  }
                }
              ]
            }),
            scss: extractCSS.extract({
              fallback: 'vue-style-loader',
              use: [
                'sass-loader',
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true
                  }
                }
              ]
            }),
            js: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        }
      }
    ]
  },
  {
    test: /\.css$/,
    use: extractCSS.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }
      ]
    })
  },
  {
    test: /\.scss$/,
    use: extractCSS.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        },
        'sass-loader'
      ]
    })
  },
  {
    test: /\.sass$/,
    use: extractCSS.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: true // css压缩
          }
        },
        'sass-loader'
      ]
    })
  }
].concat(rules)

const rules4Dev = [
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
                presets: ['@babel/preset-env']
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
].concat(rules)

module.exports = {
  rules: isDevelopment ? rules4Dev : rules4Prod
}
