<template>
<div class="main">
  <div class="mainLeft">
    <a href="/" class="home">
      <img src="../../assets/images/logo.png" alt="">
    </a>
    <el-menu
      class="navlist"
      :show-timeout="200"
      :default-active="activeMenu"
      background-color="#242B36"
      text-color="#fff"
      active-text-color="#FF6D34"
      :unique-opened="true"
      router
    >
      <sidebar-item :routes="store.state.asyncRouter.addRoutes"></sidebar-item>
    </el-menu>
  </div>
  <div class="mainright">
    <navbar />
    <app-main />
    <footer-main />
  </div>
</div>
</template>
<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ref } from 'vue'
import { navbar, AppMain, footerMain } from './components'
import SidebarItem from './components/SidebarItem.vue'
export default {
  components: { navbar, AppMain, footerMain, SidebarItem },
  setup() {
    const store = useStore()
    const route = useRoute()
    // 当前路由
    let activeMenu = ref(route.path)

    return {
      store,
      activeMenu
    }

  },
}
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  min-height: 100vh;
  height: auto;
  display: flex;
  .mainLeft {
    width: 200px;
    background: $bgblock;
    .home {
      padding: 10px;
      width: 180px;
      display: inline-block;
      img {
        width: 100%;
      }
    }
    .el-menu {
      border-right: none;
    }
  }
  .mainright {
    width: calc(100% - 200px);
    display: flex;
    flex-direction: column;
  }
}
</style>