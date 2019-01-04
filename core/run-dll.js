const compiler = require('./compiler')
const { webpackConfig } = require('./webpack.dll.config.js')

const build = async () => {
  await compiler(webpackConfig)
}

build()
