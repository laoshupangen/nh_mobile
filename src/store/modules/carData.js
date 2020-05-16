import { getcarData } from '@/service'
const carDataStore = {
    state: {
        carDataList: [],
        barData:[]
    },
    mutations: {
        SET_CARDATA(state, payload) {
            state.carDataList = payload
        },
        SAVE(state,payload){
            state.barData = payload
        }
    },
    actions: {
        async setCarData({ commit }, { orgId, dateType }) {
            try {
                let res = await getcarData({ orgId, dateType })
                if (res.data.state === 'success') {
                    let bar = []
                    res.data.data[0].data.forEach(el => {
                        let name = el.orgId.name.substr(el.orgId.name.indexOf("/") + 1);
                        let a = {
                          year: name,
                          type: "未归",
                          value: el.noReturnCount,
                          orgId:el.orgId.id
                        };
                        let b = {
                          year: name,
                          type: "晚归",
                          value: el.lateReturnCount,
                          orgId:el.orgId.id
                        };
                        // let c = {
                        //   year: name,
                        //   type: "未出",
                        //   value: el.noOutCount,
                        //   orgId:el.orgId.id
                        // };
                        bar = [...bar, a, b];
                      });
                    commit('SAVE',bar)  
                    commit('SET_CARDATA', res.data.data[0].data)
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
}

export default carDataStore