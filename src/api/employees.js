import request from '@/utils/request'

//! 获取员工数据
export function getEmployeeSimple() {
  return request({
    url: '/sys/usersimple',
    method: 'get'
  })
}

//! 获取员工列表综合数据
export function getEployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

//! 删除员工信息
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

//! 新增员工接口
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

//! 保存个人基本信息  saveUserDetailByid
export function saveUserDetailById(data) {
  return request({  
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}



/** *
 *  读取用户详情的基础信息
 * **/
 export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

//! 给员工分配角色
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}