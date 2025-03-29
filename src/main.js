import './css/main.css'
import 'lenis/dist/lenis.css'
import router from './utils/router'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
