import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import vue from '@vitejs/plugin-vue'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/notion-api': {
        target: 'https://api.notion.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/notion-api/, ''),
        headers: {
          'Authorization': `Bearer ${process.env.VITE_NOTION_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    }
  }
})
