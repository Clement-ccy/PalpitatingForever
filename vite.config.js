import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/PalpitatingForever/',
  plugins: [
    vue(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json'],
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
      },
    }
  }
})
