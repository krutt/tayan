/* ~~/src/main.js */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

let app = createApp(App)

// pinia
let pinia = createPinia()
app.use(pinia)

// plugins
import { plugin as shadcn } from '@/plugins/shadcn'
app.use(shadcn)

app.mount('#app')
