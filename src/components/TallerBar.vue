<script setup>
import { Home, BookStack, Box, Calculator, Ruler, InfoCircle, Book } from '@iconoir/vue'

// Barra superior común a todas las herramientas de Taller.
const enlaces = [
  { to: '/', texto: 'Inicio', icono: Home },
  { to: '/encuadernacion', texto: 'Encuadernación', icono: BookStack },
  { to: '/packbox', texto: 'Cajas', icono: Box },
  { to: '/tapas-duras', texto: 'Tapas duras', icono: Calculator },
  { to: '/portada', texto: 'Portada', icono: Ruler },
  { to: '/cajas-rigidas', texto: 'Cajas rígidas', icono: Box },
]
</script>

<template>
  <header class="sticky top-0 z-40 bg-taller-barra text-white shadow-md">
    <nav class="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3" aria-label="Principal">
      <router-link to="/" class="flex items-center gap-2 text-lg font-semibold tracking-wide">
        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <BookStack class="h-5 w-5" />
        </span>
        Taller
      </router-link>
      <ul class="flex flex-wrap gap-x-1 gap-y-1 text-sm">
        <li v-for="e in enlaces" :key="e.to">
          <router-link
            :to="e.to"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 opacity-80 transition hover:bg-white/10 hover:opacity-100"
            active-class="bg-white/15 opacity-100"
          >
            <component :is="e.icono" class="h-4 w-4" />
            {{ e.texto }}
          </router-link>
        </li>
        <li>
          <router-link
            to="/guia"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 opacity-80 transition hover:bg-white/10 hover:opacity-100"
            active-class="bg-white/15 opacity-100"
          >
            <Book class="h-4 w-4" />
            Guía
          </router-link>
        </li>
        <li>
          <router-link
            to="/creditos"
            class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 opacity-80 transition hover:bg-white/10 hover:opacity-100"
            active-class="bg-white/15 opacity-100"
          >
            <InfoCircle class="h-4 w-4" />
            Créditos
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
