// 徐
import { getSafeData } from '@/service'
const SafeStore = {
    state: {
        SafeDataList: []
    },
    mutations: {
        SET_SAFEDATA(state, payload) {
            state.SafeDataList = payload
        }
    },
    actions: {
        async setSafeData({ commit }, { orgId, startTime, EndTime }) {
            try {
                let res = await getSafeData({ orgId, startTime, EndTime })
                if (res.data.state === 'success') {
                    commit('SET_SAFEDATA', res.data.data)
                }
            } catch (e) {
                console.log(e);
            }
            
        }
    }
}
export default SafeStore
// 徐