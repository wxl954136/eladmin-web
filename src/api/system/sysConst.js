import request from '@/utils/request'
import {add, del, edit, getSysTraders} from "./sysTrader";
export function getSysConst(params) {
  return request({
    url: 'api/sysConst',
    method: 'get',
    params
  })
}
export default {getSysConst}
