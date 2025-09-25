<template>
  <div
    v-show="node.visible"
    ref="node"
    class="el-tree-node"
    :class="{
      'is-expanded': node.expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :draggable="tree.draggable"
    @click.stop="handleClick"
    @contextmenu="handleContextMenu"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
  >
    <div
      class="el-tree-node__content"
      :style="{ paddingLeft: (node.level - 1) * tree.indent + 'px' }"
    >
      <span
        :class="[
          'el-tree-node__expand-icon',
          { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && node.expanded },
          tree.iconClass ? tree.iconClass : 'el-icon-caret-right'
        ]"
        @click.stop="handleExpandIconClick"
      />
      <!-- eslint-disable vue/no-mutating-props -->
      <el-checkbox
        v-if="tree.showCheckbox"
        ref="checkbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      />
      <!-- eslint-enable vue/no-mutating-props -->
      <span v-if="node.loading" class="el-tree-node__loading-icon el-icon-loading" />
      <node-content :node="node" />
    </div>
    <el-collapse-transition>
      <div
        v-if="!tree.renderAfterExpand || childNodeRendered"
        v-show="expanded"
        class="el-tree-node__children"
      >
        <tree-node v-for="child in node.childNodes" :key="getNodeKey(child)" :node="child" />
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import { getNodeKey } from './model/util'
import ElCheckbox from '../checkbox'
import ElCollapseTransition from '../collapse-transition'

export default {
  name: 'TreeNode',
  components: {
    ElCheckbox,
    ElCollapseTransition,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        /* eslint-disable indent */
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node
        return parent.renderContent
          ? parent.renderContent.call(parent._renderProxy, h, {
              _self: tree.$vnode.context,
              node,
              data,
              store
            })
          : tree.$scopedSlots.default
            ? tree.$scopedSlots.default({ node, data })
            : h('span', { class: 'el-tree-node__label' }, node.label)
      }
      /* eslint-enable indent */
    }
  },
  props: {
    node: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      childNodeRendered: false,
      oldChecked: null,
      oldIndeterminate: null,
      expanded: false
    }
  },
  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val)
    },

    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate)
    },

    'node.expanded'(val) {
      if(val) {
        this.childNodeRendered = true
      }
      this.$nextTick(() => this.expanded = val)
    }
  },
  mounted() {},
  created() {
    let parent = this.$parent
    this.tree = parent.isTree ? parent : parent.tree

    const tree = this.tree
    const props = tree.props || {}
    const childrenKey = props.children || 'children'

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren()
    })

    if (this.node.expanded) {
      this.childNodeRendered = true
      this.expanded = true
    }

    this.oldChecked = this.node.checked
    this.oldIndeterminate = this.node.indeterminate
  },
  methods: {
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data)
    },
    handleSelectChange(checked, indeterminate) {
      if (checked !== this.oldChecked || indeterminate !== this.oldIndeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate)
      }
      this.oldChecked = checked
      this.oldIndeterminate = indeterminate
    },
    handleClick() {
      const store = this.tree.store
      store.setCurrentNode(this.node)
      this.tree.$emit(
        'current-change',
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      )
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick()
      }
      if (this.tree.showCheckbox && this.tree.checkOnClickNode && !this.node.disabled) {
        this.$refs.checkbox.$el.click()
      }
      this.tree.$emit('node-click', this.node.data, this.node, this)
    },
    handleContextMenu(event) {
      if (
        this.tree._events['node-contextmenu'] &&
        this.tree._events['node-contextmenu'].length > 0
      ) {
        event.stopPropagation()
        event.preventDefault()
      }
      this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this)
    },
    handleExpandIconClick() {
      const node = this.node
      if (node.isLeaf) return
      if (node.expanded) {
        this.tree.$emit('node-collapse', this.node.data, this.node, this)
        this.node.collapse()
      } else {
        this.node.expand()
        this.tree.$emit('node-expand', this.node.data, this.node, this)

        if (this.tree.accordion) {
          const parent = this.node.parent
          if (parent) {
            parent.childNodes.forEach((child) => {
              if (child !== this.node) {
                child.collapse()
              }
            })
          }
        }
      }
    },
    handleCheckChange(val) {
      this.node.setChecked(val)
      this.$nextTick(() => {
        const store = this.tree.store
        this.tree.$emit('check', this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        })
      })
    },
    handleDragStart(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-start', event, this)
    },
    handleDragOver(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-over', event, this)
      event.preventDefault()
    },
    handleDrop(event) {
      event.preventDefault()
    },
    handleDragEnd(event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-end', event, this)
    }
  }
}
</script>
