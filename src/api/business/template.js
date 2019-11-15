import request from '@/router/axios'
let tpApi = {
  //店铺模板简单分页查询
  getTemplateList (query) {
    return request({
      url: '/business/businessdecorationtemplate/getBusinessDecorationTemplateList',
      method: 'get',
      params: query
    })
  },
  //批量保存轮播图
  batchSaveBanner (obj) {
    return request({
      url: '/business/businessdecorationtemplate/batchSaveTemplateBanner',
      method: 'post',
      data: obj
    })
  },
  //修改商家店铺装修模版logo、背景图、店铺封面图
  putObj (obj) {
    return request({
      url: '/business/businessdecorationtemplate/updateimgUrl',
      method: 'post',
      data: obj
    })
  },
  //通过id修改商家店铺装修模版启用状态
  updateAvaliable (templateId) {
    return request({
      url: '/business/businessdecorationtemplate/updateAvaliable/' + templateId,
      method: 'get'
    })
  },
  //通过id获取店铺专修信息
  getObj (templateId) {
    return request({
      url: '/business/businessdecorationtemplate/' + templateId,
      method: 'get'
    })
  },
  //修改店铺信息
  updateShopInfo(obj){
    return request({
      url: '/business/businessdecorationtemplate/updateBusinessUserInfo',
      method: 'post',
      data: obj
    })
  },
  //获取关联分类
  getcateGory (businessId) {
    return request({
      url: '/business/businessproduccategory/findSecondProductCategoryList/' + businessId,
      method: 'get'
    })
  },
  //关联商品
  templateProductList(query){
    return request({
      url: '/business/businessproduct/searchBusinessProductVOPage',
      method: 'get',
      params: query
    })
  },
}

export default tpApi
