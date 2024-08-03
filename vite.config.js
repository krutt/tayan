/* ~~/vite.config.js */
import autoImport from 'unplugin-auto-import/vite'
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
  plugins: [
    autoImport({
      dirs: ['./src/composables', './src/stores'],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        {
          '@vueuse/core': ['useColorMode'],
        },
        'pinia',
        'vue',
      ],
    }),
    svgLoader(),
    vue(),
  ],
  publicDir: path.resolve(__dirname, './static'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
