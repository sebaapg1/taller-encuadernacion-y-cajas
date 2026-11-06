import { createRouter, createWebHistory } from 'vue-router'
import Inicio from './views/Inicio.vue'
import Encuadernacion from './views/Encuadernacion.vue'
import Cajas from './views/Cajas.vue'
import Tapas from './views/Tapas.vue'
import Portada from './views/Portada.vue'
import Creditos from './views/Creditos.vue'
import Guia from './views/Guia.vue'
import CajasRigidas from './views/CajasRigidas.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/encuadernacion', name: 'encuadernacion', component: Encuadernacion },
    { path: '/packbox', name: 'packbox', component: Cajas },
    { path: '/tapas-duras', name: 'tapas', component: Tapas },
    { path: '/portada', name: 'portada', component: Portada },
    { path: '/cajas-rigidas', name: 'cajas-rigidas', component: CajasRigidas },
    { path: '/guia', name: 'guia', component: Guia },
    { path: '/creditos', name: 'creditos', component: Creditos },
    { path: '/:resto(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
