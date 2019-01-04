const { path: pathConfig } = require('./../config.js')
const {
  conf: { alias, html: htmlOptions, dev: devOptions }
} = require(pathConfig.configPath)

/* ---------------------------------------- */
const { NODE_ENV } = process.env || 'development'
const [isDevelopment, isProduction] = [
  NODE_ENV === 'development',
  NODE_ENV === 'production'
]
/* ---------------------------------------- */
const path = require('path')
const webpack = require('webpack')
const { webpackConfig } = require('./../core/webpack.dev.config.js')
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin')
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const { hotMiddleware } = require('koa-webpack-middleware')

const { htmlIncludeAssets } = require('./../core/htmlIncludeAssets.js')

const KoaSend = require('koa-send')
const fse = require('fs-extra')

const webpackConfigEntry = JSON.parse(JSON.stringify(webpackConfig.entry))

const createHMR = entry =>
  `webpack-hot-middleware/client?path=/__webpack_hmr&name=${entry}&noInfo=false&reload=true&heartbeat=2000`

let getSingleHtmlPlugin = k => {
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
}

module.exports = app => {
  let { preentry = [] } = devOptions
  let globalEntry = preentry.length
    ? preentry.reduce((prev, cur) => {
        prev[cur] = [createHMR(cur), webpackConfigEntry[cur]]

        return prev
      }, {})
    : {
        global: [createHMR('global')]
      }

  webpackConfig.entry = globalEntry

  const htmlCache = {}
  const compiler = webpack(webpackConfig)
  const devMiddlewareInstance = webpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: webpackConfig.stats
  })

  app.use(async (ctx, next) => {
    let reqPath = ctx.path
    if (reqPath === '/' || reqPath.endsWith('.html')) {
      const entry =
        reqPath === '/' ? 'index' : reqPath.replace('.html', '').substring(1)

      const entryValue = [createHMR(entry), webpackConfigEntry[entry]]

      if (entryValue) {
        if (htmlCache[entry]) {
          await next()
        } else {
          compiler.apply(
            new MultiEntryPlugin(pathConfig.root, entryValue, entry)
          )
          compiler.apply(getSingleHtmlPlugin(entry))
          compiler.apply(
            new HtmlWebpackIncludeAssetsPlugin({
              append: false,
              assets: htmlIncludeAssets
            })
          )
          devMiddlewareInstance.invalidate()
          htmlCache[entry] = true
          await next()
        }
      } else {
        ctx.status = 404
        ctx.body = {
          code: 404
        }
      }
    } else {
      await next()
    }
  })

  app.use(async (ctx, next) => {
    ctx.status = 200
    await devMiddlewareInstance(ctx.req, ctx.res, async () => {
      await next()
    })
  })

  app.use(async (ctx, next) => {
    let reqPath = ctx.path
    if (reqPath === '/__webpack_hmr') {
      await next()
    } else {
      let maxage = 365 * 24 * 60 * 60 * 1000
      const exists = await fse.pathExists(`${devOptions.staticPath}${reqPath}`)
      let result

      if (exists) {
        result = await KoaSend(ctx, reqPath, {
          root: devOptions.staticPath,
          maxage
        })
      }

      if (!result) {
        ctx.body = { code: 404 }
      }
    }
  })

  app.use(hotMiddleware(compiler))
}
