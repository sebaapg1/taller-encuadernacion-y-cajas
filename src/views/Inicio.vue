<script setup>
import { Book, Calculator, Ruler, Box, ArrowRight } from '@iconoir/vue'

const herramientas = [
  {
    to: '/encuadernacion',
    titulo: 'Encuadernación',
    texto: 'Prepara un PDF para imprimirlo y encuadernarlo a mano: cuadernillos, cuarto, octavo y más.',
    estado: 'En migración',
    icono: Book,
  },
  {
    to: '/tapas-duras',
    titulo: 'Tapas duras',
    texto: 'Calcula cuánta tela y cartón necesitas para una tapa dura, con un plano que se actualiza al instante.',
    estado: 'Disponible',
    icono: Calculator,
  },
  {
    to: '/portada',
    titulo: 'Portada para imprimir',
    texto: 'Calcula el tamaño total de la portada (ancho, alto, lomo y guías de corte) para rústica o tapa dura.',
    estado: 'Disponible',
    icono: Ruler,
  },
  {
    to: '/packbox',
    titulo: 'Cajas',
    texto: 'Genera troqueles para cajas de cartón y revisa cómo se pliegan antes de cortar.',
    estado: 'Disponible',
    icono: Box,
  },
  {
    to: '/cajas-rigidas',
    titulo: 'Cajas rígidas',
    texto: 'Caja magnética con tapa envolvente y estuche de dos piezas, con piezas de cartón forradas.',
    estado: 'Disponible',
    icono: Box,
  },
]
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-10">
    <header class="mb-10 text-center">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-taller-barra text-white">
        <Book class="h-7 w-7" />
      </div>
      <h1 class="text-3xl font-bold tracking-tight">Taller</h1>
      <p class="mt-2 text-taller-suave">Herramientas para hacer libros y cajas a mano. Todo corre en el Nido.</p>
    </header>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <component
        :is="h.href ? 'a' : 'router-link'"
        v-for="h in herramientas"
        :key="h.to || h.href"
        :to="h.to"
        :href="h.href"
        class="group flex flex-col rounded-2xl bg-taller-tarjeta p-6 shadow-sm ring-1 ring-taller-linea transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div class="flex items-start justify-between">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-taller-acento/10 text-taller-acento">
            <component :is="h.icono" class="h-6 w-6" />
          </div>
          <span class="rounded-full bg-taller-fondo px-2.5 py-0.5 text-xs text-taller-suave">{{ h.estado }}</span>
        </div>
        <h2 class="mt-4 text-lg font-semibold">{{ h.titulo }}</h2>
        <p class="mt-2 flex-1 text-sm leading-relaxed text-taller-suave">{{ h.texto }}</p>
        <span class="mt-4 flex items-center gap-1 text-sm font-medium text-taller-acento">
          Abrir
          <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </component>
    </div>

    <p class="mt-10 text-center text-sm text-taller-suave">
      Las herramientas usan código de otros autores. Mira los
      <router-link to="/creditos" class="underline underline-offset-2 hover:text-taller-tinta">créditos y licencias</router-link>.
    </p>
  </div>
</template>
