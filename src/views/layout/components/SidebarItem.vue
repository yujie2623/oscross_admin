<template>
  <template v-for="(item,index) in routes" :key="index">
    <!--当路由只有一个子路由时-->
      <el-menu-item :index="item.path"><svg-icon :icon-class="item.name" />{{$t(item.name)}}</el-menu-item>
  </template>
</template>
<script>
import svgIcon from '../../../components/svgIcon.vue'
export default {
  components: { svgIcon },
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    parent: {
      type: String
    }
  },
  setup(props) {
    const routes = props.routes
    const hasOneShowingChildren = (children) => {
      console.log(children)
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
    return {
      routes,
      hasOneShowingChildren
    }
  },
}
</script>
<style lang="scss" scoped>
.el-menu-item {
  svg {
    font-size: 20px;
    margin-right: 15px;
    vertical-align: middle;
  }
}
</style>