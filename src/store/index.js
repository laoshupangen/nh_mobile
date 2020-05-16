import Vue from 'vue'
import Vuex from 'vuex'

import { errorLog, permission, user, app, prepare, detail, message,leaveV2 ,dormitorySafety, carData, headmaster} from './modules'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    permission,
    errorLog,
    user,
    app,
    prepare,
    detail,
	  message,
    leaveV2,
    dormitorySafety, carData, headmaster
  },
  getters
})
