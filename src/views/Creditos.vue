<script setup>
const fuentes = [
  {
    nombre: 'Calculadora de tapas duras',
    origen: 'Inspirada en easy-hardcovers, de ittia-9b',
    enlace: 'https://github.com/ittia-9b/easy-hardcovers',
    licencia: 'MIT, © 2026 Sebastian Palma (ver LICENSE-TAPAS)',
    cambios: 'Reescrita desde cero: no se copió su código ni sus imágenes. Cálculos propios con pruebas.',
  },
  {
    nombre: 'Encuadernación (bookbinder)',
    origen: 'bookbinder-js, de momijizukamori, basado en Bookbinder de Quantum Elephant',
    enlace: 'https://github.com/momijizukamori/bookbinder-js',
    licencia: 'Mozilla Public License 2.0 (MPL-2.0)',
    cambios: 'Interfaz reescrita en Vue con PrimeVue. El motor de imposición se conserva (MPL-2.0, carpeta src/lib/imposicion).',
  },
  {
    nombre: 'Portada para imprimir',
    origen: 'Inspirada en CoverSizeCalculator, de Benjamin T. Milnes (fórmulas y valor empírico del lomo)',
    enlace: 'https://github.com/BenjaminTMilnes/CoverSizeCalculator',
    licencia: 'Herramienta propia: MIT, © 2026 Sebastian Palma. La fuente no declara licencia.',
    cambios: 'Código original en Vue, con pruebas. No se copió código de la fuente; sus fórmulas se reescribieron.',
  },
  {
    nombre: 'Cajas (PackBox)',
    origen: 'PackBox Studio, de sbarrak',
    enlace: 'https://github.com/sbarrak/packbox',
    licencia: 'MIT, © 2026 sbarrak',
    cambios: 'El motor de geometría (src/lib/cajas) se conserva con su licencia MIT; la interfaz es nueva en Vue. Editor visual y 3D pendientes.',
  },
]

const librerias = [
  { nombre: 'Vue.js', licencia: 'MIT', enlace: 'https://vuejs.org' },
  { nombre: 'Vue Router', licencia: 'MIT', enlace: 'https://router.vuejs.org' },
  { nombre: 'Vite', licencia: 'MIT', enlace: 'https://vite.dev' },
  { nombre: 'Tailwind CSS', licencia: 'MIT', enlace: 'https://tailwindcss.com' },
  { nombre: 'PrimeVue', licencia: 'MIT', enlace: 'https://primevue.org' },
  { nombre: 'Iconoir', licencia: 'MIT', enlace: 'https://iconoir.com' },
  { nombre: 'pdf-lib (@cantoo/pdf-lib)', licencia: 'MIT', enlace: 'https://pdf-lib.js.org' },
  { nombre: 'JSZip', licencia: 'MIT o GPL-3.0', enlace: 'https://stuk.github.io/jszip' },
  { nombre: 'file-saver', licencia: 'MIT', enlace: 'https://github.com/eligrey/FileSaver.js' },
  { nombre: 'Zod', licencia: 'MIT', enlace: 'https://zod.dev' },
]
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <h1 class="text-2xl font-bold">Créditos y licencias</h1>
    <p class="mt-2 text-taller-suave">
      Taller reúne herramientas de otras personas. Aquí está de dónde viene cada una y bajo qué licencia.
    </p>

    <section class="mt-8 space-y-4">
      <article v-for="f in fuentes" :key="f.nombre" class="rounded-xl bg-taller-tarjeta p-5 shadow-sm ring-1 ring-taller-linea">
        <h2 class="text-lg font-semibold">{{ f.nombre }}</h2>
        <p class="mt-1 text-sm">
          Origen:
          <a :href="f.enlace" target="_blank" rel="noopener" class="underline underline-offset-2">{{ f.origen }}</a>
        </p>
        <p class="mt-1 text-sm text-taller-suave">Licencia: {{ f.licencia }}</p>
        <p class="mt-1 text-sm text-taller-suave">Cambios en Taller: {{ f.cambios }}</p>
      </article>
    </section>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Bibliotecas</h2>
      <ul class="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <li v-for="l in librerias" :key="l.nombre">
          <a :href="l.enlace" target="_blank" rel="noopener" class="underline underline-offset-2">{{ l.nombre }}</a>
          <span class="text-taller-suave"> · {{ l.licencia }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
