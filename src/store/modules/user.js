import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
//! 你使用人家路由的方法 你不导入 你想干什么？？？？？？？？
import { resetRouter } from '@/router'
//! 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {}//! obj 而非null getters访问 null.name -> error
}
//! 修改状态
const mutations = {
  //! 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123=>1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和缓存数据的同步
  },
  //! 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  setUserInfo(state, userinfo) {
    state.userInfo = { ...userinfo }
  },
  //! 删除用户信息 userInfo
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  //! 此处调用的 API.user
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    //! 设置当前的时间戳
    setTimeStamp()
  },
  //! 用户基本信息 参数统一传入
  async getUserInfo(context) {
    const result = await getUserInfo()
    //! 接口user部分不要传递错误 一p定是await强制等待到数据之后
    const baseInfo = await getUserDetailById(result.userId)
    //! 获取员工信息 里面有一张photo 合并显示
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result //! 后面的伏笔 staffPhoto权限伏笔
  },
  //* 设置退出登录
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    //! 重置路由信息
    resetRouter()
    //! 登出的时候调用根节点下面的setRoutes 但是解锁了
    //! 可以使用 {root: true}直接访问根节点 但是根节点并没有setRoutes
    //! 所以我们还要添加一条 因为开启了命名空间 'permmission/setRourtes'
    context.commit('permission/setRoutes', [], { root:true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
