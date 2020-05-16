import store from './store'
import { ws } from '@/config'
import { getAppkey } from '@/service'

export default async (needPassword, data) => {
  store.commit('UPDATE_SOCKETSTATUS', 'connecting')
  try {
    let socket
    let userId = data.userId
    let appKey = await getAppkey(data.userId)
    let keyInfo = JSON.parse(appKey.data.Body)
    console.log(keyInfo)
    //if (needPassword) {
    //  socket = new WebSocket(`${ws}?username=${data.userName}&password=${data.password}&appid=b500862c661e48acb9d68b59fbe6c795&appkey=776b5cf54458417b92fe0d22a5a54fa4`)
    //} else {
     // socket = new WebSocket(`${ws}?username=${data.userName}&appid=b500862c661e48acb9d68b59fbe6c795&appkey=776b5cf54458417b92fe0d22a5a54fa4`)
    //}

    //let wsObj = new RWS(`${ws}?username=${data.userName}&appid=b500862c661e48acb9d68b59fbe6c795&appkey=776b5cf54458417b92fe0d22a5a54fa4`, opt , [])
    
  } catch(err) {
    console.log(err)
  }
}

