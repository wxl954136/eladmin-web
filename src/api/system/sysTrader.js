import request from '@/utils/request'
export function getSysTraders(params) {
  return request({
    url: 'api/sysTrader',
    method: 'get',
    params
  })
}
export function add(data) {
  return request({
    url: 'api/sysTrader',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysTrader/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysTrader',
    method: 'put',
    data
  })
}

export default { add, edit, del ,getSysTraders}
