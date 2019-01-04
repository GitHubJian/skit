#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const path = require('path')
const commander = require('commander')
const pkg = require(path.resolve(__dirname, '../package.json'))

commander
  .version(pkg.version)
  .description(pkg.description)
  .usage('[Options]')
  .option('build', 'webpack 打包')
  .option('dll', 'webpack dll 打包')
  .on('--help', () => {
    console.log('正在努力开发')
  })
  .parse(process.argv)

if (commander.build) {
  try {
    const compiler = require('./compiler')
    const { webpackConfig } = require('./webpack.config.js')

    const build = async () => {
      await compiler(webpackConfig)
    }

    build()
  } catch (e) {
    console.error(e)
  }
}

if (commander.dll) {
  try {
    const compiler = require('./compiler')
    const { webpackConfig } = require('./webpack.dll.config.js')

    const build = async () => {
      await compiler(webpackConfig)
    }

    build()
  } catch (e) {
    console.error(e)
  }
}
