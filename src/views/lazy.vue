<template>
  <div class="lazy-page">
    <el-tree-virtual-scroll
      ref="tree"
      lazy
      node-key="name"
      :props="defaultProps"
      :load="loadNode"
    >
    </el-tree-virtual-scroll>
  </div>
</template>
<script>
export default {
  name: "Lazy",
  data() {
    return {
      data: [],
      defaultProps: { label: 'name' },
    }
  },
  watch: {
  },
  methods: {
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
  }
}
</script>
<style lang="scss" scoped></style>
