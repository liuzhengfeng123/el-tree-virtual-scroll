import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VirtualTree from './components/tree'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.component('ElTreeVirtualScroll', VirtualTree)


new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
