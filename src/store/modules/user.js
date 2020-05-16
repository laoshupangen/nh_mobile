import { restoreLogin, userLogout, userLogin, getDictionary ,getStatusByStudent} from '@/service'
import router from '@/router'
import _ from 'lodash'


const user = {
  state: {
    isLogin: false,
    name: '',
    avatar: '',
    roles: [],
    copy: {},
    selectedChild: '',
    selectedClass: '',
    children: [],
    browserHeaderTitle: '',
    currentOb: '',
    id: null,
    dictionary: {},
    loginLoading: false,
    newAvatar:'',
    bindClass:[],
    currentClass:'',
    teacherRole:Boolean,
    photoStatus:Object
  },
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_STATUS: (state, status) => {
      state.loginLoading = status
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOGINSTATUS: (state, status) => {
      state.isLogin = status
    },
    SET_BROWSERHEADERTITLE: (state, action) => {
      // console.log( "action.browserHeaderTitle", action.browserHeaderTitle );
      state.browserHeaderTitle = action.browserHeaderTitle
    },
    SET_COPY: (state, userInfo) => {
      state.copy = userInfo
    },

    SET_CHILDREN: (state, children) => {
      state.children = _.map(children, (item, i) => {
        return _.assign({}, item, { id: i })
      }) || {}
    },
    SET_USERID: (state, userId) => {
      state.id = userId
    },
    SET_CURRENTOBJECT: (state, { id, key }) => {
      state.currentOb = _.find(state.children, (n) => {
        return n[key] === id
      })
    },
    SET_DICTIONARY:(state, data) => {
      state.dictionary = data
    },
    ADD_CHILDREN: (state, userInfo) => {
      state.children.push(_.assign({ }, userInfo, { id: userInfo.F_Stu_Id }))
    },
    SET_BindClass: (state, bindClass) => {
      state.bindClass = _.map(bindClass, (item, i) => {
        return _.assign({}, item, { id: i })
      }) || {}
    },
    SET_TEACHEROLE:(state,data)=>{
      data = data==='True'?true:false
      
      state.teacherRole = data
    },
    //老师绑定班级
    ADD_BindClass: (state, data) => {
      state.bindClass.push(_.assign( data))
    },
    SET_CURRENTCLASS: (state, data) => {
      state.currentClass = data
    },
    SET_NEW_AVATAR:(state,newavatar) => {
      state.newAvatar = newavatar
    },
    SET_PHOTO_STATUS:(state,photoStatus)=>{
      state.photoStatus = photoStatus
    }   
  },
  actions: {
    async RestoreLogin({ state, dispatch, commit }) {
      commit('SET_STATUS', true)
      commit('SET_APPLOADING', true)
      return new Promise((resolve, reject) => {
        restoreLogin().then(info => {
          let userInfo = info.data
          commit('SET_NAME', userInfo.UserName)
          commit('SET_AVATAR', userInfo.HeadIcon)
          commit('SET_ROLES', [userInfo.Duty])
          commit('SET_LOGINSTATUS', true)
          commit('SET_CHILDREN', userInfo.children || {})
          commit('SET_BindClass', userInfo.Classes || [])
          commit('SET_USERID', userInfo.UserId)
          commit('SET_COPY', userInfo)
          if (state.children.length) {
            commit('SET_CURRENTOBJECT', {
              id: state.children[0].id,
              key: 'id'
            })
          }
          if (state.bindClass.length) {
            commit('SET_CURRENTCLASS', {
              key: state.bindClass[0].Id,
              value: state.bindClass[0].Name,
            })
          }
          getStatusByStudent().then(res=>{
            let photoStatus = res.data.data || res.data
            console.log('store',photoStatus)
            commit('SET_PHOTO_STATUS',photoStatus)
          })
          getDictionary().then(dic => {
            let dictionary = dic.data 
            console.log(dictionary)
            commit('SET_DICTIONARY', dictionary.data)
            dispatch('GenerateRoutes', { roles: [userInfo.Duty], menus: _.filter(JSON.parse(dictionary.data.authorizeMenu), item => item.BelongSys === '2' || item.BelongSys === '3') })
            // dispatch('INIT_CHATLIST')
            commit('SET_STATUS', false)
            commit('SET_APPLOADING', false)
            resolve(info)
          })
          
        }).catch(err => {
          console.log(err)
          commit('SET_STATUS', false)
          commit('SET_APPLOADING', false)
          reject({
            code: 'LOGIN_FAILED',
            message: err.message
          })
        })
      })
    },
    async Logout({rootState, commit, dispatch }) {
      commit('SET_APPLOADING', true)
      return new Promise((resolve, reject) => {
        userLogout().then(data => {
          commit('SET_ROLES', [])
          commit('SET_LOGINSTATUS', false)
          commit('SET_CHILDREN', [])
          commit('SET_BindClass', [])
          commit('SET_CURRENTCLASS', {})
          if (rootState.message.socket) {
            dispatch('DISCONNECT_SOCKET')
          }
          commit('SET_APPLOADING', false)
          router.push({ path:'/login?expired=1' })
          resolve(data)
        }).catch(err => {
          commit('SET_APPLOADING', false)
          reject({
            code: 'LOGOUT_FAILED',
            message: '登出失败'
          })
        })
      })
    },
    async Login({ commit }, userInfo) {
      commit('SET_STATUS', true)
      return new Promise((resolve, reject) => {
        userLogin(userInfo).then(data => {
          commit('SET_STATUS', false)
          resolve(data)
        }).catch(err => {
          console.log(err.message)
          commit('SET_STATUS', false)
          reject({
            code: 'LOGIN_FAILED',
            message: err.message
          })
        })
      })
    },
  }
}

export default user
