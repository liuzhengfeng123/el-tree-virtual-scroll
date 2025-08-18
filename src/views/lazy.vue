<template>
  <div class="lazy-page">
    <h1>lazy-page</h1>
    <el-tree-virtual-scroll
      ref="tree"
      lazy
      node-key="name"
      :props="defaultProps"
      :load="loadNode"
      :show-checkbox="true"
      :default-expand-all="false"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :filter-node-method="filterNode"
      :expand-on-click-node="true"
      :check-strictly="false"
      highlightCurrent
      :current-node-key="currentNodeKey"
    >
    </el-tree-virtual-scroll>
    <el-input v-model="seachTxt"></el-input>
  </div>
</template>
<script>
export default {
  name: "Lazy",
  data() {
    return {
      data: [],
      defaultProps: { label: 'name' },
      defaultCheckedKeys: ['final2'],
      defaultExpandedKeys: ['region'],
      currentNodeKey: ('final'),
      seachTxt: '',
    }
  },
  watch: {
    seachTxt(value) {
      this.$refs.tree.filter(value)
    }
  },
  methods: {
    filterNode(value, data, node) {
      console.log({value, data})
      return data.name.indexOf(value) > -1
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([
          {
            name: "region",
          },
        ])
      }
      if (node.level === 2 && node.data.name === "zone")
        return setTimeout(() => {
          resolve([
            {
              name: "final",
              disabled: true
            },
            {
              name: "final2",
              disabled: false
            },
          ])
        }, 500)
      if (node.level > 1) return resolve([])

      setTimeout(() => {
        const data = [
          {
            name: "leaf",
            disabled: false,
            isLeaf: true
          },
          {
            name: "zone"
          }
        ]

        resolve(data)
      }, 500)
    }
  },
  created() {},
  mounted() {
    const root = this.$refs.tree.root
    window.root = root
    window.vm = this
    window.tree = this.$refs.tree
  }
}
</script>
<style lang="scss" scoped></style>
