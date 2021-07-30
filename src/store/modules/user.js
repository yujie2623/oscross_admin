import { getRoles, logout, userLogin } from '@/api/user'
import Cookie from 'js-cookie'

const user = {
    namespaced: true,
    state:{
        username:Cookie.get('admin_username'),
        roles: []
    },

    mutations:{
        SET_USERNAME:(state,username) =>{
          state.username = username
        },
        SET_ROLES: (state, roles) => {
          state.roles = roles
        }
    },

    actions:{
      // 登录
      login({commit}, loginform) {
        return new Promise((resolve, reject) => {
          userLogin(loginform).then(res => {
            if (res.res === 0){
              const { username } = loginform
              Cookie.set('admin_username', username)
            }
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
        // 1 管理员
        // 获取角色权限
        getRolesApi({commit}) {
          return new Promise((resolve, reject) => {
            getRoles().then(res => {
              const { roles, username } = res.data
              if (res.res === 0) {
                commit('SET_ROLES', [roles])
                commit('SET_USERNAME', username)
              }
              resolve(res.data)
            }).catch(error => {
              reject(error)
            })
          })
        },

        /* 用户登出 */
        LogoutResult({commit}) {
          return new Promise((resolve, reject) => {
            logout().then(res => {
              if (res.res === 0) {
                commit('SET_USERNAME','')
                commit('SET_ROLES','')
                Cookie.remove('admin_username')
              }
              resolve(res)
            })
          })
        }
    },
}

export default user