import VueRouter from 'vue-router'
import NonLazy from '@/views/non-lazy.vue'
import Lazy from '@/views/lazy.vue'
import Normal from '@/views/normal.vue'

const routes = [
  {
    path: '',
    redirect: '/non-lazy'
  },
  {
    path: '/non-lazy',
    name: 'nonLazy',
    component: NonLazy
  },
  {
    path: '/lazy',
    name: 'lazy',
    component: Lazy
  },
  {
    path: '/normal',
    name: 'normal',
    component: Normal
  }
]

const router = new VueRouter({
  routes
})

export default router