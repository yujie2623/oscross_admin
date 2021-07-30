<template>
  <div class="error">
    <svg-icon icon-class="404"></svg-icon>
    <h1>抱歉，该页面找不到，或无法访问</h1>
    <el-tag class="return" @click="clearRouter"><router-link to="/login">返回</router-link></el-tag>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import svgIcon from '../components/svgIcon.vue'
export default {
  components: { svgIcon },
  setup() {
    const router = useRouter()
    const store = useStore()
    const clearRouter = async () => {
      await store.dispatch('user/LogoutResult')
      router.push('/login')
    }
    return {
      clearRouter
    }
  },
}
</script>
<style lang="scss" scoped>
.error {
  margin-top: 6vh;
  text-align: center;
  .svg-icon {
    font-size: 400px;
  }
  h1 {
    font-weight: 300;
  }
  .return {
    width: 200px;
    margin-top: 15px;
    border: 1px solid $mainColor;
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
      color: $mainColor;
    }
    &:hover {
      background: $bgblock;
      border: none;
      a {
        color: #fff;
      }
      transition: all 0.3s;
    }
  }
}
</style>