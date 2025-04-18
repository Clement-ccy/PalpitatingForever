// import './css/main.css' // Comment out or remove old CSS
import './neumorphism-ui/neumorphism.css' // Import the new Neumorphism UI library
import 'lenis/dist/lenis.css'
import router from './utils/router'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
