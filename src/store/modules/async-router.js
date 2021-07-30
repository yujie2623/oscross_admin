import { dynamicRoutes, constantRoutes } from '@/router'

// 是否有权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// 返回有权限的路由
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const asyncRouter = {
  namespaced: true, // 使用store直接 文件名/generateRoutes即可
  state : {
    routes: [], // 所有路由
    addRoutes: []
  },
  mutations : {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions : {
    generateRoutes({ commit }, roles) {
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(dynamicRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }

}

export default asyncRouter