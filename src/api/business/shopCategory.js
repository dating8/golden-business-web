import request from '@/router/axios'
let cgyApi = {
  //新增一二级分类
  addBusinessProductCategory (obj) {
    return request({
      url: '/business/businessproduccategory/addBusinessProductCategory',
      method: 'post',
      data: obj
    })
  },
  //一级分类查询
  getBusinessProductCategoryFirst (businessId) {
    return request({
      url: '/business/businessproduccategory/getBusinessProductCategoryFirstSecond/' + businessId,
      method: 'get',
    })
  },
  //二级分类查询
  getBusinessProductCategorySecond (query) {
    return request({
      url: '/business/businessproduccategory/getBusinessProductCategorySecond',
      method: 'get',
      params: query
    })
  },
  //删除分类
  delObj (query) {
    return request({
      url: '/business/businessproduccategory/deleteBusinessProductCategory',
      method: 'delete',
      params: query
    })
  },
  //批量修改品类名称
  updateBusinessProductCategory (obj) {
    return request({
      url: '/business/businessproduccategory/updateBusinessProductCategory',
      method: 'post',
      data: obj
    })
  },
  //编辑排序
  updateBusinessProductCategorySeqNo (obj) {
    return request({
      url: '/business/businessproduccategory/updateBusinessProductCategorySeqNo',
      method: 'post',
      data: obj
    })
  }
}

export default cgyApi
