import request from '@/router/axios'
let lsApi = {
  //物流运费模板简单分页查询
  getFreightTemplateList (query) {
    return request({
      url: '/business/businessFreightTemplate/page',
      method: 'get',
      params: query
    })
  },
  //新增单条物流运费模板记录,同时新增关联的指定地区添加运费记录
  addFreightTemplate (obj) {
    return request({
      url: '/business/businessFreightTemplate/add',
      method: 'post',
      data: obj
    })
  },
  //修改记录条物流运费模板记录,同时修改关联的指定地区添加运费记录
  putObj (obj) {
    return request({
      url: '/business/businessFreightTemplate/update',
      method: 'post',
      data: obj
    })
  },
  //通过id查询单条物流运费模板记录,同时获取关联的指定地区添加运费记录
  getObj (id) {
    return request({
      url: '/business/businessFreightTemplate/' + id,
      method: 'get'
    })
  },
  //通过id删除一条物流运费模板记录,包括关联的指定地区添加运费记录
  delObj (id) {
    return request({
      url: '/business/businessFreightTemplate/' + id,
      method: 'delete'
    })
  },
  //通过id设置为默认模板
  updateEnable (id) {
    return request({
      url: '/business/businessFreightTemplate/defaultSet/' + id,
      method: 'get'
    })
  },
}

export default lsApi
