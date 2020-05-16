const detail = {
  state: {
    type: '',
    content: {}
  },
  mutations: {
    ADD_DETAILS:(state, { type, content }) => {
      state.type = ''
      state.content = {}
      state.type = type
      state.content = content
    }
  }
}

export default detail