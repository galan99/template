import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/index',
      component: resolve => require(['../pages/index.vue'], resolve)
    },
    {
      path: '/list',
      component: resolve => require(['../pages/list.vue'], resolve)
    },
    {
      path: '/',
      redirect: '/index'
    }
  ]
})

export default router
