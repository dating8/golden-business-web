import request from '@/router/axios'
let lcApi = {
  //获得所有物流公司分页列表
  getLogisticsCompanyList (query) {
    return request({
      url: '/business/businesslogisticscompany/page',
      method: 'get',
      params: query
    })
  },
  //修改物流公司启用状态
  modifyEnable (id) {
    return request({
      url: '/business/businesslogisticscompany/modifyEnable/' + id,
      method: 'get'
    })
  }
}

export default lcApi
