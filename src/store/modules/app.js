const app = {
  state: {
    topIconShow: true,
    topIconClass: null,
    appLoading: false,
    topIconFunction: function () {
      
    },
    footerSHow:true,
  },
  mutations: {
    SET_ICONSHOW: (state, show) => {
      state.topIconShow = show
    },
    SET_APPLOADING: (state, status) => {
      state.appLoading = status
      
    },
    SET_ICONCLASS: (state, classname) => {
      state.topIconClass = classname
    },
    SET_ICONFUNCTION: (state, iFunction) => {
      state.topIconFunction = iFunction
    },
    SET_FOOTER_DISPLAY:(state,status)=>{
      state.footerSHow = status
    }
  },
  actions: {
    SET_TOPICON: ({ commit }, { classname, show, iFunction }) => {
      commit('SET_ICONSHOW', show)
      commit('SET_ICONCLASS', classname)
      commit('SET_ICONFUNCTION', iFunction)
    },
    SET_FOOTER:({commit},{footerShow})=>{
      commit('SET_FOOTER_DISPLAY',footerShow)
    }
  }
  
}

export default app