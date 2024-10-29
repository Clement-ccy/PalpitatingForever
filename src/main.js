import './css/main.css'
import router from './util/router'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
