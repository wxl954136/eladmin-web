import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/features/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/features/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/home'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/user/center'),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
//手动注册,不然要在菜单中去发现，这样会多余两个菜单，非常麻烦,以为做为范例
  {
    path: '/po/poin/config',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'add/:poId',
        component: () => import('@/views/biz/poin/config'),
        name: '采购入库【新增】',
        key:'$route.fullPath',//互相切换时，刷新组件 ，因为两个共用一个component
        meta: { title: '采购入库【新增】', icon: 'edit' }
      },
      {
        path: 'edit/:poId',
        name: '采购入库【修改】',
        component: () => import('@/views/biz/poin/config'),
        meta: { title: '采购入库【修改】', icon: 'edit' }
      }
    ]
  }


]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
