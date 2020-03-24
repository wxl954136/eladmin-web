import request from '@/utils/request'



export function add(data) {
  return request({
    url: 'api/bank',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/bank',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/bank',
    method: 'put',
    data
  })
}

export default { add, edit, del }
