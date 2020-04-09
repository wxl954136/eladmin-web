import request from '@/utils/request'

export function getSkuClassifys(params) {
  return request({
    url: 'api/sysSkuClassify',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sysSkuClassify',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    /*
    url: 'api/dept',
    method: 'delete',
    */
    url: 'api/sysSkuClassify',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysSkuClassify',
    method: 'put',
    data
  })
}

export default { add, edit, del, getSkuClassifys }
