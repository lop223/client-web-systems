import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.scss'
import router from './providers/router'
import { pinia } from '@/stores/pinia'
import { registerServices } from './providers/services'

registerServices()

createApp(App).use(router).use(pinia).mount('#app')
