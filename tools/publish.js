const child_process = require('child_process')

let a = child_process.execSync('git add .')
let b = child_process.execSync('git ci -m "add111"')
console.log(a)
