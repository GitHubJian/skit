const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

const { path: pathConfig } = require('../config.js')
const { existsSync } = require('fs')

let htmlIncludeAssets = []

if (existsSync(`${pathConfig.dll}/index.json`)) {
  htmlIncludeAssets = Object.entries(require(`${pathConfig.dll}/index.json`))
    .map(([k, v]) => {
      return Object.values(v)
    })
    .reduce((prev, cur) => {
      prev.push(
        ...cur
          .map(v => v.slice(1))
          .filter(
            v =>
              typeof v === 'string' && ['.js', '.css'].some(k => v.endsWith(k))
          )
      )
      return prev
    }, [])
}

function createHtmlAssetsInstance(opts = {}) {
  return new HtmlWebpackIncludeAssetsPlugin(
    Object.assign(
      {
        append: false,
        resolvePaths: true,
        publicPath: './',
        assets: htmlIncludeAssets
      },
      opts
    )
  )
}

module.exports = createHtmlAssetsInstance
