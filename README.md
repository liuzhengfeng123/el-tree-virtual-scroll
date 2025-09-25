# el-tree-virtual-scroll

基于 `Element-UI` 的树形组件，将组件原本的架构改写成了虚拟滚动的形式，来支持大数据量展示，同时完全兼容原组件的所有 API，还提供了额外的方法 `expandAllNode` 和 `collapseAllNode` 来一键展开、收缩所有节点。

⚠️ 仅支持 vue2

官方网站：[http://106.14.18.67](http://106.14.18.67)（域名证书申请过中）

源码：[https://github.com/liuzhengfeng123/el-tree-virtual-scroll](https://github.com/liuzhengfeng123/el-tree-virtual-scroll)

## 原理介绍

原本的组件 DOM  结构是父节点包含子节点，当节点数量达到 1000+ 时，展开收缩非叶子节点就能感受到明显的卡顿。但是组件原本父子节点嵌套的 DOM 结构并不好改写成虚拟滚动列表，于是通过递归遍历所有节点维护了一个计算属性：将原本嵌套的 `props.data` 数据结构平铺展开成为了一个一维数组，这样改写成虚拟滚动的结构就方便很多了。

## 安装

```javascript
npm i el-tree-virtual-scroll -S
```

## 引入

### 全局注册组件
```javascript
// main.js
import VirtualScroll from 'el-tree-virtual-scroll'

// 全局注册组件
Vue.component('VirtualScroll', VirtualScroll)
```

### 局部注册组件
```vue
<script>
import VirtualScroll from 'el-tree-virtual-scroll'

// ...

export default {
  ...,
  components: {
    VirtualScroll
  },
  ....
}
```

## 使用

所有 API 与 `el-tree` 完全兼容，**但如果要开启虚拟滚动必须为组件传入`height`来设置组件高度，否则就跟原 `el-tree`组件表现一样，还要传入 `node-key`作为每个节点的唯一标识**！！同时，如果单层节点高度不是 `26px` (el-tree 原样式高度)，则还需要通过 `item-size` 来传入节点单层高度。

最简单使用
```vue
<template>
  <virtual-scroll :data="data" node-key="id" :height="300" :item-size="26" />
</template>

<script>
export default {
  data() {
    return {
      data: []
    }
  },
  created() {
    const getKey = (prefix, id) => {
      return `${prefix}-${id}`
    }

    const createData = (maxDeep, maxChildren, minNodesNumber, deep = 1, key = 'node') => {
      let id = 0
      return Array.from({ length: minNodesNumber })
        .fill(deep)
        .map(() => {
          const childrenNumber =
            deep === maxDeep ? 0 : Math.round(Math.random() * maxChildren)
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
    this.data = createData(4, 15, 15)
  }
}
</script>
```

## 注意事项
本组件只支持树节点定高的场景，目前暂时还无法兼容树节点不定高的情况。

虽然虚拟滚动将 DOM 节流、重绘的开销降低到几乎可以忽略不计，但是由于 `vue2` 会递归地为 `props.data` 所有节点和属性进行响应式改写。所以当节点数量达到 **20000以上**时，勾选，或者通过 `filter` 过滤树节点时会有一瞬间的卡顿，因为同时触发了上万个响应式回调，这是关于 `js` 方面的开销，并不是虚拟滚动所能解决的问题。