import {
  hasOwn, isPlainObject,
  isDef, markNodeData,
  isUndef, NODE_KEY
} from './util'

let nodeIdSeed = 0;

function getPropertyFromData(node, prop) {
  const props = node.store.props || {}
  const data = node.data || {}
  const config = props[prop]

  if(typeof config === 'function') {
    return config(data, node)
  } else if(typeof config === 'string') {
    return data[config]
  } else {
    return data[prop]
  }
}

function reInitChecked(node) {
  if(node.loading) return
  if(node.childNodes.length === 0) {
    return node.indeterminate && (node.indeterminate = false)
  }
  const { all, none, half } = getChildState(node.childNodes)
  if(all) {
    node.checked = true
    node.indeterminate = false
  } else if (half) {
    node.checked = false
    node.indeterminate = true
  } else if(none) {
    node.checked = false
    node.indeterminate = false
  }

  if(node.parent) {
    reInitChecked(node.parent)
  }

}

function getChildState(childNodes) {
  let all = true
  let none = true
  let n
  let allWithoutDisable = true
  for(let i = 0, l = childNodes.length; i < l; i++) {
    n = childNodes[i]
    if(n.checked) {
      none = false
    } else if(n.indeterminate) {
      none = false
      all = false
      if(!n.disabled) allWithoutDisable = false
    } else if(!n.checked){
      all = false
      if(!n.disabled) allWithoutDisable = false
    }
  }
  return { all, none, allWithoutDisable, half: !all && !none }
}

