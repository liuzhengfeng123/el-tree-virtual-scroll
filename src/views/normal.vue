<template>
  <div class="normal-page">
    <h1>normal-page</h1>
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      :node-key="('label')"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :show-checkbox="true"
      :checkOnClickNode="false"
      :expand-on-click-node="true"
    ></el-tree>
  </div>
</template>
<script>
export default {
  name: 'Normal',
  data() {
    return {
      defaultProps: {
        label: 'label',
        disabled: 'isUnable'
      },
      defaultExpandAll: true,
      defaultExpandedKeys: ['一级 2'],
      defaultCheckedKeys: ['三级 3-2-1', '三级 2-1-2'],
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
                  isUnable: true,
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
                  isUnable: true
                },
                {
                  label: "三级 2-1-2"
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
              isUnable: true,
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
      ]
    }
  },
  methods:{

  },
  created(){

  },
  mounted(){

  },
}
</script>
<style lang="scss" scoped>

</style>