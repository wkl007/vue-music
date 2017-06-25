import 'babel-polyfill'     // 对es6 api转译
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

// 解决移动端点击300mm延迟的问题
fastclick.attach(document.body)

// vue-lazyload图片懒加载
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
