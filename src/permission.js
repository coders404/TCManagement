import router from '@/router'
import store from '@/store'
//! 在router中引入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//! 导入动态路由口子 配合权限使用

const whitelist = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  //! 开启进度条
  NProgress.start()
  //! 有token
  if (store.getters.token) {
    //! 是否在登录页面
    if (to.path === '/login') {
      next('/')
    } else {
      //! 如果有token每次都会获取数据 没有ID则获取数据 有则不执行 
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        // async 函数所return的内容 用 await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // console.log(roles.menus)
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        // router.addRoutes([
        //   ...routes,
        //   { path: "*", redirect: "/404", hidden: true },
        // ]); // 动态添加是一个耗时操作，如果直接next() 会出现路由还没有配置 好的情况
        //! 重定向到404页面只能放在路由的最后边 如果在router里面放置
        //! 只是在静态路由里面进行传递 必须加上动态路由才行
        router.addRoutes([...routes], { path: '*', redirect: '/404', hidden: true })
        // 再次执行一次， next(地址)  再次进入导航守卫逻辑，next() 会直接进入组件界面
         next() //! 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
         next()
      }
    }
    //! 无token
  } else {
    //! 是否在白名单
    if (whitelist.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  //! 手动强制关闭一次
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})
