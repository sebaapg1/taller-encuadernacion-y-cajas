import { createApp, h } from 'vue'
import { IconoirProvider } from '@iconoir/vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from './router'
import App from './App.vue'
import './styles/main.css'

// Mismo esquema que gestión.plusmedical.cl:
// - PrimeVue 4 con el tema Aura (paquete @primevue/themes, MIT).
//   OJO: no usar @primeuix/themes (licencia distinta).
// - Iconoir como familia de iconos; el proveedor evita avisos por cada ícono.
// - Textos de calendario en español; el modo oscuro queda desactivado.
createApp({ render: () => h(IconoirProvider, null, { default: () => h(App) }) })
  .use(router)
  .use(PrimeVue, {
    theme: { preset: Aura, options: { darkModeSelector: false } },
    locale: {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar',
    },
  })
  .mount('#app')
