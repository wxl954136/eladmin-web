import request from '@/utils/request'
export function get() {
  return request({
    url: 'api/bizPoIn/test',
    method: 'get'
  })
}

