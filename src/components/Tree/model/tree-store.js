import Node from './node'
import { hasOwn, isDef, isPlainObject, isUndef } from './util'

export default class TreeStore {
  constructor(options) {
    this.currentNode = null
    this.currentNodeKey = null

    for (let option in options) {
      if (hasOwn(options, option)) {
        this[option] = options[option]
      }
    }

    this.nodesMap = {}

    this.root = new Node({
      data: this.data,
      store: this
    })

    if (this.lazy && this.load) {
      this.load(this.root, (data) => {
        this.root.loaded = true
        this.root.doCreateChildren(data)
        this.root.updateLeafState()
        this._initDefaultCheckedNodes()
      })
    } else {
      this._initDefaultCheckedNodes()
    }
  }

  registerNode(node) {
    const key = this.key
    if (!key || !node || !node.data) return

    const nodeKey = node.key
    if (isDef(nodeKey)) this.nodesMap[node.key] = node
  }

  deregisterNode(node) {
    const key = this.key
    if (!key || !node || !node.data) return

    node.childNodes.forEach((child) => {
      this.deregisterNode(child)
    })

    delete this.nodesMap[node.key]
  }

  setData(newVal) {
    const instanceChanged = newVal !== this.root.data
    if (instanceChanged) {
      this.root.data = newVal
      this.root.updateChildren()
      this._initDefaultCheckedNodes()
    } else {
      this.root.updateChildren()
    }
  }

  getNode(data) {
    if (data instanceof Node) return data
    if (!this.key) return null
    const key = isPlainObject(data) ? data[this.key] : data
    return this.nodesMap[key] || null
  }

  append(data, parentData) {
    const parentNode = parentData ? this.getNode(parentData) : this.root

    if (parentNode) {
      parentNode.insertChild({ data })
    }
  }

  remove(data) {
    const node = this.getNode(data)

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null
      }
      node.parent.removeChild(node)
    }
  }

  insertBefore(data, refData) {
    const refNode = this.getNode(refData)
    refNode.parent.insertBefore({ data }, refNode)
  }

  insertAfter(data, refData) {
    const refNode = this.getNode(refData)
    refNode.parent.insertAfter({ data }, refNode)
  }

  filter(value) {
    const filterNodeMethod = this.filterNodeMethod
    const lazy = this.lazy
    function traverse(node) {
      const childNodes = node.childNodes
      if (node.level > 0) {
        node.visible = filterNodeMethod.call(node, value, node.data, node)
      }
      /**非叶子节点 */
      if (Array.isArray(childNodes) && childNodes.length > 0) {
        childNodes.forEach(traverse)

        if (!node.visible && childNodes.some((child) => child.visible)) {
          node.visible = true
        }

        if (!value) return

        if (node.visible && !lazy) node.expand()
      }
    }
    traverse(this.root)
  }

  setDefaultExpandedKeys(keys) {
    keys = keys || []
    this.defaultExpandedKeys = keys

    if (!this.key) return

    keys.forEach((key) => {
      const node = this.getNode(key)
      if (node) {
        node.expand(null, this.autoExpandParent)
      }
    })
  }

  setDefaultCheckedKey(keys) {
    keys = keys || []
    this.defaultCheckedKeys = keys
    this._initDefaultCheckedNodes()
  }

  setChecked(data, checked) {
    const node = this.getNode(data)

    if (node) {
      node.setChecked(!!checked)
    }
  }

  setCheckedKeys(keys, leafOnly = false) {
    if (leafOnly) {
      keys = keys.filter((key) => {
        return this.nodesMap[key] && this.nodesMap[key].isLeaf
      })
    }
    const checkedKeys = new Set(keys)
    this._setCheckedKeys(checkedKeys)
  }

  setCheckedNodes(array, leafOnly = false) {
    const key = this.key
    const keys = array.map((item) => item[key])

    this.setCheckedKeys(keys, leafOnly)
  }

  _setCheckedKeys(checkedKeys) {
    const key = this.key
    function walk(node, isParentChecked = false) {
      if (isParentChecked && !node.disabled) {
        node.checked = true
      } else if (checkedKeys.has(node.data[key])) {
        node.checked = true
      } else {
        node.checked = false
      }

      if (Array.isArray(node.childNodes) && node.childNodes.length > 0) {
        node.childNodes.forEach((child) => walk(child, node.checked))
      }

      if (!Array.isArray(node.childNodes) || node.childNodes.length === 0) {
        node.indeterminate = false
      } else {
        let all = true,
          none = true
        node.childNodes.forEach((child) => {
          if (child.checked) {
            none = false
          } else if (child.indeterminate) {
            all = false
            none = false
          } else if (!child.checked) {
            all = false
          }
        })
        node.checked = all
        node.indeterminate = !all && !none
      }
    }
    // walk(this.root)
    this.root.childNodes.forEach((child) => walk(child, false))
  }

  _initDefaultCheckedNodes() {
    if (!this.key) return
    const defaultCheckedKeys = this.defaultCheckedKeys || []
    const nodeMaps = this.nodesMap

    defaultCheckedKeys.forEach((key) => {
      const node = nodeMaps[key]
      if (node) {
        node.setChecked(true)
      }
    })
  }

  _initDefaultCheckedNode(node) {
    if (!this.key) return
    const defaultCheckedKeys = this.defaultCheckedKeys || []
    if (defaultCheckedKeys.indexOf(node.key) > -1) {
      node.setChecked(true)
    }
  }

  getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    const checkedNodes = []

    function traverse(node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes
      childNodes.forEach((child) => {
        if (
          (child.checked || (includeHalfChecked && child.indeterminate)) &&
          (!leafOnly || (leafOnly && child.isLeaf))
        ) {
          checkedNodes.push(child.data)
        }

        traverse(child)
      })
    }
    traverse(this)

    return checkedNodes
  }

  getCheckedKeys(leafOnly = false) {
    return this.getCheckedNodes(leafOnly).map((data) => (data || {})[this.key])
  }

  getHalfCheckedNodes() {
    const nodes = []
    const traverse = function (node) {
      const childNodes = node.root ? node.root.childNodes : node.childNodes

      childNodes.forEach((child) => {
        if (child.indeterminate) {
          nodes.push(child.data)
        }

        traverse(child)
      })
    }

    traverse(this)

    return nodes
  }

  getHalfCheckedKeys() {
    return this.getHalfCheckedNodes().map((data) => (data || {})[this.key])
  }

  getCurrentNode() {
    return this.currentNode
  }

  setCurrentNode(currentNode) {
    const prevCurrentNode = this.currentNode
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false
    }
    this.currentNode = currentNode
    this.currentNode.isCurrent = true
  }

  setUserCurrentNode(node) {
    const key = node[this.key]
    const currNode = this.nodesMap[key]
    this.setCurrentNode(currNode)
  }

  setCurrentNodeKey(key) {
    if (isUndef(key)) {
      this.currentNode && (this.currentNode.isCurrent = false)
      this.currentNode = null
      return
    }
    const node = this.getNode(key)
    if (node) {
      this.setCurrentNode(node)
    }
  }

  updateChildren(key, data) {
    const node = this.nodesMap[key]
    if (!node) return
    const childNodes = node.childNodes
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i]
      this.remove(child.data)
    }
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i]
      this.append(child, node.data)
    }
  }
}
