<template>
  <div class="non-lazy-page">
    <el-tree-virtual-scroll
      ref="tree"
      :data="data"
      :props="defaultProps"
      :filter-node-method="filterNode"
      default-expand-all
    >
    </el-tree-virtual-scroll>
    <hr />
    <el-button type="primary" @click="handleClick">click me</el-button>
  </div>
</template>
<script>
export default {
  name: 'NonLazy',
  data() {
    return {
      defaultProps: {},
      count: 0,
      data: [
        {
          label: '一级 1',
          disabled: false,
          children: [
            {
              label: '二级 1-1',
              isUnable: false,
              children: [
                {
                  isUnable: false,
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              isUnable: false,
              children: [
                {
                  label: '三级 2-1-1'
                },
                {
                  label: '三级 2-1-2',
                  isUnable: true
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              isUnable: false,
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 4'
        }
      ]
    }
  },
  created() {},
  mounted() {
  },
  beforeDestroy() {},
  methods: {
    handleClick() {
      this.$refs.tree.test()
    },
    filterNode(val, data) {
      return data.label.includes(val)
    }
  }
}
</script>
<style lang="scss" scoped></style>
