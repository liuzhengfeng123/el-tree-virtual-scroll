<template>
  <div class="non-lazy-page">
    <!-- <h1>non-lazy-page</h1> -->
    <el-tree-virtual-scroll
      ref="tree"
      :key="key"
      :data="(data)"
      :props="defaultProps"
      :indent="undefined"
      :node-key="('fileName', 'id', 'label')"
      :default-expand-all="(defaultExpandAll, true)"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :show-checkbox="true"
      :checkOnClickNode="false"
      :expand-on-click-node="true"
      :check-strictly="checkStrictly"
      :highlightCurrent="false"
      :current-node-key="currentNodeKey"
      :accordion="(accordion, false)"
      :emptyText="emptyText"
      :draggable="true"
      :filter-node-method="filterNode"
      :height="null"
      :renderAfterExpand="true"
    >
    <template v-slot="{node, data}">
      <span>{{ data.label }} - 123</span>
    </template>
      <!-- @node-drag-leave="(a, b, c) => log('node-drag-leave: ', {
        draggingNode: a.label,
        leaveNode: b.label
      })" -->
      <!-- @check="(data, checkState) => log('data: ', data, 'checkState: ', checkState)" -->
      <!-- <template #default="{data}">
        <span>
          <span :class="data.isLeaf ? 'el-icon-document' : 'el-icon-folder'"></span>
          {{ data.fileName }} - {{ data.id }}
        </span>
      </template> -->
    </el-tree-virtual-scroll>
    <hr>
    <!-- <el-button type="primary" @click="handleClick">get CurrentNode</el-button>
    <el-input v-model="searchText" @input="handleInput"></el-input> -->
  </div>
</template>
<script>
import fileStructor from '@/assets/fileStructor.json'
export default {
  name: "NonLazy",
  data() {
    return {
      log: console.log.bind(console),
      defaultProps: {
        label: 'label',
        disabled: 'isUnable'
      },
      searchText: '',
      key: 0,
      accordion: true,
      currentNodeKey: 13,
      defaultExpandAll: true,
      checkStrictly: false,
      defaultExpandedKeys: [4],
      defaultCheckedKeys: [1, 5, 20],
      // defaultExpandedKeys: ['二级 1-1'],
      defaultExpandedKeys: [],
      // defaultCheckedKeys: ['package.json', 'model', 'examples'],
      emptyText: 'no data',
      defaultCheckedKeys: ['三级 2-1-1', '三级 3-2-1'],
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
      data2: fileStructor,
      data2: [
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
                  isUnable: false
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
      // data: []
    }
  },
  methods: {
    traverse(root, cb) {
      const that = this
      cb(root)
      root.childNodes.forEach(item => that.traverse(item, cb))
    },
    append(scope) {
      console.log(scope)
    },
    handleClick() {
      // tree.setCurrentNode(this.data[1].children[0].children[0])
      const node = tree.getNode('一级 2')
      const node2 = tree.getNode('一级 4')
      console.log(node.contains(node2))
    },
    handleCheckChange(data, isChecked, isDescendantChecked) {
      console.log({
        data: data['fileName'], isChecked, isDescendantChecked
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      // if(dropNode.label === '一级 1' && type === 'inner') {
      //   return false
      // }
      return true
    },
    handleInput(val) {
      this.$refs.tree.filter(val)
    },
    filterNode(val, data) {
      return data[this.defaultProps.label].indexOf(val) > -1
    }
  },
  created() {},
  mounted() {
    const root = this.$refs.tree.root
    window.root = root
    window.vm = this
    window.store = root.store
    window.tree = this.$refs.tree
    window.fileStructor = fileStructor
    // this.traverse(root, node => console.log(node[this.defaultProps.label], node.expanded))
  }
}
</script>
<style lang="scss" scoped></style>
