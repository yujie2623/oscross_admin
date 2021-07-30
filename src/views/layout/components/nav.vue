<template>
  <div class="header">
    <div class="usercenter">
      <i class="userimg el-icon-user-solid"></i>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{activeusername}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getRoles } from '@/api/user'
export default {
  name: 'navbar',
  setup() {
    const store = useStore()
    const router = useRouter()

    // 退出登录
    const loginout = () => {
      store.dispatch('user/LogoutResult').then(async () => {
        await store.dispatch('user/getRolesApi')
        await store.dispatch('asyncRouter/generateRoutes', store.getters.roles)
        router.push('/login')
      })
    }

    // 获取当前用户
    const activeusername = ref('')
    const activeUser = () => {
      getRoles().then(res => {
        if (res.res === 0) {
          activeusername.value = res.data.username
        }
      })
    }

    onMounted(() => {
      activeUser()
    })

    return {
      store,
      loginout,
      activeusername
    }
  }
}
</script>
<style lang="scss">
.header {
  display: flex;
  border-bottom: 1px solid #dadada;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  .home {
    display: block;
    img {
      width: 180px;
    }
  }
  .usercenter {
    display: flex;
    align-items: center;
    .userimg  {
      font-size: 30px;
    }
    .el-dropdown {
      font-size: 16px;
      padding-left: 10px;
    }
  }
}


</style>