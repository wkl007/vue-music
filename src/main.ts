import { createApp } from 'vue'
import App from '@/App.vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import '@/configs/registerServiceWorker'
import '@/assets/styles/index.less'

const app = createApp(App)

setupRouter(app) // vue-router
setupStore(app) // vuex

app.mount('#app')
