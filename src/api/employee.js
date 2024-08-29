import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {Object} params 查询参数
 * @returns {Promise} 返回请求结果的Promise对象
 */
/***
 * 获取员工列表
 * **/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

/**
 * 导出员工列表为Excel文件
 * @returns {Promise} 返回请求结果的Promise对象，响应类型为blob
 */
export function exportExcel() {
  return request({
    url: '/sys/user/export',
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 * 获取员工信息导入的Excel模板
 * @returns {Promise} 返回请求结果的Promise对象，响应类型为blob
 */
export function getExcelTemplate() {
  return request({
    url: '/sys/user/import/template',
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 * 上传员工信息的Excel文件
 * @param {Object} data Excel文件内容
 * @returns {Promise} 返回请求结果的Promise对象
 */
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'POST',
    data
  })
}

/**
 * 删除指定ID的员工
 * @param {String|Number} id 员工ID
 * @returns {Promise} 返回请求结果的Promise对象
 */
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE',
  })
}

/**
 * 新增员工
 * @param {Object} data 新员工的信息
 * @returns {Promise} 返回请求结果的Promise对象
 */
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 获取指定ID的员工详细信息
 * @param {String|Number} id 员工ID
 * @returns {Promise} 返回请求结果的Promise对象
 */
// 获取-员工-基本信息
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET',
  })
}

/**
 * 更新指定员工的信息
 * @param {Object} data 更新后的员工信息
 * @returns {Promise} 返回请求结果的Promise对象
 */
export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 获取可用的角色列表
 * @returns {Promise} 返回请求结果的Promise对象
 */
// 分配角色
export function getEnabledRoleList() {
  return request({
    url: '/sys/role/list/enabled',
    method: 'get',

  })
}

/**
 * 为指定员工分配角色
 * @param {Object} data 包含员工ID和角色ID的信息
 * @returns {Promise} 返回请求结果的Promise对象
 */
export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
