const root = process.cwd()
const path = require('path')

const settings = require(path.resolve(root, './skit.config.js'))

let pathConfig = {
  root, // 根目录
  skit: path.resolve(root, './.skit'), // 根目录
  temp: path.resolve(root, './.skit/.temp'),
  dll: path.resolve(root, './.skit/.temp/dll'), // dll文件夹
  dist: path.resolve(root, './.skit/dist'), //
  nodeModules: path.resolve(root, './node_modules'), //
  favicon: path.resolve(root, './favicon.ico'), //
  configPath: path.resolve(root, './skit.config.js'),
  template: path.resolve(__dirname, './core/template.ejs')
}

Object.assign(pathConfig, settings.path || {})

module.exports = {
  ...settings,
  path: pathConfig
}
