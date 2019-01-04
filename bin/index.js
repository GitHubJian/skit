#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const path = require('path')
const commander = require('commander')
const pkg = require(path.resolve(__dirname, '../package.json'))

commander
  .version(pkg.version)
  .description(pkg.description)
  .usage('[Options]')
  .option('init', '初始化')
  .option('build', 'webpack 打包')
  .option('dll', 'webpack dll 打包')
  .on('--help', () => {
    console.log('正在努力开发')
  })
  .parse(process.argv)

if (commander.init) {
  try {
    const { createConfig } = require('./../dist/init.js')
    createConfig()
  } catch (e) {
    console.error(e)
  }
}

if (commander.build) {
  try {
    const compiler = require('./../core/compiler.js')
    const { webpackConfig } = require('./../core/webpack.config.js')

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
    const compiler = require('./../core/compiler')
    const { webpackConfig } = require('./../core/webpack.dll.config.js')

    const build = async () => {
      await compiler(webpackConfig)
    }

    build()
  } catch (e) {
    console.error(e)
  }
}
