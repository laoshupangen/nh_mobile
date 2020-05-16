import _ from 'lodash'

const prepare = {
  state: {
    resourceList: [],
    homeWork: '',
    prepare: '',
    knowledge: '',
    memo: ''
  },
  mutations: {
    SET_PREPAREINFO: (state, { homeWork, prepare, knowledge, resourceList, memo }) => {
      state.resourceList = resourceList || []
      state.prepare = prepare || ''
      state.homeWork = homeWork || ''
      state.knowledge = knowledge || ''
      state.memo = memo || ''
    },
    CLEAR_PREPAREINFO: (state) => {
      state.resourceList = []
      state.prepare = ''
      state.homeWork = ''
      state.knowledge = ''
      state.memo = ''
    },
    ADD_FILES: (state, file) => {
      state.resourceList.push(file)
    },
    REMOVE_FILE: (state, id) => {
      state.resourceList = _.remove(state.resourceList, function (n) {
        return n.F_Id !== id
      })
    },
    SET_SINGLEPREPAREINFO: (state, { key, value }) => {
      state[key] = value
    }
  }
}

export default prepare