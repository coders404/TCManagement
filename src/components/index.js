import PageTools from './PageTools'
//! 定义全局组件 无需引入直接使用 {install(Vue)} Vue参数相当于Vue实例
//! 缺少excel上传文件 后续提交

//! 导入上传图片全局组件
import ImageUpload from './ImageUpload'
export default {
  install(Vue) {
    Vue.component('PageTools',PageTools)
    Vue.component('ImageUpload',ImageUpload)
  }
}