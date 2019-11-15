import request from '@/router/axios'
let bpApi = {
  //添加商品
  addObj(obj){
    return request({
      url:'/business/businessproduct',
      method: 'post',
      data: obj
    })
  },
  //修改商品
  putObj (obj) {
    return request({
      url: '/business/businessproduct',
      method: 'put',
      data: obj
    })
  },
  //获取商品列表
  getBusinessListPage (query) {
    return request({
      url: '/business/businessproduct/page',
      method: 'get',
      params: query
    })
  },
  //获取商品数目
  getNum (query) {
    return request({
      url: '/business/businessproduct/getBusinessProductNumVO',
      method: 'get',
      params: query
    })
  },
  //获取商品详情
  getObj (productId) {
    return request({
      url: '/business/businessproduct/' + productId,
      method: 'get'
    })
  },
  //根据站点id获取一级品类
  selectFirstCateGory (query) {
    return request({
      url: '/business/businesscategory/selectFirstCateGory',
      method: 'get',
      params: query
    })
  },
  //根据上级品类id获取二级品类
  selectSecondCateGory (query) {
    return request({
      url: '/business/businesscategory/selectSecondCateGory',
      method: 'get',
      params: query
    })
  },
  //根据上级品类id获取三级品类
  selectThreeCateGory (query) {
    return request({
      url: '/business/businesscategory/selectThreeCateGory',
      method: 'get',
      params: query
    })
  },
  //根据品类id获取款式列表
  getproductstyle (query) {
    return request({
      url: '/business/businesscategory/getproductstyle',
      method: 'get',
      params: query
    })
  },
  //通过productId删除商品
  delObj (productId) {
    return request({
      url: '/business/businessproduct/' + productId,
      method: 'delete'
    })
  },
  //商品下架
  productForbidSale (obj) {
    return request({
      url: '/business/businessproduct/productForbidSale',
      method: 'post',
      data: obj
    })
  },
  //商品上架
  productSale (obj) {
    return request({
      url: '/business/businessproduct/productSale',
      method: 'post',
      data: obj
    })
  },
  //获取商品分类 展示最末级分类信息
  getlastcateGory (query) {
    return request({
      url: '/business/businesscategory/getlastcateGory',
      method: 'get',
      params: query
    })
  },
  //获取店铺分类
  getShopCategory (businessId) {
    return request({
      url: '/business/businessproduccategory/getBusinessProductCategoryFirstSecond/' + businessId,
      method: 'get',
    })
  },
  //根据站点ID返回所有品牌列表
  getbusinessBrand (query) {
    return request({
      url: '/business/businessBrand/all',
      method: 'get',
      params: query
    })
  },
  //返回所有运费模板，不分页
  getFreightTemplate (query) {
    return request({
      url: '/business/businessFreightTemplate/all',
      method: 'get',
      params: query
    })
  },
  //获取商品属性
  getAttribute (siteId) {
    return request({
      url: '/admin/productAttribute/listProducattributeBySiteId/' + siteId,
      method: 'get',
    })
  },
  //根据属性id获取类型
  getAttrObj (id) {
    return request({
      url: '/admin/productAttribute/' + id,
      method: 'get'
    })
  },
  //获得所有商品成色列表
  getFineness () {
    return request({
      url: '/admin/productFineness/all',
      method: 'get',
    })
  },
  //获取价格
  getFinenessPrice(query){
    return request({
      url: '/admin/productFineness/getFinenessPrice',
      method: 'get',
      params: query
    })
  }
}

export default bpApi
