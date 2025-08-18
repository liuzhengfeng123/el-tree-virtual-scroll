<template>
  <div class="app-container">
    list: {{ list }}
     <!-- <router-link to="/">non-lazy</router-link>
     <router-link style="margin-left: 10px;" to="/lazy">lazy</router-link>
     <router-link style="margin-left: 10px;" to="/normal">normal</router-link> -->
     <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  components: {
  },
  data() {
    return {
      list: ('Baby One More Time').split(' ')
    }
  },
  watch: {
    list(newVal) {
      console.log('list has changed')
    }
  },
  methods: {},
  created() {
    window.appVm = this
  },
  mounted() {
  }
}
</script>
<style lang="scss"></style>
