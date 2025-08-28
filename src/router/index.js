import VueRouter from 'vue-router'

const routes = [
  {
    path: '',
    redirect: '/non-lazy'
  },
  {
    path: '/non-lazy',
    name: 'nonLazy',
    component: () => import('@/views/non-lazy.vue')
  },
  {
    path: '/lazy',
    name: 'lazy',
    component: () => import('@/views/lazy.vue')
  },
  {
    path: '/normal',
    name: 'normal',
    component: () => import('@/views/normal.vue')
  },
  {
    path: '/virtual',
    name: 'Virtual',
    component: () => import('@/views/virtual-tree.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router