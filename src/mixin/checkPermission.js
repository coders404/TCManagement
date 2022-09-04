import store from '@/store'

export default {
  checkPermission (key) { //! 这个key就是按钮操作权的唯一标识 进行对比
    //! 直接结构出来userInfo里面的store
    const { userInfo } = store.state.user
    //! 进行 或 判断 有可能没有值 有值进行判断 无则返回false
    if (userInfo.roles && userInfo.roles.points) {
      userInfo.roles.points.some(item => {
        return item.name === key
      })
    } else {
      return false
    }
  }
}