import request from '@/router/axios'
//上传图片
export function uploadImg (obj) {
  return request({
    url: '/admin/file/uploadFile',
    method: 'post',
    headers:{'Authorization': ''},
    data: obj
  })
}
