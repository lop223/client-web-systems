import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.scss'
import router from './providers/router'
import { pinia } from '@/stores/pinia'
import { registerServices } from './providers/services'
import { registerUi } from './providers/ui'


registerServices()

const app = createApp(App)

app.use(pinia)
registerUi(app)
app.use(router)
app.mount('#app')