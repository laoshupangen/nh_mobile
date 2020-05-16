import instance from './instance'
import axios from 'axios'
import { API_HOST, M_HOST } from '@/config'

export const getHistMsg = (chatWith) => {
  return instance.get('/WeChat/MsgBox/getHistMsg', {
    params: {
      chatWith
    }
  })
}

export const sendMsg = ({ toUser, content }) => {
  return instance.post('/WeChat/MsgBox/SendMsg', {
    toUser,
    content
  })
}

export const readMsg = (chatWith) => {
  return instance.get('/Wechat/MsgBox/ReadMessage', {
    params: {
      chatWith
    }
  })
}

export const getPhoneBook = () => {
  return instance.get('/Wechat/MsgBox/getMyNumList')
}

export const getTeacherPhoneBook = (userId) => {
  return instance.get('/Dorm/Leave/GetTeachers',{params:{userId}})
}

export const getMsgHistory = (url, id) => {
  return axios.post(`http://${url}/api/message/getHisList`, {
    sysid: id
  })
}

export const getChatSession = ({ url, fromId, to, groupid }) => {
  return axios.post(`http://${url}/api/getSessioinId`, {
    from: fromId,
    to,
    groupid
  })
}
