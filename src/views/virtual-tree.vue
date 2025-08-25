<template>
  <div class="">
    <el-input v-model="searchText"></el-input>
    <el-tree-virtual-scroll
      class="el-virtual-tree"
      ref="tree"
      node-key="id"
      show-checkbox
      :data="data"
      :height="620"
      :indent="undefined"
      :props="defaultProps"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :expand-on-click-node="true"
      :check-on-click-node="false"
      current-node-key="一级 3"
      highlight-current
      :accordion="accordion"
      :filter-node-method="filterNode"
      draggable
      @node-expand="handleExpand"
      @node-collapse="handleCollapse"
      @check="handleCheck"
      @check-change="handleCheckChange"
      @node-click="handleNodeClick"
      @current-change="handleCurrentChange"
    >
      <template v-slot="{ node, data }">
        <div>
          <i
            :class="
              node.isLeaf
                ? 'el-icon-document'
                : node.expanded
                  ? 'el-icon-folder-opened'
                  : 'el-icon-folder'
            "
          ></i>
          <span>{{ data.id }} - {{ data.label }}</span>
        </div>
      </template>
    </el-tree-virtual-scroll>
  </div>
</template>
<script>
import fileStructor from '@/assets/fileStructor.json'
export default {
  name: 'VirutalTree',
  data() {
    return {
      defaultProps: {
        disabled: 'isUnable'
      },
      searchText: '',
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
      ],
      data: fileStructor,
      defaultExpandAll: true,
      defaultExpandedKeys: ['一级 3', '二级 3-1', '一级 1'],
      defaultExpandedKeys: [],
      defaultCheckedKeys: ['二级 3-1', '二级 2-1'],
      defaultCheckedKeys: [],
      accordion: false
    }
  },
  watch: {
    searchText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(val, data) {
      return data.label.indexOf(val) > -1
    },
    handleExpand(data, node, instance) {
      return
      console.log('expand~')
      console.log({
        data,
        node,
        instance
      })
    },
    handleCollapse(data, node, instance) {
      return
      console.log('collapse~')
      console.log({
        data,
        node,
        instance
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
      return
      console.log('current-change: ', {
        node: node.data.label
      })
    }
  },
  created() {},
  mounted() {
    window.tree = this.$refs.tree
    window.root = tree.store.root
  }
}
</script>
<style lang="scss" scoped>
.el-virtual-tree {
  width: 430px;
  height: calc(100vh - 100px);
}
</style>
