import axios from 'axios'
import qs from 'qs'
import { noty } from '@/utils'
import { API_HOST } from '@/config'
import router from '@/router'
import store from '@/store'


const instance = axios.create({
  baseURL: `${ API_HOST }`,
  timeout: 80000,
  withCredentials: true,
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

instance.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify({
      ...config.data
    })
  }
  return config
}, function(error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  if (response.status >= 200 && response.status < 300) {
    if (typeof(response.data) === 'string') {
      if(response.data.indexOf('#301#') !== -1 || response.data.indexOf('#302#') !== -1 || response.data.indexOf('<script>') !== -1) {
        store.dispatch('Logout')
        return Promise.reject({
          message: '超时或是没有权限',
          code: 'NETWORK_ERROR'
        })
      }else{
        return response.data
      }
    } else {
      if (response.config.method === 'post') {
        if (response.data.state === 'success') {
          return response
        } else {
          // noty('error', response.data.message)
          //message.error(response.data.message)
          return Promise.reject({
            message: response.data.message,
            code: 'NETWORK_ERROR'
          })
        }
      } else {
        if (response.data.hasOwnProperty('state')) {
          // console.log(response)
         
          if (response.data.state === 'error') {
            // noty('warning', response.data.message)
            return Promise.reject({
              message: response.data,
              code: 'NETWORK_ERROR'
            })
          } else {
            return { data: response.data }
          }
        } else {
          // console.log('string',response)
          return response
        }
      }
    }
  } else {
    if (response.status === 302) {
      noty('warning', '无权限')
    } else if (response.status === 301) {
      noty('warning', '请求超时')
    } else {
      noty('warning', '服务器开了个小差')
      console.warn(`${response.config.url}出错,错误代码${response.statusText}`)
    }
    return Promise.reject({
      message: response.statusText,
      code: 'NETWORK_ERROR'
    })
  }
}, error => {
  console.error(error)
  // noty('error', error.message)
  //message.error(error.message)
  return Promise.reject({
    message: error,
    code: 'NETWORK_ERROR'
  })
})

export default instance
