import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // 相对路径：部署在 github.io/<仓库名>/ 子路径下也能正确加载资源
  base: './',
  plugins: [react(), tailwindcss()],
})
