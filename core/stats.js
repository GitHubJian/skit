const chalk = require('chalk')
const cliui = require('cliui')

const sum = (arr, init = 0) => arr.reduce((prev, cur) => prev + cur, init)
const uniq = arr => Array.from(new Set(arr))
const filesize = size => {
  if (size < 2 ** 10) {
    return `${size} B`
  } else {
    return `${(size / 2 ** 10).toFixed(2)} KB`
  }
}

const print = stats => {
  const {
    startTime,
    endTime,
    compilation: { assets }
  } = stats

  const ui = cliui({ width: 50 })

  ui.div({
    text: `${chalk.green('统计:')} 耗时${chalk.cyan(endTime - startTime)}ms`,
    padding: [1, 0, 1, 0]
  })

  const printTable = arr => ui.div(...arr.map(v => ({ text: v })))

  const thead = ['类型', '数量', '文件大小'].map(v => chalk.cyan(v))
  printTable(thead)

  const tbody = Object.keys(assets).reduce((prev, cur) => {
    prev.push({
      name: cur,
      type: cur.split('.').slice(-1)[0],
      size: assets[cur].size()
    })
    return prev
  }, [])
  uniq(tbody.map(v => v.type))
    .map(type => {
      const files = tbody.filter(v2 => v2.type === type)
      const { length: len } = files
      const size = sum(files.map(v => v.size))
      return { type, len, size }
    })
    .sort((a, b) => a.len - b.len)
    .forEach(({ type, len, size }) => {
      printTable([type, len, filesize(size)])
    })

  const tfoot = [
    '总计',
    tbody.length,
    filesize(sum(tbody.map(v => v.size)))
  ].map(v => chalk.green(v))

  printTable(tfoot)

  console.log(ui.toString())
}

module.exports = { print }
