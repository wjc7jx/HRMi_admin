import request from '@/utils/request'

/**
 *
 * 获取组织架构数据
 *
*/
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}
export function getManagerName(){
  return request({
    url: '/sys/user/simple',
  })
}
export function addDepartment(data){
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
export function getDepartmentDetail(id){
  return request({
    url: `/company/department/${id}`
  })
}
export function updateDepartment(data){
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data:data
  })
}
export function delDepartment(id){
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
