<template>
  <div class="login">
    <div class="userLogin">
      <div class="main">
        <el-tabs v-model="loginType" class="headtit" @keyup.enter="login">
          <el-tab-pane label="密码登录" name="pwd">
            <el-row class="txt">
              <el-col>
                <el-input v-model="form.pwMode.username" placeholder="请输入用户名">
                  <template #prepend><i class="el-icon-user-solid"></i></template>
                </el-input>
              </el-col>
            </el-row>
            <el-row class="txt">
              <el-col>
                <el-input v-model="form.pwMode.password" type="password" placeholder="请输入登录密码">
                  <template #prepend><i class="el-icon-view"></i></template>
                </el-input>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <el-button class="loginbtn" type="primary" @click="login()">登录</el-button>
      </div>
    </div>
    <footerMain />
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { reactive, ref  } from 'vue'
import { footerMain } from './layout/components'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
export default {
  components: { footerMain },
  setup() {
    const form = reactive({
      pwMode: {
        username: '',
        password: '',
        type: 0
      }
    })
    const store = useStore()
    const router = useRouter()
    // 登录注册
    const login = () => {
      if(form.pwMode.username === '') {
        return ElMessage.error('用户名不正确')
      } else if(form.pwMode.password === '') {
        return ElMessage.error('密码不正确')
      }
      store.dispatch('user/login', form.pwMode).then(res => {
        if (res.res === 0) {
          router.push({ path: '/' })
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    // tab
    const loginType = ref('pwd')
    return {
      form,
      login,
      loginType
    }
  },
}
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
  .userLogin {
    width: 100%;
    flex-grow: 1;
    display: flex;
    align-items: center;
    .main {
      width: 500px;
      height: auto;
      margin: 0 auto;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 1px 10px rgb(0 0 0 / 30%), 0 0 20px rgb(0 0 0 / 10%) inset;
      background: #fff;
    }
    .txt{
      line-height:40px;
      height:40px;
      margin-top:35px;
    }

    .loginbtn {
      width: 100%;
      margin-top: 30px;
    }
  }
}
</style>