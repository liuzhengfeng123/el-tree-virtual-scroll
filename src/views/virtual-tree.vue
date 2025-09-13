<template>
  <div class="virtual-tree-page">
    <el-input
      v-model="query"
      style="width: 240px"
      placeholder="Please enter keyword"
      @input="onQueryChanged"
    />
    <el-button type="primary" @click="$refs.tree.expandAllNode()">expand all</el-button>
    <el-button type="info" @click="$refs.tree.collapseAllNode()">collapse all</el-button>
    <el-tree-virtual-scroll
      ref="tree"
      class="el-virtual-tree"
      :data="data"
      :props="defaultProps"
      :item-size="36"
      height="500px"
      node-key="id"
      :filter-node-method="filterMethod"
      :default-expand-all="false"
      show-checkbox
    >
      <template v-slot="{ node, data }">
        <div>
          <i
            :class="[
              'pefix',
              node.isLeaf
                ? 'el-icon-document is-leaf'
                : node.expanded
                  ? 'el-icon-folder-opened'
                  : 'el-icon-folder'
            ]"
          ></i>
          <span class="">{{ data.id }} - {{ data.label }}</span>
        </div>
      </template>
    </el-tree-virtual-scroll>
  </div>
</template>
<script>
const getKey = (prefix, id) => {
  return `${prefix}-${id}`
}

const createData = (maxDeep, maxChildren, minNodesNumber, deep = 1, key = 'node') => {
  let id = 0
  return Array.from({ length: minNodesNumber })
    .fill(deep)
    .map(() => {
      const childrenNumber = deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
      const nodeKey = getKey(key, ++id)
      return {
        id: nodeKey,
        label: nodeKey,
        children: childrenNumber
          ? createData(maxDeep, maxChildren, childrenNumber, deep + 1, nodeKey)
          : undefined
      }
    })
}

export default {
  name: 'VirutalTree',
  data() {
    return {
      defaultProps: {},
      query: '',
      data: createData(4, 15, 20),
      defaultExpandAll: true
    }
  },
  watch: {},
  methods: {
    onQueryChanged() {
      this.$refs.tree.filter(this.query)
    },
    filterMethod(val, data) {
      return data.label.includes(val)
    }
  },
  created() {
    let count = 0
    function t(children) {
      children.forEach((child) => {
        count++
        if (Array.isArray(child.children)) {
          t(child.children)
        }
      })
    }
    t(this.data)
    console.log({ count })
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.el-virtual-tree {
  margin-top: 10px;
}

.pefix {
  margin-right: 10px;
  color: #409eff;

  &.is-leaf {
    color: #67c23a;
  }
}

.el-virtual-tree {
  border: 1px solid #000;
}

.virtual-tree-page ::v-deep .el-tree-node__content {
  height: 36px;
}
</style>
