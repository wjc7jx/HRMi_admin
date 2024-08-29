import request from '@/utils/request'
export const getPermissionList = () => request({
  url: '/sys/permission',
  method: 'get',
  })
  export const addPermission = (data) => request({
    url: `/sys/permission`,
    method: 'post',
    data
  })
