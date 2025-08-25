<template>
  <div
    class="el-tree-node"
    :class="{
      'is-expanded': node.expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    tabindex="-1"
    :draggable="tree.draggable"
  >
    <div
      class="el-tree-node__content"
      :style="{ paddingLeft: (node.level - 1) * tree.indent + 'px' }"
      @click.stop="handleClick"
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
      <span v-if="node.loading" class="el-tree-node__loading-icon el-icon-loading" />
      <node-content :node="node" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'VirtualTreeNode',
  components: {
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render(h) {
        /* eslint-disable indent */
        const tree = this.$parent.tree
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
      oldChecked: null,
      oldIndeterminate: null
    }
  },
  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val)
    },
    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate)
    }
  },
  created() {
    this.tree = this.$parent.tree
    this.oldChecked = this.node.checked
    this.oldIndeterminate = this.node.indeterminate
  },
  mounted() {},
  methods: {
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
    handleSelectChange(checked, indeterminate) {
      if (checked !== this.oldChecked || indeterminate !== this.oldIndeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate)
      }
      this.oldChecked = checked
      this.oldIndeterminate = indeterminate
    }
  }
}
</script>
<style lang="scss" scoped></style>
