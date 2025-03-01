import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
import { constantRoutes } from '@/router'
const state = {
  token: getToken(), // 从缓存中读取初始值
  userInfo: {},
  routes: constantRoutes
}

const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  removeToken() {
    // 删除Vuex的token
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  // context上下文，传入参数
  async login(context, data) {
    console.log(data)
    // todo: 调用登录接口
    const token = await login(data)
    // 返回一个token 123456
    context.commit('setToken', token)
  },
  // 获取用户信息
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result // 返回用户信息
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
  }
}
export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