export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++
    this.level = 0
    this.parent = null
    this.childNodes = []
    this.data = null
    this.store = null
    this.expanded = false
    this.isLeaf = false
    this.checked = false
    this.indeterminate = false
    this.visible = true
    this.loaded = false
    this.loading = false;
    this.isCurrent = false;

    for (let option in options) {
      if (hasOwn(options, option)) {
        this[option] = options[option];
      }
    }

    const store = this.store

    store.registerNode(this)

    if(!store.lazy) {
      this.setData(this.data)
    }

    const key = store.key
    const defaultExpandedKeys = store.defaultExpandedKeys
    const defaultExpandAll = store.defaultExpandAll

    if(defaultExpandAll && !store.lazy) {
      this.expanded = true
    } else if(defaultExpandAll && store.lazy && this.level > 0) {
      this.expand()
    }

    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }

    if(!defaultExpandAll && key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) > -1) {
      this.expand(null, store.autoExpandParent)
    }

    if (key && isDef(store.currentNodeKey) && this.key === store.currentNodeKey) {
      store.setCurrentNode(this)
    }

    if(store.lazy) {
      store._initDefaultCheckedNode(this)
      this.updateLeafState()
    }
  }

  setData(data) {
    this.data = data;
    this.childNodes = [];

    let children
    /**根节点 */
    if(this.level === 0) {
      if(Array.isArray(this.data)) {
        children = this.data
      } else {
        console.error('[El-Tree-Vritual-Scroll Warn] props.data must be of type array')
      }
    } else {
      children = getPropertyFromData(this, 'children')
    }

    children = Array.isArray(children) ? children : []

    for(let i = 0; i < children.length; i++) {
      const child = children[i]
      if(!isPlainObject(child)) {
        console.error('[El-Tree-Vritual-Scroll Warn] The members of props.data array must be of object type.')
        continue
      }
      this.insertChild({
        data: child
      })
    }
    this.updateLeafState()
  }

  insertChild(child, index, batch) {
    if(!batch) {
      const children = this.getChildren(true) || [];
      if(children.indexOf(child.data) === -1) {
        if (typeof index === 'undefined' || index < 0) {
          children.push(child.data);
        } else {
          children.splice(index, 0, child.data);
        }
      }
    }

    Object.assign(child, {
      store: this.store,
      parent: this,
      level: this.level + 1
    })

    child = new Node(child)

    if (typeof index === 'undefined' || index < 0) {
      this.childNodes.push(child);
    } else {
      this.childNodes.splice(index, 0, child);
    }

    this.updateLeafState()
  }

  insertBefore(child, ref) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }

  insertAfter(child, ref) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  }

  getChildren(forceInit = false) {
    if(this.level === 0) return this.data
    const data = this.data
    if(!data) return null

    const props = this.store.props
    let children = props.children || 'children'

    if(isUndef(data[children]) && forceInit) {
      data[children] = []
    }

    return data[children]
  }

  updateChildren() {
    const newChildren = this.getChildren() || []
    const childNodes = this.childNodes
    const oldData = childNodes.map(node => node.data)

    let i = 0, newNodeKey, oldNodeKey, oldIndex, newDataMap = {}
    while(i < newChildren.length) {
      /**新 NODE_KEY */
      newNodeKey = newChildren[i][NODE_KEY]
      /**旧 NODE_KEY */
      if(i < childNodes.length) {
        oldNodeKey = childNodes[i].data[NODE_KEY]
      } else {
        oldNodeKey = null
      }

      if(newNodeKey === oldNodeKey) {
        newDataMap[newNodeKey] = { index: i, data: childNodes[i].data }
      } else {
        if(isUndef(oldIndex)) {
          this.insertChild({data: newChildren[i]}, i)
        } else {
          oldIndex = childNodes.findIndex(node => node.data[NODE_KEY] === newNodeKey)
          /**节点还在，但位置改变 */
          if(oldIndex > -1) {
            childNodes.splice(i, 0, ...childNodes.splice(oldIndex, 1))
            newDataMap[newNodeKey] = { index: i, data: newChildren[i] }
          /**新节点 */
          } else {
            this.insertChild({data: newChildren[i]}, i)
          }
        }
      }
      i++
    }

    if (!this.store.lazy) {
      oldData.forEach((item) => {
        if (!newDataMap[item[NODE_KEY]]) this.removeChildByData(item);
      });
    }

    this.updateLeafState()

    reInitChecked(this)
  }

  updateLeafState() {
    const childNodes = this.childNodes;
    if(childNodes.length > 0) {
      return this.isLeaf = false
    }
    if(!this.store.lazy) {
      this.isLeaf = childNodes.length === 0
      return
    }
    else {
      /**
       * 节点已懒加载则直接判断子节点个数
       */
      if(this.loaded) {
        this.isLeaf = childNodes.length === 0
        return
      }
      /**
       * 如果设置了 props.isLeaf 则取此值
       */
      else {
        const isLeafByUser = getPropertyFromData(this, 'isLeaf')
        if(typeof isLeafByUser !== 'undefined') {
          return this.isLeaf = !!isLeafByUser
        }
        return this.isLeaf = false
      }
    }
  }

  get label() {
    return getPropertyFromData(this, 'label')
  }

  get key() {
    const nodeKey = this.store.key
    if(nodeKey && this.data) {
      return this.data[nodeKey]
    }
    return null
  }

  get disabled() {
    return getPropertyFromData(this, 'disabled')
  }

  get nextSibling() {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return parent.childNodes[index + 1];
      }
    }
    return null;
  }

  get previousSibling() {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return index > 0 ? parent.childNodes[index - 1] : null;
      }
    }
    return null;
  }

  contains(target, deep = true) {
    function walk(node) {
      let result = false
      const children = node.childNodes
      if(Array.isArray(children) && children.length > 0) {
        for(let i = 0, l = children.length; i < l; i++) {
          const child = children[i]
          if(child === target || (deep && walk(child, deep))) {
            result = true
            break
          }
        }
      }
      return result
    }
    return walk(this)
  }

  remove() {
    const parent = this.parent;
    if (parent) {
      parent.removeChild(this);
    }
  }

  removeChild(child) {
    const children = this.getChildren() || [];
    const dataIndex = children.indexOf(child.data);
    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }

    const index = this.childNodes.indexOf(child);

    if (index > -1) {
      this.store && this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }

    this.updateLeafState();
  }

  removeChildByData(data) {
    let targetNode = null;

    for (let i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i].data === data) {
        targetNode = this.childNodes[i];
        break;
      }
    }

    if (targetNode) {
      this.removeChild(targetNode);
    }
  }

  expand(callback, expandParent) {
    // debugger
    const done = () => {
      if(expandParent) {
        let parent = this.parent
        while(parent && parent.level > 0) {
          parent.expanded = true
          parent = parent.parent
        }
      }
      this.expanded = true
    }

    if(this.shouldLoadData()) {
      this.loadData(() => {
        if(this.checked) {
          this.setChecked(true)
        } else if(!this.store.checkStrictly) {
          reInitChecked(this)
        }
        done()
      })
    } else {
      done()
    }
  }

   doCreateChildren(children) {
    if(Array.isArray(children)) {
      children.forEach(item => {
        if(!isPlainObject(item)) {
          console.error('[El-Tree-Vritual-Scroll Warn] The members of props.data array must be of object type.')
          return
        }
        this.insertChild({data: item}, undefined, true)
      })
    } else {
      console.error('[El-Tree-Vritual-Scroll Warn] The second argument of props.load is a callback function that should only take value of array type');
    }
  }

  collapse() {
    this.expanded = false
  }

  setChecked(value, recursion) {
    this.checked = value
    if(this.store.checkStrictly) return
    if(!this.shouldLoadData()) {
      let child
      for(let i = 0, l = this.childNodes.length; i < l; i++) {
        child = this.childNodes[i]
        if(child.disabled) {
          continue
        }
        child.setChecked(value, true)
      }

      if(this.childNodes.length > 0) {
        const { all, half } = getChildState(this.childNodes)
        this.checked = all
        this.indeterminate = half
      }
    }
    if(this.parent && !recursion && !this.parent.loading) {
      reInitChecked(this.parent)
    }
  }

  shouldLoadData() {
    return this.store.lazy && this.store.load && !this.loaded
  }

  loadData(callback) {
    if(this.loading) return
    this.loading = true

    const resolve = (children) => {
      this.doCreateChildren(children)
      this.loaded = true
      this.loading = false
      this.updateLeafState()
      callback.call(this, children)
    }

    this.store.load(this, resolve)
  }
}