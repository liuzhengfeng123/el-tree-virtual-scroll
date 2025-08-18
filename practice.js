const fs = require('fs')
const path = require('path')

let id = 0

function recursive(directory, exclude) {
  let arr = []
  const dirs = fs.readdirSync(directory)
  dirs.forEach(fileName => {
    let obj = {
      fileName,
      id: id++
    }

    if(!(obj.id % 3)) obj.disabled = true

    const filePath = path.resolve(directory, fileName)
    const stats = fs.statSync(filePath)
    const isDirectory = stats.isDirectory()
    if(isDirectory && !exclude.includes(fileName)) {
      obj.isLeaf = false
      obj.children = recursive(filePath, exclude)
    } else {
      obj.isLeaf = true
    }
    arr.push(obj)
  })
  return arr
}

let res = recursive(path.resolve(__dirname), ['node_modules'])

fs.writeFileSync(path.resolve(__dirname, 'src', 'assets', 'fileStructor.json'), JSON.stringify(res))