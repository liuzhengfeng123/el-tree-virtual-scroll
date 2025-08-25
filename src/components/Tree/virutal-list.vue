<template>
  <div
    ref="list"
    class="virtual-scroll__container"
    :style="{ height: containerHeight }"
    @scroll="handleScroll"
  >
    <div
      class="virtual-scroll__placeHolder"
      :style="{
        height: totalHeight + 'px'
      }"
    />
    <virtual-tree-node
      v-for="node in renderList"
      :key="getNodeKey(node)"
      :node="node"
      :style="{
        transform: `translateY(${offsetY}px)`
      }"
    />
  </div>
</template>
<script>
import { getNodeKey } from './model/util'
import virtualTreeNode from './virtual-tree-node.vue'
export default {
  name: 'VirtualTreeContainer',
  components: {
    virtualTreeNode
  },
  props: {
    height: [Number, String],
    filterNodes: Array,
    itemSize: Number,
    nodeKey: {
      type: String,
      default: 'id'
    },
    isResetScrollCache: Boolean
  },
  beforeCreate() {
    this.tree = this.$parent
    window.virtualListVm = this
  },
  data() {
    return {
      offsetY: 0,
      startIndex: 0,
      maxCount: 0,
      realContainerHeight: 0,
      ticking: false,
      curIndex: 0,
      scrollCache: []
    }
  },
  computed: {
    containerHeight() {
      return typeof this.height === 'number' ? this.height + 'px' : this.height
    },
    totalHeight() {
      return this.filterNodes.length * this.itemSize
    },
    renderList() {
      return this.filterNodes.slice(this.startIndex, this.endIndex)
    },
    endIndex() {
      return this.curIndex + 2 * this.maxCount
    }
  },
  watch: {
    isResetScrollCache(val) {
      if(val) {
        this.$nextTick(() => this.scroll())
      }
    }
  },
  created() {},
  mounted() {
    const cHeight = this.$refs.list.clientHeight
    this.maxCount = Math.ceil(cHeight / this.itemSize)
    this.realContainerHeight = cHeight
    this.scrollCache[0] = 0
    this.scrollCache[1] =
      this.endIndex >= this.filterNodes.length
        ? this.$refs.list.scrollHeight
        : (this.endIndex - Math.ceil(this.maxCount / 2)) * this.itemSize
  },
  methods: {
    getNodeKey(node) {
      return getNodeKey(this.nodeKey, node.data)
    },
    handleScroll() {
      if (this.ticking) return
      this.ticking = true
      window.requestAnimationFrame(() => (this.ticking = false))
      this.scroll()
    },
    scroll() {
      const scrollTop = this.$refs.list.scrollTop
      // console.log("this.isResetScrollCache: ", this.isResetScrollCache)
      if (
        !this.isResetScrollCache &&
        scrollTop >= this.scrollCache[0] &&
        scrollTop + this.realContainerHeight <= this.scrollCache[1]
      ) {
        return
      }
      this.$emit('reset')
      this.curIndex = Math.floor(scrollTop / this.itemSize)
      this.startIndex = this.curIndex - this.maxCount < 0 ? 0 : this.curIndex - this.maxCount
      this.offsetY = this.startIndex * this.itemSize

      if (this.startIndex === 0) {
        this.scrollCache[0] = 0
      } else {
        this.scrollCache[0] = (this.startIndex + Math.ceil(this.maxCount / 2)) * this.itemSize
      }

      if (this.endIndex >= this.filterNodes.length) {
        this.scrollCache[1] = this.$refs.list.scrollHeight
      } else {
        this.scrollCache[1] = (this.endIndex - Math.ceil(this.maxCount / 2)) * this.itemSize
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.virtual-scroll__container {
  position: relative;
  overflow: auto;
  border: 1px solid #000;
}
.virtual-scroll__placeHolder {
  position: absolute;
  width: 100%;
  z-index: -1;
}
</style>
