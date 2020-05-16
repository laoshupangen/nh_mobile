import router from './router'
import store from './store'
import _ from 'lodash'
import { NotLoginRouterMap } from '@/router'

// permission judge function
function hasPermission(roles, permissionRoles) {
  if (!permissionRoles) return true
  return _.some(roles, role => permissionRoles.indexOf(role) >= 0)
}



const whiteList = ['/login'] // 不重定向白名单
const titlesList = ['VisitorApproval']

router.beforeEach((to, from, next) => {
  //推送报表单页 不需要验证登陆
  if (to.path === '/LateInReportMsg' || to.path === '/NotInReportMsg' || to.path === '/NotOutReportMsg') {
    if (to.name == null) {
      router.addRoutes(NotLoginRouterMap)
      next({ ...to, replace: true })
    } else {
      // 设置浏览器头部标题
      const browserHeaderTitle = to.meta.title || ''
      store.commit('SET_BROWSERHEADERTITLE', {
        browserHeaderTitle: browserHeaderTitle
      })
      next()
    }
    store.commit('SET_ICONSHOW', false)
    return
  }

  // console.log('title', to)
  store.commit('SET_ICONFUNCTION', function () {})
  if (to.path === '/login' && to.query.expired && !store.getters.isLogin) {
    next(true)
  } else {
  if (!store.getters.isLogin) {
    let title = ''
    if(typeof(to.meta.title) === 'object'){
      title = ''
    }else{
      title = to.meta.title||''
    }

    const browserHeaderTitle = title
    // const browserHeaderTitle = to.meta.title || ''
    store.commit('SET_BROWSERHEADERTITLE', {
      browserHeaderTitle: browserHeaderTitle
    })
    //if (to.path === '/login') {
     // next()
    //} else {
      if (store.getters.roles.length === 0) {
        (async() => {
          try {
            let data = await store.dispatch('RestoreLogin')
            router.addRoutes(store.getters.addRouters)
            await store.dispatch('JudgeRoles')
            if (to.path === '/login') {
              next({path: '/school'})
            } else {
              next({ ...to, replace: true })
            }
          } catch(err) {
            if (err.code === 'NOBINDATA') {
              next({ path: '/bindChild' })
            } else if(err.code === 'LOGIN_FAILED') {
              next('/login?expired=1')
            }
          }
        })()
        /**store.dispatch('GetInfo').then(res => {
          const roles = res.roles
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              router.addRoutes(store.getters.addRouters)
              next({ ...to, replace: true })
            })
          }).catch((err) => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })*/
        } else {

          if (hasPermission(store.getters.roles, to.meta.roles)) {
            if (to.meta.top) {
              if (hasPermission(store.getters.roles, to.meta.top.roles)) {
                store.commit('SET_ICONSHOW', true)
                store.commit('SET_ICONCLASS', to.meta.top.iconClass)
              } else {
                store.commit('SET_ICONSHOW', false)
              }
            } else {
              store.commit('SET_ICONSHOW', false)
              store.commit('SET_ICONSHOW', false)
            }
            next()
          } else {
            next({ path: '/401', replace: true, query: { noGoBack: true }})
          }
        }
      //}
      //}
    } else {
      // 设置浏览器头部标题
      let title = ''
      if(typeof(to.meta.title) === 'object'){       
        let a = to.meta.title
        let b = a.find((item)=>item.level === store.getters.userInfo.Duty)
        title = b.name
      }else{
        title = to.meta.title||''
      }

      const browserHeaderTitle = title
      store.commit('SET_BROWSERHEADERTITLE', {
        browserHeaderTitle: browserHeaderTitle
      })
      if (to.path === '/login') {
        next('/school')
      } else if (hasPermission(store.getters.roles, to.meta.roles)) {
        if (to.meta.top) {
          if (hasPermission(store.getters.roles, to.meta.top.roles)) {
            store.commit('SET_ICONSHOW', true)
            store.commit('SET_ICONCLASS',  to.meta.top.iconClass)
          } else {
            store.commit('SET_ICONSHOW', false)
          }
        } else {
          store.commit('SET_ICONSHOW', false)
        }
        next()
      } else {
        next({ path: '/401', replace: true, query: { noGoBack: true }})
      }
    }
  }
  })
