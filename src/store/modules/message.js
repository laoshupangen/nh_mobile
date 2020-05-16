
import { getMsgHistory, getSerialNumber, getAppkey, getProfileById } from '@/service'
import _ from 'lodash'
import socket from '@/message.js'
import router from '@/router'
import vue from '@/main.js'
import noty from '@/utils/noty.js'
import nSound from '@/assets/noti.wav'
import RWS from '@/websocket.js'

function scrollToBottom() {
  let chatArea = document.getElementById('chat-scroll-area')
  setTimeout(() => {
    chatArea.scrollTop = chatArea.scrollHeight
  }, 200)
}


function getUrlParam(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

function showNoti(msg, data, status) {
  let hash = location.hash
  let sessionId = getUrlParam('sessionId')
  if (hash.indexOf('/message') !== -1) {
    return
  }
  if (hash.indexOf('/sendMessage') !== -1 && msg.sessionId === sessionId) {
    return
  }
  if (!status) {
    return
  }
  if (data.from.id !== data.otherInfo.id) {

  }
  let otherInfo = data.otherInfo
  let msgBody
  switch (msg.msgType) {
    case 0:
      msgBody = `${otherInfo.nickname || otherInfo.id}:${msg.content}`
      break
    case 1:
      msgBody = `${otherInfo.nickname || otherInfo.id}给你发了一张[图片]`
      break
    case 2:
      msgBody = `${otherInfo.nickname || otherInfo.id}给你发了一段[视频]`
      break
    case 4:
      msgBody = `${otherInfo.nickname || otherInfo.id}给你发了一段[语音]`
      break
    case 8:
      msgBody = `${otherInfo.nickname || otherInfo.id}给你发了[位置]`
      break
  }
  noty('info', msgBody, {
    killer: true,
    sounds: {
      sources: [nSound],
      volume: .2,
      conditions: ['docVisible', 'docHidden']
    }
  })
}

const message = {
  state: {
    connect: false,
    notiSound: true,
    conversationList: {
      friends: [],
      groups: []
    },
	  unreadCount: null,
    state: {
      status: 'pending',
      message: ''
    },
    socket: null,
    userInfo: {},
    url: null,
    appKey: null,
    appId: null,
    serialApi: ''
  },
  mutations: {
    INIT_SOCKET: (state, instance) => {
      state.socket = instance
    },
    COMMAND_LOGIN_RESP: (state, instance) => {
      state.socket = instance
    },
    RESET_UNREAD: (state, { sessionId, otherId, type }) => {
      if (type === 2) {
        if (sessionId) {
          _.forEach(state.conversationList.friends, ele => {
            if (ele.sessionId === sessionId) {
              ele.unRead = 0
            }
          })
        }
      }
    },
    TOGGLE_NOTI_SOUND: (state) => {
      state.notiSound = !state.notiSound
    },
    UPDATE_LIST: (state, data) => {
      let hash = location.hash
      let sessionId = getUrlParam('sessionId')
      let type = data.type
      let msgContent = data.data.data
      let createTime = new Date().getTime()
      if (type === 'add') {
        if (msgContent.chatType === 2) {
          state.conversationList.friends.unshift({
            unRead: 0,
            getHistory: false,
            msgList: [],
            createTime,
            ...msgContent
          })
        }
      } else if (type === 'normal') {
        if (msgContent.chatType === 2) { //私聊
          let fromId = msgContent.from
          let toId = msgContent.to
          let haveThisEle = _.filter(state.conversationList.friends, ele => {
            if (ele.sessionId) {
              return ele.sessionId === msgContent.sessionId
            }
          })

          if (haveThisEle.length === 0) {
            msgContent.unRead = 1
            msgContent.getHistory = false
            msgContent.otherInfo = { id: msgContent.from }
            msgContent.from = { id: fromId }
            msgContent.createTime = createTime
            msgContent.to = { id: toId }
            msgContent.isChildren = 'unknown'
            msgContent.msgList = []
            msgContent.msgList.push(msgContent)
            getProfileById(fromId).then(res => {
              if (res.data.F_RoleId === 'student') {
                msgContent.isChildren = true
              } else {
                msgContent.isChildren = false
              }
              state.socket.send("{\"cmd\":17,\"type\":\"2\",\"userId\":\""+ (msgContent.from.id) +"\"}")
              state.conversationList.friends.push(msgContent)
            })
            return
          }
          _.forEach(state.conversationList.friends, ele => {
            if (ele.sessionId) {
              if (ele.sessionId === msgContent.sessionId) {
                ele.msgList.push(msgContent)
                if (msgContent.from === ele.otherInfo.id) {
                  showNoti(msgContent, ele, state.notiSound)
                  if ((hash.indexOf('/sendMessage') !== -1 && sessionId !== msgContent.sessionId) || hash.indexOf('/sendMessage') === -1) {
                    ele.unRead = ele.unRead + 1
                  }
                }
              }
            }
          })
        }
      } else if (type === 'offline') {
        delete msgContent.userid
        let result = []
        result = _.reduce(msgContent, (result, value, key) => {
          let size = _.size(value)
          if (!size) {
            return result
          }
          let chatArray = _.flatMapDeep(value)
          result = _.concat(result, chatArray)
          return result
        }, [])
        if (result.length) {
          _.forEach(result, ele => {
            if (ele.chatType === 2) {
              _.forEach(state.conversationList.friends, n => {
                if (n.sessionId === ele.sessionId) {
                  n.msgList.push(ele)
                  n.unRead = n.unRead + 1
                }
              })
            }
          })
        }
      } else if (type === 'userInfo') {
        _.forEach(state.conversationList.friends, ele => {
          if (ele.otherInfo.id === msgContent.id) {
            ele.otherInfo.headicon = msgContent.avatar
            ele.otherInfo.nickname = msgContent.nick
          }
        })
      } else if (type === 'history') {
        delete msgContent.userid
        let result = []
        result = _.reduce(msgContent, (result, value, key) => {
          let size = _.size(value)
          if (!size) {
            return result
          }
          let chatArray = _.flatMapDeep(value)
          result = _.concat(result, chatArray)
          return result
        }, [])
        result = _.groupBy(result, ele => ele.sessionId)
        if (_.size(result)) {
          _.forEach(result, (n, i) => {
            _.forEach(state.conversationList.friends, ele => {
              if (i === ele.sessionId) {
                let newMsgList =  _.chain(n).concat(ele.msgList).sortBy('createTime').value()
                ele.msgList = newMsgList
                ele.getHistory = true
                scrollToBottom()
              }
            })
          })
        }
      }
    },
    UPDATE_SOCKETSTATUS: (state, status) => {
      state.state.status = status
    },
    UPDATE_USERINFO: (state, { sessionId, type, data }) => {

    },
    UPDATE_HISTORY: (state, { sessionId, data }) => {

    },
    INIT_LIST: (state, {data, id}) => {
      if (!data) {
        return
      }
      let result = _.reduce(data, (result, value, key) => {
        if (value.chatType === 2) {
          let otherInfo = value.from.id === id ? value.to : value.from
          let chatObj = {
            otherInfo: otherInfo,
            unRead: 0,
            getHistory: false,
            isChildren: otherInfo.type === undefined ? false : (otherInfo.type === 'student' ? true : false),
            msgList: [{
              chatType: value.chatType,
              cmd: value.cmd,
              content: value.content,
              createTime: value.createTime,
              from: value.from.id,
              to: value.to.id,
              msgType: value.msgType,
              sessionId: value.sessionId || '',
              id: value.id || '',
              extras: value.extras || {}
            }],
            ...value,
          }
          result.friends.push(chatObj)
          if (!chatObj.otherInfo.nickname) {
            console.log(state)
          }
        }
        return result
      }, { friends: [], groups: [] })
      state.conversationList = result
      state.state.success = true
    }
  },
  actions: {
    async INIT_CHATLIST({ commit, dispatch, state, rootState }) {
      commit('UPDATE_SOCKETSTATUS', 'connecting')
      try {
        let userInfo = rootState.user.copy
        if (!state.url && !state.appKey && !state.appId) await dispatch('GET_CHAT_CONFIG')
        let msgList = await getMsgHistory(state.url, userInfo.UserId)
        let msgBody = msgList.data;

        dispatch( 'OPEN_SOCKET' );

        if (msgBody.code === 10018) {
          let messageList = JSON.parse(msgBody.data)
          commit('INIT_LIST', { data: messageList, id: userInfo.UserId })
          /*
            dispatch( 'OPEN_SOCKET' )
          */
        }
      } catch(err) {
        console.log(err)
        commit('UPDATE_SOCKETSTATUS', 'error')
      }
    },
    async GET_CHAT_CONFIG({ commit, state, rootState }) {
      try {
        let url = await getAppkey(rootState.user.copy.SchoolCode)
        let data = url.data.data
        state.url = data['f_ImUrl']
        state.appKey = data['f_Im_Appkey']
        state.appId = data['f_ImAppID']
        state.serialApi = data['f_BackgroundAddress']
      } catch(err) {
        let e = new Error()
        e.message = '获取KEY失败'
        throw new Error(e)
      }
    },
    async UPDATE_DEVICEINFO({ commit, state, rootState }, { sessionId, userId }) {
      try {
        let deviceInfo = await getSerialNumber(state.serialApi, userId, rootState.user.copy.SchoolCode)
        _.forEach(state.conversationList.friends,  ele => {
          if (ele.sessionId === sessionId) {
            ele.deviceInfo = deviceInfo.data
          }
        })
        return deviceInfo.data
      } catch(err) {
        throw new Error(err)
      }
    },
    DISCONNECT_SOCKET({ commit, state }) {
      state.socket.close()
    },
    GET_HISTORY({commit, state, rootSate, dispatch}, { friendId,  userId }) {
      console.log( "actions", "{\"cmd\":19,\"type\":\"1\",\"fromUserId\":\""+ friendId +"\",\"userId\":\""+ userId +"\"}")
      state.socket.send("{\"cmd\":19,\"type\":\"1\",\"fromUserId\":\""+ friendId +"\",\"userId\":\""+ userId +"\"}")
    },
    OPEN_SOCKET({ commit, state, rootState }) {
      let wsObj = new RWS(`ws://${state.url}?username=${rootState.user.copy.UserCode}&appid=${state.appId}&appkey=${state.appKey}`, {
        maxReconnectInterval: 300000,
        timeoutInterval: 4000,
        debug: true
      }, [])
      wsObj.onopen = () => {
        commit('INIT_SOCKET', wsObj)
      }
      wsObj.onmessage = (e) => {
        let data = e.data
        let dataObj = eval("("+data+")")
        if (dataObj.command === 11) {
          commit('UPDATE_LIST', { data: dataObj, type: 'normal' })
        } else if (dataObj.command === 6) {
          if (dataObj.code === 10008) {
            wsObj.close()
            commit('UPDATE_SOCKETSTATUS', 'loginError')
          } else if (dataObj.code === 10007) {
            commit('UPDATE_SOCKETSTATUS', 'connected')
            wsObj.send("{\"cmd\":19,\"type\":\"0\",\"userId\":\""+ (rootState.user.id) +"\"}")
          }

        } else if(dataObj.command === 20 && dataObj.code === 10016) { //获取离线消息
          commit('UPDATE_LIST', { data: dataObj, type: 'offline' })
        } else if(dataObj.command == 20 && dataObj.code == 10018) {
          commit('UPDATE_LIST', { data: dataObj, type: 'history' })
        }  else if(dataObj.command === 18) {
          commit('UPDATE_LIST', { data: dataObj, type: 'userInfo' })
        }
      }
      wsObj.onclose = (e) => {

      }
      wsObj.onconnecting = (e) => {
        commit('UPDATE_SOCKETSTATUS', 'connecting')
      }
      wsObj.onerror = (e) => {
        commit('UPDATE_SOCKETSTATUS', 'error')
      }
    },
    async SEND_MESSAGE({ commit, state, rootState, dispatch }, { mode, type, content, from, to, extras = {}, ...other }) {
      try {
        let createTime = new Date().getTime()
        let msg = "{\"from\": \""+ from +"\",\"to\": \""+ to +"\",\"cmd\":11,\"chatType\": 2,\"msgType\": "+ type +",\"content\": \""+ content +"\",\"extras\": "+ JSON.stringify(extras) +"}"
        let chatObj = {
          ...JSON.parse(msg),
          ...other
        }
        if (state.state.status !== 'connected') {
          return
        }
        if (mode === 'local' || mode === 'both') {
          chatObj.createTime = createTime
          commit('UPDATE_LIST', { type: 'normal', data: { data: chatObj } })
        }
        if (mode === 'remote' || mode === 'both') {
          let chatSession = _.find(state.conversationList.friends, ele => ele.sessionId === other.sessionId)
          let parseMsg = JSON.parse(msg)
          if (chatSession.isChildren && chatSession.deviceInfo === undefined) {
            await dispatch('UPDATE_DEVICEINFO', { sessionId: other.sessionId, userId: to })
            if (chatSession.deviceInfo) {
              parseMsg.extras = {
                ...extras,
                to: chatSession.deviceInfo,
                content: chatSession.otherInfo.nickname,
                userId: chatSession.otherInfo.id,
                cmd: 11
              }
            }
          } else if (chatSession.isChildren && chatSession.deviceInfo) {
            parseMsg.extras = {
              ...extras,
              to: chatSession.deviceInfo,
              content: chatSession.otherInfo.nickname,
              userId: chatSession.otherInfo.id,
              cmd: 11
            }
          }
          msg = JSON.stringify(parseMsg)
          state.socket.send(msg)
        }
      } catch (err) {
        console.log(err)
      }
    },

  }
}

export default message
