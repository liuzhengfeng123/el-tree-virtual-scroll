<template>
  <div
    class="el-tree"
    :class="{
      'el-tree--highlight-current': highlightCurrent,
      'is-dragging': !!dragState.draggingNode,
      'is-drop-not-allow': !dragState.allowDrop,
      'is-drop-inner': dragState.dropType === 'inner'
    }"
    role="tree"
  >
    <template v-if="height">
      <virtual-list
        v-if="height && filterNodes.length > 0"
        :height="height"
        :filter-nodes="filterNodes"
        :item-size="itemSize"
        :node-key="nodeKey"
        :is-reset-scroll-cache="isResetScrollCache"
        :is-empty="isEmpty"
        @reset="isResetScrollCache = false"
      />
      <div v-if="isEmpty" class="el-tree__empty-block">
        <span class="el-tree__empty-text">{{ emptyText }}</span>
      </div>
    </template>
    <template v-else>
      <div class="normal-tree">
        <tree-node v-for="child in root.childNodes" :key="getNodeKey(child)" :node="child" />
      </div>
      <div v-if="isEmpty" class="el-tree__empty-block">
        <span class="el-tree__empty-text">{{ emptyText }}</span>
      </div>
    </template>
    <div v-show="dragState.showDropIndicator" ref="dropIndicator" class="el-tree__drop-indicator" />
  </div>
</template>
<script>
import TreeStore from './model/tree-store'
import TreeNode from './tree-node'
import VirtualList from './virtual-list'
import { findNearestComponent, getNodeKey } from './model/util.js'
import { addClass, removeClass } from '../utils'

