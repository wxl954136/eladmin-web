import request from '@/utils/request'
export function get() {
  return request({
    url: 'api/bizPoIn/test' ,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: 'api/bizPoIn',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/bizPoIn/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/bizPoIn',
    method: 'put',
    data
  })
}

export default { add, edit, del }
