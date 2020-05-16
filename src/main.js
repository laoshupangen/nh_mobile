// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VCalendar from 'v-calendar'
import moment from 'moment'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCamera,faThLarge,faSchool,faPlusCircle, faChalkboard, faBookReader, faAward, faFile, faTable, faBookOpen, faBell, faNewspaper, faVolleyballBall, faCalendarAlt, faPencilAlt,
 faLeaf, faFileAlt, faUserAlt, faListAlt, faClock, faChartBar, faSmile, faMapMarkerAlt, faSpinner, faImage, faVideo, faKeyboard, faMicrophoneAlt, faUserGraduate, faGraduationCap, 
 faChalkboardTeacher, faMoneyCheckAlt ,faPlus} from '@fortawesome/free-solid-svg-icons'
import { faUser,faUserCircle, faComments, faBuilding } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { TransferDom, ToastPlugin, LoadingPlugin, DatetimePlugin, ConfirmPlugin } from 'vux'
import VueVideoPlayer from 'vue-video-player'
import LightTimeline from 'vue-light-timeline'


import { DatePicker } from 'element-ui'
import L from 'leaflet'
import 'leaflet.icon.glyph'

import 'leaflet/dist/leaflet.css'


import router from './router'
import App from './App'
import store from './store'
import { API_HOST } from '@/config'

import 'element-ui/lib/theme-chalk/index.css';

import 'mescroll.js/mescroll.min.css'
import '@/utils/flexible.js'
import '@/base.css'
import '@/permission.js'
import '@/errorLog.js'
import 'noty/lib/noty.css'
import 'noty/lib/themes/nest.css'
import 'video.js/dist/video-js.css'

import 'v-calendar/lib/v-calendar.min.css'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

Vue.directive('transfer-dom', TransferDom)

FastClick.attach(document.body)

Vue.config.productionTip = false




library.add(
  
  faPlus,
  faCamera,
  faThLarge,
  faSchool,
  faUser,
  faPlusCircle, 
  faChalkboard, 
  faBookReader,
  faAward,
  faFile,
  faTable,
  faBookOpen,
  faBell,
  faNewspaper,
  faVolleyballBall,
  faCalendarAlt,
  faPencilAlt,
  faLeaf,
  faFileAlt,
  faUserAlt,
  faUserCircle,
  faComments,
  faBuilding,
  faListAlt,
  faClock,
  faChartBar,
  faSmile,
  faMapMarkerAlt,
  faSpinner,
  faImage,
  faVideo,
  faKeyboard,
  faMicrophoneAlt,
  faUserGraduate,
  faGraduationCap,
  faChalkboardTeacher,
  faMoneyCheckAlt
)

Vue.use(VCalendar, {
  firstDayOfWeek: 2,  // Monday
})

moment.locale('zh-cn')

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
Vue.use(VueVideoPlayer, /* {
  options: global default options,
  events: global videojs events
} */)
Vue.use(DatePicker)
Vue.use(LightTimeline)

Vue.prototype.GLOBAL = {
  API_HOST
}


/* eslint-disable no-new */
export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
