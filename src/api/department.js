import request from '@/utils/request'

export function department() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

//! 删除组织部门数据 必穿ID
export function deleteDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

//! 添加部门 传递post参数
export function addDeparment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

//! 获取部门信息 必传字段id 根据id获取值
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

//! 区分场景 区分保存场景 根据 data.id修改数据 增删改查对应不同的请求方式
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data}`,
    method: 'put',
    data
  })
}