import request from '@/utils/request'



export function getSkus(params) {
  return request({
    url: 'api/sysSku',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/sysSku',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysSku',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysSku',
    method: 'put',
    data
  })
}


export function getBrands() {
  return request({
    url: 'api/sysSku/brands',
    method: 'get'
  })
}

export function getColors() {
  return request({
    url: 'api/sysSku/colors',
    method: 'get'
  })
}
export default { add, edit, del, getSkus,getBrands,getColors }
