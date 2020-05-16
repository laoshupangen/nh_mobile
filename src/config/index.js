export { default as calendar } from './calendar'
export { default as menu } from './menu'
export { default as emoji } from './emoji'


const isProduction = process.env.NODE_ENV === 'development' ? false : true

export const M_HOST = isProduction ? 'http://61.164.123.34:5566/im' : 'http://10.1.79.36:8100'
export const ws = isProduction ? 'ws://192.168.0.114:8102/' : 'ws://192.168.0.114:8102/'

export const API_HOST = isProduction ? '' : 'http://115.223.19.233:9005/'

export const API_HOST_1 = isProduction ? 'http://192.168.1.125:8082': 'http://192.168.1.125:8082'

export const API_HOST_2 = isProduction ? 'http://115.223.19.233:9006/api' : 'http://115.223.19.233:9006/api'



/*
http://192.168.1.125:8080
http://dh-web.device.nchu.edu.cn:8300
*/
