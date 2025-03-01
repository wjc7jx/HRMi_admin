import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 基础地址
  timeout: 15000
}) // 创建一个新的axios实例
// 成功1 失败2
service.interceptors.request.use((config) => {
  // 注入token
//  this.$store.getters
  // store.getters.token => 请求头里面
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data instanceof Blob) return response.data // 如果为blob类型直接返回
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message({ type: 'error', message })
      return Promise.reject(new Error(message))
    }
  },
  async(error) => {
    if (error.response.status === 401) {
      Message({ type: 'error', message: '无效的token' })
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('无效的token'))
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)
export default service
