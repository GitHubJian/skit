const webpack = require('webpack')
const { print } = require('./stats')

const cb = () => {}

module.exports = (config, callback = cb) => {
  return new Promise((res, rej) => {
    const compiler = webpack(config)

    compiler.run((err, stats) => {
      if (err) {
        console.log('打包出错')
        console.log(err)
        rej(err)
      } else {
        print(stats)
        res()
      }
    })

    compiler.plugin('done', callback)
  })
}
