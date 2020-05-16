const leaveV2 = {
  state: {
    approvalUserIds: [],
    approvalNames: ''
  },
  mutations: {
    SET_APPROVALUSER:(state, { userids, names }) => {
      state.approvalUserIds = userids
      state.approvalNames = names
    }
  }
}

export default leaveV2
