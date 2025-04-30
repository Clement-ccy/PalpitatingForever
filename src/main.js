// import './css/main.css' // Comment out or remove old CSS
import './pf-ui/pf-ui.scss' // Import our main styles
import 'lenis/dist/lenis.css'

// Import highlight.js core library and common languages
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml'; // For HTML
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import python from 'highlight.js/lib/languages/python';
// Import a theme
import 'highlight.js/styles/atom-one-dark.css'; // Choose your preferred theme

// Import Mermaid
import mermaid from 'mermaid';

import router from './router' // Correct the router import path
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia
import App from './App.vue'

// Register the languages you need
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml); // For HTML
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('python', python);

const pinia = createPinia(); // Create Pinia instance
const app = createApp(App);

// Optionally provide hljs globally if needed elsewhere, or use it via imports
// app.config.globalProperties.$hljs = hljs;

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false, // We'll trigger rendering manually
  theme: 'default', // Base theme, can be 'dark', 'neutral', 'forest'
  // Potentially sync with Vue theme later
  // securityLevel: 'loose', // If using complex diagrams or external sources
});

app.use(pinia); // Use Pinia
app.use(router);
app.mount('#app');
