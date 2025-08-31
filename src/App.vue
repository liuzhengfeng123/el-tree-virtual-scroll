<template>
  <div class="app-container">
    <el-radio-group v-model="route" size="medium">
      <el-radio-button label="/virtual">虚拟滚动</el-radio-button>
      <el-radio-button label="/non-lazy">非虚拟滚动非懒加载</el-radio-button>
      <el-radio-button label="/lazy">非虚拟滚动懒加载</el-radio-button>
    </el-radio-group>
    <el-divider></el-divider>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {}
  },
  computed: {
    route: {
      get() {
        return this.$route.path
      },
      set(val) {
        this.$router.push(val)
      }
    }
  },
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style lang="scss">
body {
  margin: 0;
}
</style>
