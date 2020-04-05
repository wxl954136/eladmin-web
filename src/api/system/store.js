import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/sysStore',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sysStore',
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
    url: 'api/sysStore',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysStore',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts }
