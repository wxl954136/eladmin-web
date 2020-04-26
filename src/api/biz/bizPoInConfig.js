import request from '@/utils/request'
import {add, del} from "./bizPoIn";
export function get(poId) {
  return request({
    url: 'api/bizPoIn/get/' + poId ,
    method: 'get'
  })
}
export function update(data) {
  return request({
    url: 'api/bizPoIn',
    method: 'put',
    data
  })
}
export default { get, update }
