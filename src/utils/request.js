import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui' 
import { getTimeStamp } from './auth'
//! 设置有效时间
const timer = 3600
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
}) // 创建一个axios的实例
//! 请求拦截器
service.interceptors.request.use(config => {
  //! 发起请求的时候 进行拦截 注入token
  if(store.getters.token) {
    //* 进行判定token时效 函数为true token失效 登出 重定向 进入reject()
    if(getTimeout()) {
      //* 登出操作
      store.dispatch('user/lgout')
      //* redirect到首页
      router.push('/')
      return Promise.reject(new Error('token失效了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  } 
  return config //! 必须返回
}, error => {
  return Promise.reject(error)
})
//! 响应拦截器
service.interceptors.response.use( response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message)) 
  }
}, error => {
  //* 被动介入token 返回 10002 做出相应处理 === 10002 token失效 response.data里面解构出来的就是code
  if(error && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/lgout')
    router.push('/login')
  }else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
function getTimeout() {
  //* 当前时间
  var newTimer = Date.now()
  //* 拿到存储的时间戳
  var getTime = getTimeStamp()
  //* 超时逻辑 当前时间减去缓存中时间 是否大于时间差 > /login <放行
  return ((newTimer - getTime) / 1000) > timer
}
export default service