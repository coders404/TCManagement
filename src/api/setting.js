import request from '@/utils/request'

//! 读取所有角色列表信息
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

//! 读取公司信息
export function getCompanyInfo(companyid) {
  return request({
    url: `/company/${companyid}`,
    method: 'get'
  })
}

//! 删除角色信息
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

//! 修改角色信息
export function upDateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

//! 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `sys/role/${id}`,
    method: 'get'
  })
}

//! 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
} 
//! 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}