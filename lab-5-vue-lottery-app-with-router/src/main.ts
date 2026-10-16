import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.scss'
import router from './router'
import { pinia } from '@/stores/pinia'

createApp(App).use(router).use(pinia).mount('#app')
