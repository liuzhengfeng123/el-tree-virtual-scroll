import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
Vue.use(VueRouter)

import ElTreeVirtualScroll from "./components/Tree"
Vue.component('ElTreeVirtualScroll', ElTreeVirtualScroll)

window.Vue = Vue

window.Vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')