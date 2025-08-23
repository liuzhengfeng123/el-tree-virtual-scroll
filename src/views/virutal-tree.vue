<template>
  <div class="">
    <el-tree-virtual-scroll
      ref="tree"
      node-key="label"
      show-checkbox
      :data="data"
      :height="500"
      :indent="undefined"
      :props="defaultProps"
      :default-expand-all="(defaultExpandAll)"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :expand-on-click-node="false"
      :check-on-click-node="true"
      current-node-key="一级 3"
      highlight-current
      :accordion="accordion"
      @node-expand="handleExpand"
      @node-collapse="handleCollapse"
      @check="handleCheck"
      @check-change="handleCheckChange"
      @node-click="handleNodeClick"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
export default {
  name: 'VirutalTree',
  data() {
    return {
      defaultProps: {
        disabled: 'isUnable'
      },
      data: [
        {
          label: "一级 1",
          disabled: false,
          children: [
            {
              label: "二级 1-1",
              isUnable: false,
              children: [
                {
                  isUnable: false,
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              isUnable: false,
              children: [
                {
                  label: "三级 2-1-1",
                },
                {
                  label: "三级 2-1-2",
                  isUnable: true
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              isUnable: false,
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 4",
        },
      ],
      defaultExpandAll: true,
      defaultExpandedKeys: ['一级 3', '二级 3-1', '一级 1'],
      defaultCheckedKeys: ['二级 3-1', '二级 2-1'],
      accordion: false,
    }
  },
  methods:{
    handleExpand(data, node, instance) {
      return
      console.log('expand~')
      console.log({
        data, node, instance
      })
    },
    handleCollapse(data, node, instance) {
      return
      console.log('collapse~')
      console.log({
        data, node, instance
      })
    },
    handleCheck(data, state) {
      return
      console.log(data.label)
      console.log('state: ', state)
    },
    handleCheckChange(data, checked, indeterminate) {
      return
      console.log({
        data: data.label,
        checked,
        indeterminate
      })
    },
    handleNodeClick(data, checked, indeterminate) {
      return
      console.log('handleNodeClick~')
      console.log({
        data: data.label,
        checked,
        indeterminate
      })
    },
    handleCurrentChange(data, node) {
      console.log('current-change: ', {
        node: node.data.label
      })
    }
  },
  created(){

  },
  mounted(){
    window.tree = this.$refs.tree
    window.root = tree.store.root
  },
}
</script>
<style lang="scss" scoped>

</style>