export default {
  name: 'ElTreeVirtualScroll',
  components: {
    TreeNode,
    VirtualList
  },
  props: {
    data: Array,
    props: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        }
      }
    },
    iconClass: String,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: Boolean,
    nodeKey: String,
    defaultExpandedKeys: Array,
    defaultCheckedKeys: Array,
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    filterNodeMethod: Function,
    lazy: {
      type: Boolean,
      default: false
    },
    load: Function,
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    checkOnClickNode: Boolean,
    checkStrictly: Boolean,
    indent: {
      type: Number,
      default: 18
    },
    highlightCurrent: Boolean,
    currentNodeKey: [String, Number],
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    accordion: Boolean,
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: Function,
    allowDrop: Function,
    height: [Number, String],
    itemSize: {
      type: Number,
      default: 26
    }
  },
  data() {
    return {
      root: null,
      dragState: {
        showDropIndicator: false,
        draggingNode: null,
        dropNode: null,
        allowDrop: true
      },
      isResetScrollCache: false
    }
  },
  computed: {
    isEmpty() {
      const { childNodes } = this.root
      return !childNodes || childNodes.length === 0 || childNodes.every(({ visible }) => !visible)
    },
    filterNodes() {
      function traverse(children) {
        let ret = []
        if (Array.isArray(children)) {
          children.forEach((child) => {
            if (child.visible) {
              ret.push(child)
            }
            if (child.expanded) {
              ret = ret.concat(traverse(child.childNodes))
            }
          })
        }
        return ret
      }

      return traverse(this.root?.childNodes || [])
    }
  },
  watch: {
    defaultExpandedKeys(newVal) {
      this.store.setDefaultExpandedKeys(newVal)
    },
    defaultCheckedKeys(newVal) {
      this.store.setDefaultCheckedKey(newVal)
    },
    checkStrictly(newVal) {
      this.store.checkStrictly = newVal
    },
    data(newVal) {
      this.isResetScrollCache = true
      this.store.setData(newVal)
    }
  },
  created() {
    this.isTree = true
    this.store = new TreeStore({
      data: this.data,
      props: this.props,
      key: this.nodeKey,
      lazy: this.lazy,
      load: this.load,
      defaultExpandAll: this.defaultExpandAll,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultCheckedKeys: this.defaultCheckedKeys,
      filterNodeMethod: this.filterNodeMethod,
      checkStrictly: this.checkStrictly,
      currentNodeKey: this.currentNodeKey
    })
    this.root = this.store.root
    const dragState = this.dragState
    this.$on('tree-node-drag-start', (event, treeNode) => {
      if (typeof this.allowDrag === 'function' && !this.allowDrag(treeNode.node)) {
        event.preventDefault()
        return false
      }
      // event.dataTransfer.effectAllowed = 'move'
      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        event.dataTransfer.setData('text/plain', '')
      } catch (e) {
        e
      }
      dragState.draggingNode = treeNode
      this.$emit('node-drag-start', treeNode.node, event)
    })
    this.$on('tree-node-drag-over', (event) => {
      const dropNode = findNearestComponent(
        event.target,
        this.height ? 'VirtualTreeNode' : 'TreeNode'
      )
      const oldDropNode = dragState.dropNode
      if (oldDropNode && oldDropNode !== dropNode) {
        removeClass(oldDropNode.$el, 'is-drop-inner')
      }
      const draggingNode = dragState.draggingNode
      if (!draggingNode || !dropNode) return

      let dropPrev = true
      let dropInner = true
      let dropNext = true
      let userAllowDropInner = true
      if (typeof this.allowDrop === 'function') {
        dropPrev = this.allowDrop(draggingNode.node, dropNode.node, 'prev')
        userAllowDropInner = dropInner = this.allowDrop(draggingNode.node, dropNode.node, 'inner')
        dropNext = this.allowDrop(draggingNode.node, dropNode.node, 'next')
      }
      event.dataTransfer.dropEffect = dropInner ? 'move' : 'none'
      if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
        if (oldDropNode) {
          this.$emit('node-drag-leave', draggingNode.node, oldDropNode.node, event)
        }
        this.$emit('node-drag-enter', draggingNode.node, dropNode.node, event)
      }

      if (dropPrev || dropInner || dropNext) {
        dragState.dropNode = dropNode
      }

      if (dropNode.node.nextSibling === draggingNode.node) {
        dropNext = false
      }
      if (dropNode.node.previousSibling === draggingNode.node) {
        dropPrev = false
      }
      if (dropNode.node.contains(draggingNode.node, false)) {
        dropInner = false
      }
      if (draggingNode.node === dropNode.node || draggingNode.node.contains(dropNode.node)) {
        dropPrev = false
        dropInner = false
        dropNext = false
      }

      // const targetPosition = dropNode.$el.getBoundingClientRect()
      const targetPosition = dropNode.$el
        .querySelector('.el-tree-node__content')
        .getBoundingClientRect()
      const treePosition = this.$el.getBoundingClientRect()

      let dropType
      const prevPercent = dropPrev ? (dropInner ? 0.25 : dropNext ? 0.45 : 1) : -1
      const nextPercent = dropNext ? (dropInner ? 0.75 : dropPrev ? 0.55 : 0) : 1

      let indicatorTop = -9999
      const distance = event.clientY - targetPosition.top
      if (distance < targetPosition.height * prevPercent) {
        dropType = 'before'
      } else if (distance > targetPosition.height * nextPercent) {
        dropType = 'after'
      } else if (dropInner) {
        dropType = 'inner'
      } else {
        dropType = 'none'
      }

      const iconPosition = dropNode.$el
        .querySelector('.el-tree-node__expand-icon')
        .getBoundingClientRect()
      const dropIndicator = this.$refs.dropIndicator
      if (dropType === 'before') {
        indicatorTop = iconPosition.top - treePosition.top
      } else if (dropType === 'after') {
        indicatorTop = iconPosition.bottom - treePosition.top
      }
      dropIndicator.style.top = indicatorTop + 'px'
      dropIndicator.style.left = iconPosition.right - treePosition.left + 'px'

      if (dropType === 'inner') {
        addClass(dropNode.$el, 'is-drop-inner')
      } else {
        removeClass(dropNode.$el, 'is-drop-inner')
      }

      dragState.showDropIndicator = dropType === 'before' || dropType === 'after'
      dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner
      dragState.dropType = dropType
      this.$emit('node-drag-over', draggingNode.node, dropNode.node, event)
    })
    this.$on('tree-node-drag-end', (event) => {
      const { draggingNode, dropType, dropNode } = dragState
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'

      if (draggingNode && dropNode) {
        const draggingNodeCopy = { data: draggingNode.node.data }
        if (dropType !== 'none') {
          draggingNode.node.remove()
        }
        if (dropType === 'before') {
          dropNode.node.parent.insertBefore(draggingNodeCopy, dropNode.node)
        } else if (dropType === 'after') {
          dropNode.node.parent.insertAfter(draggingNodeCopy, dropNode.node)
        } else if (dropType === 'inner') {
          dropNode.node.insertChild(draggingNodeCopy)
        }
        if (dropType !== 'none') {
          this.store.registerNode(draggingNodeCopy)
        }

        removeClass(dropNode.$el, 'is-drop-inner')

        this.$emit('node-drag-end', draggingNode.node, dropNode.node, dropType, event)
        if (dropType !== 'none') {
          this.$emit('node-drop', draggingNode.node, dropNode.node, dropType, event)
        }
      }
      if (draggingNode && !dropNode) {
        this.$emit('node-drag-end', draggingNode.node, null, dropType, event)
      }

      dragState.showDropIndicator = false
      dragState.draggingNode = null
      dragState.dropNode = null
      dragState.allowDrop = true
    })
  },
  mounted() {},
  methods: {
    getNodeKey(node) {
      return getNodeKey(this.nodeKey, node.data)
    },
    filter(value) {
      if (!this.filterNodeMethod)
        throw new Error('[El-Tree-Vritual-Scroll Warn] filterNodeMethod is required when filter')
      this.store.filter(value)
      this.isResetScrollCache = true
    },
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.store.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    getCheckedKeys(leafOnly) {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in getCheckedKeys')
      return this.store.getCheckedKeys(leafOnly)
    },
    getHalfCheckedNodes() {
      return this.store.getHalfCheckedNodes()
    },
    getHalfCheckedKeys() {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in getHalfCheckedKeys')
      return this.store.getHalfCheckedKeys()
    },
    getCurrentNode() {
      const currentNode = this.store.getCurrentNode()
      return currentNode ? currentNode.data : null
    },
    getCurrentKey() {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in getCurrentKey')
      const currentNode = this.getCurrentNode()
      return currentNode ? currentNode[this.nodeKey] : null
    },
    setCurrentNode(node) {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in setCurrentNode')
      this.store.setUserCurrentNode(node)
    },
    setCurrentKey(key) {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in setCurrentKey')
      this.store.setCurrentNodeKey(key)
    },
    getNode(data) {
      return this.store.getNode(data)
    },
    remove(data) {
      this.store.remove(data)
    },
    append(data, parentNode) {
      this.store.append(data, parentNode)
    },
    insertBefore(data, refNode) {
      this.store.insertBefore(data, refNode)
    },
    insertAfter(data, refNode) {
      this.store.insertAfter(data, refNode)
    },
    setCheckedKeys(keys, leafOnly) {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in setCheckedKeys')
      this.store.setCheckedKeys(keys, leafOnly)
    },
    setCheckedNodes(nodes, leafOnly) {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in setCheckedNodes')
      this.store.setCheckedNodes(nodes, leafOnly)
    },
    setChecked(data, checked) {
      this.store.setChecked(data, checked)
    },
    updateKeyChildren(key, data) {
      if (!this.nodeKey)
        throw new Error('[El-Tree-Vritual-Scroll Warn] nodeKey is required in updateKeyChild')
      this.store.updateChildren(key, data)
    },
    collapseAllNode() {
      function traverse(children) {
        if (Array.isArray(children)) {
          children.forEach((child) => {
            child.expanded = false
            traverse(child.childNodes || [])
          })
        }
      }
      traverse(this.root.childNodes)
    },
    expandAllNode() {
      function traverse(children) {
        if (Array.isArray(children)) {
          children.forEach((child) => {
            child.expanded = true
            traverse(child.childNodes || [])
          })
        }
      }
      traverse(this.root.childNodes)
    }
  }
}
</script>
<style lang="scss" scoped></style>
