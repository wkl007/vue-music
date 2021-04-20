import { createApp } from 'vue'
import App from '@/App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupLazy } from '@/configs/lazy'
import '@/configs/registerServiceWorker'
import '@/assets/styles/index.less'

const app = createApp(App)

setupRouter(app) // vue-router
setupStore(app) // vuex
setupLazy(app) // vue3-lazy

app.mount('#app')
