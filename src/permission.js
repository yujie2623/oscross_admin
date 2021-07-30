import router from "./router/index"
import store from './store/index'
import { ElMessage } from 'element-plus';
import Cookie from 'js-cookie'

router.beforeEach(async(to, from, next) => {
  const isLogin = Cookie.get('admin_username')
  if (isLogin) { // 有用户名
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      if (to.path === '/login') {
        next('/')
      } else {
        next()
      }
    } else {
      try {
        const { roles } = await store.dispatch('user/getRolesApi')
        const accessedRoutes = await store.dispatch('asyncRouter/generateRoutes', [roles])
        accessedRoutes.forEach((item) =>{
          router.addRoute(item)
        })
        next({ path: to.path })
      } catch (error) {
        await store.dispatch('user/LogoutResult')
        ElMessage.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    if (to.path === '/') { // 没有用户名 直接去首页重定向到login
      next('/login')
    } else {
      next()
    }
  }
})