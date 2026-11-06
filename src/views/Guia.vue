<script setup>
import { Book, Calculator, Ruler, Box, Page, Settings, Scissor, Download, Eye, InfoCircle } from '@iconoir/vue'

// Contenido de la guía. Cada sección describe algo que aparece en la pantalla real.
const herramientas = [
  {
    id: 'encuadernacion',
    to: '/encuadernacion',
    titulo: 'Encuadernación',
    icono: Book,
    resumen:
      'Toma un PDF y lo reordena en pliegos listos para imprimir, doblar y coser. Todo se calcula en tu navegador: el PDF no sale de tu computador.',
    secciones: [
      { titulo: '1. Tu archivo', icono: Page, que: 'Subes el PDF y eliges qué páginas usar (por ejemplo "1-8" o "1,3,5-7"). También decides si quieres un archivo unificado, uno por cuadernillo o ambos.' },
      { titulo: '2. Orientación de las páginas', icono: Page, que: 'Si tu libro tiene páginas giradas (apaisadas, o con el lomo arriba o abajo), aquí lo corriges. "Voltear por el lado largo" invierte las páginas pares e impares.' },
      { titulo: '3. Impresora y papel', icono: Settings, que: 'El tamaño del papel que vas a usar y si tu impresora imprime por las dos caras ("Doble cara") o una a una ("Una cara"). "Girar 90°" pone el papel en horizontal.' },
      { titulo: '4. Cómo se acomoda en la hoja', icono: Settings, que: 'Cuántas páginas van por cara (in-folio, en cuarto, en octavo…), cómo se escalan y se centran, y los márgenes en puntos.' },
      { titulo: '5. Cuadernillos', icono: Book, que: 'El tipo de encuadernación: folleto, rústica, cuadernillos de tamaño fijo o propio, o diseños pequeños (varias páginas por hoja, como un zine). También las hojas de guarda al inicio y al final.' },
      { titulo: '6. Marcas de ayuda', icono: Scissor, que: 'Líneas de doblez y de corte que se imprimen junto a tu contenido, y marcas para coser. Se ven como guías; si no las quieres, déjalas desmarcadas.' },
      { titulo: 'Resumen (columna derecha)', icono: Eye, que: 'Muestra cuántas páginas tiene tu PDF, cuántas hojas vas a imprimir y cómo quedan repartidos los cuadernillos. Los botones "Vista previa" y "Generar y descargar ZIP" están aquí.' },
    ],
    flujo: [
      'Sube el PDF y revisa el número de páginas en el resumen.',
      'Elige el papel y si tu impresora imprime por ambas caras.',
      'Define el tipo de cuadernillo (en cuarto u octavo, por ejemplo) y las hojas de guarda.',
      'Revisa la vista previa: las páginas deben quedar en el orden que esperas.',
      'Descarga el ZIP y lee el archivo settings.txt: guarda tus ajustes.',
      'Imprime a escala 100 %, sin "ajustar a la página", y con volteo por el lado largo si es doble cara.',
      'Dobla los pliegos, ordénalos y cose.',
    ],
    consejos: [
      'Haz una prueba con 2 o 3 hojas antes de imprimir el libro completo.',
      'Si tu impresora rota las hojas al imprimir doble cara, cambia "Voltear por el lado largo".',
    ],
  },
  {
    id: 'tapas',
    to: '/tapas-duras',
    titulo: 'Tapas duras',
    icono: Calculator,
    resumen:
      'Calcula cuánta tela y cartón necesitas para encuadernar un libro de tapa dura a mano. Los dibujos se actualizan con cada medida.',
    secciones: [
      { titulo: 'Tu libro', icono: Book, que: 'El ancho y alto de una hoja ya cortada, y el grosor del bloque: cuánto mide el lomo de todas las hojas juntas, sin tapas.' },
      { titulo: 'Materiales', icono: Box, que: 'El grosor del cartón (lo habitual son 2 a 3 mm), cuánto sobresale la tapa de las hojas y la vuelta de tela que se dobla hacia dentro.' },
      { titulo: 'Cómo se calcula', icono: InfoCircle, que: 'Las fórmulas paso a paso con tus números. Si algo no te cuadra, aquí ves de dónde sale cada medida.' },
      { titulo: 'Indicadores', icono: Ruler, que: 'Las medidas finales de la tela, de cada tapa, del lomo y del canal (la bisagra), en milímetros.' },
      { titulo: 'Cómo queda el libro', icono: Book, que: 'Un corte transversal: tapas, bloque de páginas y canal. Los grosores están exagerados para verlos.' },
      { titulo: 'Plano de la tela', icono: Scissor, que: 'La tela extendida sobre las tapas. Las zonas rayadas son las vueltas que se doblan hacia dentro.' },
      { titulo: 'El lomo, paso a paso', icono: Book, que: 'El lomo cerrado, a medio abrir y abierto plano, para entender cómo trabaja la tela entre las dos tapas.' },
    ],
    flujo: [
      'Mide una hoja ya cortada: ancho y alto.',
      'Mide el bloque cosido y apretado: ese es el grosor del libro.',
      'Elige el grosor del cartón y cuánto quieres que sobresalga la tapa.',
      'Anota los tamaños de cartón y de tela que aparecen en "Medidas finales".',
      'Corta el cartón y la tela con esas medidas, y dibuja la tela en tu plano para comprobar.',
      'Pega la tela, dobla las vueltas y pega las guardas.',
    ],
    consejos: [
      'Haz una tapa de prueba con cartón de desecho antes de usar tela buena.',
      'La vuelta de tela de 20 mm sirve para libros medianos; en libros muy gruesos conviene aumentarla.',
    ],
  },
  {
    id: 'portada',
    to: '/portada',
    titulo: 'Portada para imprimir',
    icono: Ruler,
    resumen:
      'Calcula el tamaño total del archivo de la portada: ancho, alto y lomo, con las guías de corte. Sirve para rústica y tapa dura.',
    secciones: [
      { titulo: 'Tamaño del libro', icono: Book, que: 'Elige un formato habitual o escribe el ancho y alto de la página en milímetros.' },
      { titulo: 'Páginas, tipo y papel', icono: Settings, que: 'El número de páginas, si es rústica o tapa dura, y el papel. El papel cambia el grosor del lomo.' },
      { titulo: 'Sangrado o envoltura', icono: Scissor, que: 'En rústica, el sangrado es lo que se imprime más allá del corte. En tapa dura, la envoltura es la tela que se dobla hacia dentro y el margen es el de la tapa.' },
      { titulo: 'Resultados', icono: Eye, que: 'Ancho total, alto total y lomo, en la unidad que elijas. Son las medidas del archivo de la portada.' },
      { titulo: 'Esquema', icono: Ruler, que: 'Un dibujo con las guías: el borde de corte, los bordes del lomo y el centro de cada tapa.' },
    ],
    flujo: [
      'Elige el formato y el número de páginas final.',
      'Elige el papel real que vas a comprar; si no lo sabes, usa "Otro grosor" con el dato del proveedor.',
      'Anota el ancho total, el alto total y el lomo.',
      'Crea el archivo en tu programa de diseño con esas medidas y pon las guías del esquema.',
      'Antes de enviarlo a imprimir, compara con la calculadora oficial de tu imprenta.',
    ],
    consejos: [
      'Esta herramienta no genera archivos: te da las medidas para armarlo tú.',
      'El lomo de tapa dura usa una fórmula empírica; confírmalo con tu imprenta.',
    ],
  },
  {
    id: 'cajas',
    to: '/packbox',
    titulo: 'Cajas',
    icono: Box,
    resumen:
      'Genera el troquel de una caja de cartón: las líneas de corte (rojo) y de doblez (verde) listas para imprimir o enviar a una cortadora.',
    secciones: [
      { titulo: 'Tipo de caja', icono: Page, que: 'Eliges el estilo: caja de solapa, americana (RSC), caja para naipes, bandeja, mailer y otras. Cada estilo muestra su nombre en español e inglés, y para qué sirve. Las cajas magnéticas y los estuches forrados están en Cajas rígidas (en el menú de arriba).' },
      { titulo: 'Medidas', icono: Ruler, que: 'Largo, ancho y alto de la caja armada, en milímetros. Las solapas y pestañas se calculan solas.' },
      { titulo: 'Troquel plano', icono: Box, que: 'El plano de la caja extendida. Rojo: corte. Verde: doblez.' },
      { titulo: 'Caja armada (3D)', icono: Box, que: 'La caja en tres dimensiones. El deslizador va de plana a armada para ver cómo se cierra. Arrastra sobre la caja para girarla.' },
      { titulo: 'Descargas', icono: Download, que: 'SVG para imprimir o editar en Illustrator o Inkscape, y DXF para cortadoras y programas de CAD.' },
    ],
    flujo: [
      'Elige el tipo de caja que se parece a la tuya.',
      'Escribe las medidas de la caja armada, no las del producto que va dentro (agrega holgura).',
      'Revisa la caja armada en 3D: el deslizador de plana a armada te muestra si las solapas cierran.',
      'Descarga el SVG e imprímelo a escala 100 % en cartulina de prueba.',
      'Mide el impreso con regla: debe coincidir con las medidas indicadas.',
      'Corta, dobla y arma. Si algo no encaja, ajusta las medidas y repite.',
      'Cuando esté bien, usa el DXF para la cortadora o la imprenta.',
    ],
    consejos: [
      'Un milímetro de holgura en el interior evita que el producto quede apretado.',
      'Una prueba en papel barato ahorra cartón caro.',
    ],
  },
]

