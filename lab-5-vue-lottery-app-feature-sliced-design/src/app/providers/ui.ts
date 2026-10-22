import type { App } from 'vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import Button from 'primevue/button'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

const AppTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  },
})

export function registerUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: AppTheme,
      options: {
        darkModeSelector: '.app-dark',
      },
    },
  })

  app.component('Button', Button)
  app.component('Column', Column)
  app.component('ConfirmDialog', ConfirmDialog)
  app.component('DataTable', DataTable)
  app.component('Toast', Toast)

  app.use(ToastService)
  app.use(ConfirmationService)
}
