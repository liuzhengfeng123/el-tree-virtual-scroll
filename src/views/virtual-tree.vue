<template>
  <div class="virtual-tree-page">
    <el-input
      v-model="query"
      style="width: 240px"
      placeholder="Please enter keyword"
      @input="onQueryChanged"
    />
    <el-tree-virtual-scroll
      class="el-virtual-tree"
      ref="tree"
      :data="data"
      :props="defaultProps"
      height="calc(100vh - 100px)"
      :filter-node-method="filterMethod"
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
      defaultProps: {
        disabled: 'disabled',
        label: 'label'
      },
      query: '',
      data: createData(4, 20, 20),
      defaultExpandAll: true
    }
  },
  watch: {},
  methods: {
    filterMethod(query, node) {
      return node.label.includes(query)
    },
    onQueryChanged(query) {
      this.$refs.tree.filter(query)
    }
  },
  created() {},
  mounted() {}
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
</style>
