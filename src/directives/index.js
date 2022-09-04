//! 自定义指令 DOM加载之后执行directive钩子func
export const imagerror = {
  inserted(dom,options) {
    //! 图片加载error触发 func
    dom.onerror = () => {
      dom.src = options.value
    }
  }
}