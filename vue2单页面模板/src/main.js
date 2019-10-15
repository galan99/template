// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Toast from '@/components/toast'
import {Ajax} from '@/utils/api'

Vue.prototype.$toast = Toast
Vue.prototype.$ajax = Ajax

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  created () {
    let devieWidth = Math.min(document.documentElement.clientWidth, 750)
    let fonSize = devieWidth >= 420 ? 70 : devieWidth / 7.5
    document.documentElement.style.fontSize = `${fonSize}px`
  },
  router,
  components: { App },
  template: '<App/>'
})
