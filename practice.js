const fs = require('fs')
const path = require('path')

let id = 0

function recursive(directory, include, upperFolder) {
  let arr = []
  const dirs = fs.readdirSync(directory)
  dirs.forEach((fileName) => {
    let obj = {
      label: fileName,
      id: id++
    }

    if (!(obj.id % 3)) obj.disabled = true

    const filePath = path.resolve(directory, fileName)
    const stats = fs.statSync(filePath)
    const isDirectory = stats.isDirectory()
    if (
      (isDirectory && upperFolder === 'node_modules' && include.includes(fileName)) ||
      (isDirectory && upperFolder !== 'node_modules')
      // isDirectory && fileName !== 'node_modules'
    ) {
      obj.isLeaf = false
      obj.children = recursive(filePath, include, fileName)
    } else {
      obj.isLeaf = true
    }
    arr.push(obj)
  })
  return arr
}

let res = recursive(path.resolve(__dirname), ['@babel', '@eslint'], path.resolve(__dirname, '..'))

fs.writeFileSync(path.resolve(__dirname, 'src', 'assets', 'fileStructor.json'), JSON.stringify(res))
