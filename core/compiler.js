const webpack = require('webpack')
const { print } = require('./stats')

const cb = () => {}

module.exports = (config, callback = cb) => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config)

    compiler.run((err, stats) => {
      if (err) {
        console.log('打包出错')
        console.log(err)
        reject(err)
      } else {
        print(stats)
        resolve()
      }
    })

    compiler.plugin('done', callback)
  })
}
