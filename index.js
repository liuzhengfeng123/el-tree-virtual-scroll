import veTree from './src/components/tree'

veTree.install = (Vue) => {
  Vue.component(veTree.name, veTree)
}

export default veTree