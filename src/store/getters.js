
import _ from 'lodash'

const getters = {
  barData:state=>state.carData.barData,
  carDataList: state => state.carData.carDataList,
  SafeDataList: state => state.dormitorySafety.SafeDataList,
  HeadmasterList: state => state.headmaster.HeadmasterList,
  currentClass: state => state.user.currentClass,
  bindClass: state => state.user.bindClass,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userInfo: state => state.user.copy,
  isLogin: state => state.user.isLogin,
  loginLoading: state => state.user.loginLoading,
  children: state => state.user.children,
  currentOb: state => state.user.currentOb,
  browserHeaderTitle: state => state.user.browserHeaderTitle,
  permission_routers: state => state.permission.routers,
  addRouters: state => _.filter(state.permission.addRouters, item => !item.subSystem),
  homeMenu: state => _.chain(state.permission.addRouters).filter(item => item.meta.home).groupBy(item => item.meta.category).value(),
  errorLogs: state => state.errorLog.logs,
  iconClass: state => state.app.topIconClass || 'navicon',
  iconShow: state => state.app.topIconShow,
  iconFunction: state => state.app.topIconFunction,
  appLoading: state => state.app.appLoading,
  prepareInfo: state => state.prepare,
  detail: state => state.detail,
  dictionary: state => state.user.dictionary,
  chatList: state => state.message.conversationList,
  socket: state => state.message.socket,
  socketStatus: state => state.message.state,
  messageSound: state => state.message.notiSound,
  messageUrl: state => state.message.url,
  leaveV2: state => state.leaveV2,
  newAvatar:state => state.user.newAvatar,
  teacherRole:state => state.user.teacherRole,
  footerSHow:state=>state.app.footerSHow,
  photoStatus:state=>state.user.photoStatus
}

export default getters
