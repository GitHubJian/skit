const root = process.cwd()
const path = require('path')
const utils = require('./webpack/utils')

let pathConfig = {
  root, // 根目录
  src: path.resolve(root, './src'),
  pages: path.resolve(root, './src/pages'),
  prepack: path.resolve(root, './.skit/.temp/prepack')
}

const entry = utils.createEntry(pathConfig.src, pathConfig.prepack)
const alias = utils.createAlias(pathConfig.src)

module.exports = {
  path: {},
  conf: {
    entry: entry,
    alias: alias,
    html: {
      title: 'Sogou Test',
      favicon: path.resolve(root, './favicon.ico'),
      chunks: ['vendor']
    }
  },
  dll: {
    entry: {
      vendor: ['vue']
    }
  },
  utils: {
    type2Color: {}
  }
}
