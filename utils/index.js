const glob = require('glob')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const createAlias = src => {
  return glob
    .sync(path.resolve(src, './*'))
    .filter(v => {
      return fs.statSync(v).isDirectory()
    })
    .reduce((prev, cur) => {
      prev[path.basename(cur)] = cur

      return prev
    }, {})
}

const createEntry = (pages, prepack) => {
  let entry = {}

  glob
    .sync(path.resolve(pages, './**/index.vue'))
    .map(v => v.split('/').slice(-2, -1)[0])
    .forEach(key => {
      entry[key] = path.resolve(prepack, `${key}.js`)
    })

  return entry
}

const createPrepack = (pages, prepack, pattern = './**/index.vue') => {
  const createContent = p => {
    return [
      `import Vue from 'vue';`,
      `import entry from '${p}/index.vue';`,
      '',
      `export default new Vue({`,
      `    el: '#app',`,
      `    render: h => h(entry)`,
      `})`
    ].join('\n')
  }

  glob.sync(path.resolve(pages, pattern)).forEach(entry => {
    let p = entry
      .split('/')
      .slice(0, -1)
      .join('/')

    let key = entry.split('/').slice(-2, -1)[0]
    let filePath = path.resolve(prepack, `${key}.js`)
    fse.outputFileSync(filePath, createContent(p), {
      encoding: 'utf-8'
    })
  })
}

module.exports = { createAlias, createEntry, createPrepack }
