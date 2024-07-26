/* ~~/vite.config.js */
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import path from 'path'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss'

export default defineConfig({
  base: '/tayan/',
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [svgLoader(), vue()],
  publicDir: path.resolve(__dirname, './static'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
