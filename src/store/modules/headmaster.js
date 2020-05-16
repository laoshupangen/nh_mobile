import { getHeadmasterData } from '@/service'
const Headmaster = {
    state: {
        HeadmasterList: {}
    },
    mutations: {
        SET_HEADMASTERDATA(state, payload) {
            state.HeadmasterList = payload
        }
    },
    actions: {
        async setHeadmasterData({ commit }, { classId, dateType }) {
            try {
                let res = await getHeadmasterData({ classId, dateType })
                // 对接口数据过滤
                if (res.data.state === 'success') {
                    let db = res.data.data
                    // let sum = 0
                    // for (let item of db.contiInOut) {
                    //     sum += item.count
                    // }
                    db.contiInOut.totalCount = db.contiInOut.length
                    // sum = 0;

                    // for (let item of db.lateReturn) {
                    //     sum += item.count
                    // }
                    db.lateReturn.totalCount = db.lateReturn.length;
                    // sum = 0;

                    // for (let item of db.noOut) {
                    //     sum += item.count
                    // }
                    db.noOut.totalCount = db.noOut.length;
                    // sum = 0

                    // for (let item of db.noReturn) {
                    //     sum += item.count
                    // }
                    db.noReturn.totalCount = db.noReturn.length;

                    let totalArr = []
                    for (let key in db) {
                        if (key === 'contiInOut') {
                            db[key].title = '进出异常'
                            // 把数组挖空全部装在数组的newArr属性上 类似[[[a, b, c]], [[]], [[]]...]
                            let newArr = []
                            for (let i = db[key].length - 1; i >= 0; i -= 3) {
                                newArr.push([db[key].splice(0, 3)][0])
                            }
                            db[key].newArr = newArr
                        }
                        if (key === 'lateReturn') {
                            db[key].title = '晚归人员'
                            let newArr = []
                            for (let i = db[key].length - 1; i >= 0; i -= 3) {
                                newArr.push([db[key].splice(0, 3)][0])
                            }
                            db[key].newArr = newArr
                        }
                        if (key === 'noOut') {
                            db[key].title = '未出人员'
                            let newArr = []
                            for (let i = db[key].length - 1; i >= 0; i -= 3) {
                                newArr.push([db[key].splice(0, 3)][0])
                            }
                            db[key].newArr = newArr
                        }
                        if (key === 'noReturn') {
                            db[key].title = '未归人员'
                            let newArr = []
                            for (let i = db[key].length - 1; i >= 0; i -= 3) {
                                newArr.push([db[key].splice(0, 3)][0])
                            }
                            db[key].newArr = newArr
                        }
                        totalArr.push(db[key])
                    }
                    db.totalArr = totalArr
                    
                    commit('SET_HEADMASTERDATA', res.data.data)
                }
            } catch (e) {
                console.log(e);
            }

        }
    }

}
export default Headmaster