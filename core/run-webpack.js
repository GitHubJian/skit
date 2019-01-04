const compiler = require('./compiler')
const { webpackConfig } = require('./webpack.config.js')

const build = async () => {
  await compiler(webpackConfig)
}

build()
