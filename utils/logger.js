const chalk = require('chalk')

const {
  utils: { type2Color = {} }
} = require('./../config.js')

const defaultType2Color = {
  proxy: 'yellow',
  log: 'black',
  info: 'green',
  error: 'red'
}

Object.assign(defaultType2Color, type2Color)

const maxLen = Math.max(...Object.keys(defaultType2Color).map(v => v.length))

module.exports = Object.entries(defaultType2Color).reduce(
  (prev, [type, color]) => {
    prev[type] = str =>
      console.log(
        chalk[color](type),
        `${' '.repeat(maxLen - type.length)}${str}`
      )
    return prev
  },
  {}
)
