import request from '@/router/axios'
let gpApi = {
  //获取金价设置列表
  getGoldPriceList (id) {
    return request({
      url: '/business/businessgoldprice/getGoldPriceList/' + id,
      method: 'get'
    })
  },
  putObj (obj) {
    return request({
      url: '/business/businessgoldprice/updateGoldPrice',
      method: 'put',
      data: obj
    })
  }
}

export default gpApi
