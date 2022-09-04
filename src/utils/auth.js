import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeKey = 'hrsaas-ihrm-time'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 存储时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey,Date.now())
}


//! 树形结构处理递归算法
export function tranListToTreeData(list, rootValue) {
  var arr = []
  list.forEach(item => {
    if (item.pid === rootValue) {
      // 找到之后 就要去找 item 下面有没有子节点
      const children = tranListToTreeData(list, item.id)
      if (children.length) {
        // 如果children的长度大于0 说明找到了子节点
        item.children = children
      }
      arr.push(item) // 将内容加入到数组中
    }
  })
  return arr
}