import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control

Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

Vue.prototype.AMOUNTDIGIT = 2   //全局小数位数

/*
//注册勾子
//调用方法只需在el-form中添加  v-enterToNext="true"
Vue.directive('enterToNext',{
  inserted:function(el){
    console.log("enterToNext...")
    //let frm = el.querySelector('.el-form');
    let inputs = el.querySelectorAll('input');
    console.log(inputs);
    //绑定回写事件
    for( var i = 0 ;i < inputs.length ; i++ ){
      inputs[i].setAttribute("keyFocusIndex",i);
      inputs[i].addEventListener('keyup', (ev) => {
        if (ev.keyCode === 13) {
          let targetTo = ev.srcElement.getAttribute('keyFocusTo');
          if(targetTo){
            this.$refs[targetTo].$el.focus();
          }else{
            var attrIndex = ev.srcElement.getAttribute('keyFocusIndex');
            var ctlI = parseInt(attrIndex);
            if(ctlI<inputs.length-1)
              inputs[ctlI+1].focus();
          }
        }
      });
    }
  },
});
*/

new Vue({
  el: '#app',

  router,
  store,
  render: h => h(App)
})