const flujoGeneral = [
  { paso: 'Diseña', detalle: 'Decide qué quieres hacer: un libro, una tapa o una caja. Dibuja un boceto con medidas aproximadas.' },
  { paso: 'Mide', detalle: 'Mide el papel, el bloque cosido y el producto. Usa la herramienta que corresponda: Encuadernación, Tapas, Portada o Cajas.' },
  { paso: 'Calcula', detalle: 'Escribe las medidas en la herramienta y anota las cifras finales. Compara con el boceto.' },
  { paso: 'Prueba', detalle: 'Imprime o arma una versión barata con papel de desecho. Es la etapa más importante para no gastar material bueno.' },
  { paso: 'Ajusta', detalle: 'Corrige medidas, márgenes o holguras según la prueba. Anota los valores que funcionaron.' },
  { paso: 'Produce', detalle: 'Con las medidas confirmadas, haz la tirada final: imprime, corta, dobla, cose y pega.' },
]
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <header class="mb-8">
      <h1 class="flex items-center gap-2 text-3xl font-bold tracking-tight">
        <InfoCircle class="h-8 w-8 text-taller-acento" />
        Guía de Taller
      </h1>
      <p class="mt-2 max-w-2xl text-taller-suave">
        Qué hace cada herramienta, qué significa cada sección y en qué orden conviene usarlas.
      </p>
    </header>

    <!-- Flujo general -->
    <section class="card mb-8">
      <h2 class="section-title"><Settings class="h-5 w-5" /> Flujo de trabajo sugerido</h2>
      <p class="mb-4 text-sm text-taller-suave">Sirve para cualquier proyecto, sea un libro, una tapa o una caja.</p>
      <ol class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <li v-for="(p, i) in flujoGeneral" :key="p.paso" class="flex gap-3 rounded-xl bg-taller-fondo p-4">
          <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-taller-barra text-sm font-semibold text-white">{{ i + 1 }}</span>
          <div>
            <p class="font-semibold">{{ p.paso }}</p>
            <p class="text-sm text-taller-suave">{{ p.detalle }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- Una sección por herramienta -->
    <section v-for="h in herramientas" :id="h.id" :key="h.id" class="card mb-8 scroll-mt-20">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="section-title !mb-0 text-xl"><component :is="h.icono" class="h-6 w-6 text-taller-acento" /> {{ h.titulo }}</h2>
        <router-link :to="h.to" class="rounded-lg bg-taller-barra px-3 py-1.5 text-sm text-white hover:opacity-90">Abrir herramienta</router-link>
      </div>
      <p class="mb-5 text-taller-suave">{{ h.resumen }}</p>

      <h3 class="mb-2 font-semibold">Qué hace cada parte</h3>
      <dl class="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div v-for="s in h.secciones" :key="s.titulo" class="rounded-xl border border-taller-linea p-4">
          <dt class="flex items-center gap-2 font-semibold"><component :is="s.icono" class="h-4 w-4 text-taller-acento" /> {{ s.titulo }}</dt>
          <dd class="mt-1 text-sm text-taller-suave">{{ s.que }}</dd>
        </div>
      </dl>

      <h3 class="mb-2 font-semibold">Flujo sugerido</h3>
      <ol class="mb-6 list-decimal space-y-1.5 pl-5 text-sm">
        <li v-for="(paso, i) in h.flujo" :key="i">{{ paso }}</li>
      </ol>

      <h3 class="mb-2 font-semibold">Consejos</h3>
      <ul class="space-y-1.5 text-sm text-taller-suave">
        <li v-for="(c, i) in h.consejos" :key="i" class="flex gap-2"><span>•</span>{{ c }}</li>
      </ul>
    </section>

    <p class="text-center text-sm text-taller-suave">
      Los créditos y las licencias de cada herramienta están en <router-link to="/creditos" class="underline underline-offset-2">Créditos</router-link>.
    </p>
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--radius-card, 12px);
  background: #fff;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(26, 29, 34, 0.08);
  border: 1px solid #e5e4e2;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.9rem;
}
</style>
