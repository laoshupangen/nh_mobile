import { asyncRouterMap, constantRouterMap, commonAsyncRouterMap } from '@/router'

import _ from 'lodash'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return _.some(roles, role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {

  const accessedRouters = _.filter(asyncRouterMap, route => {

    if (hasPermission(roles, route)) {

      if (route.children && route.children.length) {


        route.children = filterAsyncRouter(route.children, roles)

      }

      return true

    }

    return false

  })

  return accessedRouters

}

function filterAsyncRouterMap(menus, asyncRouterMap) {
  let output = []
  let menu = _.chain(menus).map(n => {
    if (n.ChildNodes.length === 0) {
      return {
        ...n,
        category: '未分组'
      }
    } else {
      let flatObject = _.map(n.ChildNodes, t => {
        return {
          ...t,
          category: n.Name
        }
      })
      return flatObject
    }
  }).flattenDeep().value()

  _.forEach(asyncRouterMap, n => {
    _.forEach(menu, t => {
      if (n.name === t.Url) {
        n.meta.category = t.category
        output.push(n)
      }
    })
  })
  return output
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = _.concat([], constantRouterMap, routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      const { roles, menus } = data
      let asyncRouterMapFilter = filterAsyncRouterMap(menus, asyncRouterMap)
      const routerMap = _.concat([], commonAsyncRouterMap, asyncRouterMapFilter)

      return new Promise(resolve => {
        let accessedRouters
        accessedRouters = filterAsyncRouter(routerMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    JudgeRoles({ rootState, commit, dispatch }) {
      let roles = rootState.user.roles
      let children = rootState.user.children
      return new Promise((resolve, reject) => {
        if (!roles) {
          dispatch('Logout')
        } else {
          let role = roles[0]
          if (role === 'parentDuty') {
            if (!children.length) {
              reject({
                code: 'NOBINDATA',
                message: '没有绑定学生'
              })
            }
          }
        }
        resolve()
      })
    }
  }
}
export default permission
