const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用
  name: state => state.user.userInfo.username,
  nameId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, //! 设置管理员头像显示
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes,
  userInfo: state =>  state.user.userInfo
}
export default getters
