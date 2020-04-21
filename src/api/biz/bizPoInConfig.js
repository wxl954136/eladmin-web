import request from '@/utils/request'
export function get(poId) {
  return request({
    url: 'api/bizPoIn/get/' + poId ,
    method: 'get'
  })
}

