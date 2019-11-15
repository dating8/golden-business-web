import request from '@/router/axios'
let osApi = {
  //获取金价设置列表
  getOfflineShopList (query) {
    return request({
      url: '/business/businessofflineshop/page',
      method: 'get',
      params: query
    })
  },
  //新增线下体验店
  addOfflineShop (obj) {
    return request({
      url: '/business/businessofflineshop',
      method: 'post',
      data: obj
    })
  },
  //修改线下体验店
  putObj (obj) {
    return request({
      url: '/business/businessofflineshop',
      method: 'put',
      data: obj
    })
  },
  //通过线下体验店id获取体验店详情
  getObj (id) {
    return request({
      url: '/business/businessofflineshop/' + id,
      method: 'get'
    })
  },
  //通过线下体验店id删除线下体验店
  delObj (id) {
    return request({
      url: '/business/businessofflineshop/' + id,
      method: 'delete'
    })
  },
  //修改线下体验店启用状态
  updateEnable (id) {
    return request({
      url: '/business/businessofflineshop/updateBusinessPickupShopEnable/' + id,
      method: 'get'
    })
  },
}

export default osApi
