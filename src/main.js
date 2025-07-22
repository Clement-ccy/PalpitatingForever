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
import VueKonva from 'vue-konva'; // Import vue-konva
import App from './App.vue'
import { useBlogStore } from './stores/blog' // Import blog store
import { useAnalyticsStore } from './stores/analytics' // Import analytics store

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
app.use(VueKonva); // Use vue-konva
app.use(router);

// 预加载数据
async function initializeApp() {
  console.log('🚀 初始化应用数据...');
  
  try {
    // 初始化博客数据
    const blogStore = useBlogStore();
    await blogStore.loadBlogData();
    
    // 初始化分析系统
    const analyticsStore = useAnalyticsStore();
    await analyticsStore.initialize();
    
    console.log('✅ 应用数据初始化完成');
  } catch (error) {
    console.error('❌ 应用数据初始化失败:', error);
    // 即使数据加载失败，也要继续启动应用
  }
  
  // 挂载应用
  app.mount('#app');
}

// 启动应用
initializeApp();
