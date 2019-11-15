import request from '@/router/axios'
const headers = {
        'Authorization': ''
      }
let regApi = {
  //通过用户id获取供应商信息
  getUserById (id) {
    return request({
      url: '/business/businessUser/getBusinessUserByUserId/' + id,
      headers,
      method: 'get'
    })
  },
  //比对图片验证码
  ckeckImgCode (query) {
    return request({
      url: '/business/businessUser/ckeckImgCode',
      headers,
      method: 'get',
      params: query
    })
  },
  //根据传入的手机号发送短信
  sendSmsCode (query) {
    return request({
      url: '/business/businessUser/sendSmsCode',
      headers,
      method: 'get',
      params: query
    })
  },
  //提交提交商家店铺信息
  submitBusinessUserInfo (obj) {
    return request({
      url: '/business/businessUser/submitBusinessUserInfo',
      headers,
      method: 'post',
      data: obj
    })
  },
  //比对验证码
  verificationCode (query) {
    return request({
      url: '/business/businessUser/verificationCode',
      headers,
      method: 'get',
      params: query
    })
  },
  //info
  getAttribute(mobile){
    return request({
      url: '/business/businessUser/info/'+ mobile,
      headers,
      method: 'get'
    })
  },
  //获取所有店铺类型列表
  getBusinessShop(){
    return request({
      url: '/business/businessshopmodel/all',
      headers,
      method: 'get'
    })
  },
  //获取所有店铺品牌列表
  getBusinessBrand(query){
    return request({
      url: '/business/businessBrand/all',
      headers,
      method: 'get',
      params:query
    })
  },
  //申请品牌
  applyBrand(obj){
    return request({
      url: '/business/businessBrand/save',
      headers,
      method: 'post',
      data: obj
    })
  },
  //获取协议内容
  getProtocol(typeId,siteId){
    return request({
      url: '/business/protocol/detail/' + siteId + '/' + typeId,
      headers,
      method: 'get',
    })
  },
}
export default regApi
