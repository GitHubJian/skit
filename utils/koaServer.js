const Koa = require('koa')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const koaFavicon = require('koa-favicon')

const koaDevMiddleware = require('./koaDevMiddleware.js')

module.exports = config => {
  const app = new Koa()
  app.use(koaLogger())

  app.use(koaBody({ patchKoa: true }))

  koaDevMiddleware(app)

  let { port, host } = config
  app.listen(port, () => {
    console.log(`✨ 服务已启动 http://${host}:${port}\n`)
  })
}
