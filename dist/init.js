const root = process.cwd()
const path = require('path')
const fse = require('fs-extra')

function createConfig () {
  let content = fse.readFileSync(
    path.resolve(__dirname, './skit.config.js'),
    'utf-8'
  )
  fse.writeFileSync(path.resolve(root, './skit.config.js'), content, 'utf-8')
}

module.exports = { createConfig }
