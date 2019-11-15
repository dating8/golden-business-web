import request from '@/router/axios'

export function fetchList (query) {
  return request({
    url: '/admin/sysnotifyreceive/page/',
    method: 'get',
    params: query
  })
}
