import request from '@/utils/request'
export function get(poId) {
  return request({
    url: 'api/bizPoIn/get/' + poId ,
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
export function update(data) {
  return request({
    url: 'api/bizPoIn',
    method: 'put',
    data
  })
}
export default { get, add,update }
