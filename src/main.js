import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
//! 导入所有自定义指令
import * as directives from '@/directives'
//! 导入全局注册组件
import Components from '@/components'
//! 导入工具类
import * as filters from '@/filters'
//! 注册全局过滤器
Object.keys(filters).forEach( key => {
  //! 注册过滤器
  Vue.filter(key,filters[key])
})

//! 注册全局混入对象 mixin
import checkPermission from '@/mixin/checkPermission'
Vue.mixin(checkPermission)

//! 这里在开发环境的时候已经删除了本地mock文件 影响打包编译
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
//! 全局注册自定义指令 Object.key()转换成数组
//! 转换为数组之后 forEach循环数组 然后遍历所有key key其实就是 imagerror inserted 
Object.keys(directives).forEach(key => {
  Vue.directive(key,directives[key])
})

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

//! 注册components里面定义的全局组件
Vue.use(Components)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
