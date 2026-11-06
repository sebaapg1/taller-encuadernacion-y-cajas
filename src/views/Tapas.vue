<script setup>
import { reactive, computed } from 'vue'
import { Calculator, Book, Box, Scissor, Ruler, Eye, InfoCircle } from '@iconoir/vue'
import CampoNumerico from '../components/CampoNumerico.vue'
import InfoTip from '../components/InfoTip.vue'
import { calcularTapa, MEDIDAS_INICIALES } from '../lib/tapas.js'
import { svgCorte, svgPlano, svgLomo } from '../lib/dibujosTapa.js'

const medidas = reactive({ ...MEDIDAS_INICIALES })
const t = computed(() => calcularTapa(medidas))
const dibujoCorte = computed(() => svgCorte(t.value))
const dibujoPlano = computed(() => svgPlano(t.value))
const dibujoLomo = computed(() => svgLomo(t.value))
const f = (n) => n.toFixed(1).replace('.', ',')
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Calculator class="h-7 w-7 text-taller-acento" />
          Tapas duras
        </h1>
        <p class="mt-1 max-w-2xl text-sm text-taller-suave">
          Escribe las medidas de tu libro y te digo cuánta tela y cartón necesitas. Los dibujos se actualizan mientras escribes.
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- Medidas -->
      <aside class="space-y-5">
        <section class="card">
          <h2 class="section-title"><Book class="h-5 w-5" /> Tu libro</h2>
          <div class="space-y-3">
            <CampoNumerico id="anchoPagina" v-model="medidas.anchoPagina" etiqueta="Ancho de página" color="bg-blue-600" ayuda="Ancho de una hoja ya cortada." />
            <CampoNumerico id="altoPagina" v-model="medidas.altoPagina" etiqueta="Alto de página" color="bg-blue-600" ayuda="Alto de una hoja ya cortada." />
            <CampoNumerico id="grosorBloque" v-model="medidas.grosorBloque" etiqueta="Grosor del libro" color="bg-blue-600" ayuda="Cuánto mide el lomo de todas las hojas juntas, sin tapas." />
          </div>
        </section>

        <section class="card">
          <h2 class="section-title"><Box class="h-5 w-5" /> Materiales</h2>
          <div class="space-y-3">
            <CampoNumerico id="grosorCarton" v-model="medidas.grosorCarton" etiqueta="Grosor del cartón" color="bg-slate-600" ayuda="Grosor de cada tapa de cartón. Lo habitual son 2 a 3 mm." />
            <CampoNumerico id="sobresalirTapa" v-model="medidas.sobresalirTapa" etiqueta="Sobresalir" color="bg-taller-acento" ayuda="Cuánto sobresale la tapa por fuera de las hojas, arriba, abajo y al frente." />
            <CampoNumerico id="margenTela" v-model="medidas.margenTela" etiqueta="Vuelta de tela" color="bg-amber-700" ayuda="Tela extra alrededor de las tapas que se dobla hacia dentro (la vuelta)." />
          </div>
        </section>

        <section class="card">
          <h2 class="section-title"><InfoCircle class="h-5 w-5" /> Cómo se calcula</h2>
          <ul class="space-y-3 text-sm">
            <li class="formula">
              <span class="formula-titulo">Cartón de cada tapa</span>
              <span>{{ f(t.ancho) }} − ½ × {{ f(t.bloque) }} + {{ f(t.sobresalir) }} = <strong>{{ f(t.anchoCarton) }} mm</strong></span>
            </li>
            <li class="formula">
              <span class="formula-titulo">Lomo</span>
              <span>{{ f(t.bloque) }} + 2 × {{ f(t.carton) }} = <strong>{{ f(t.lomo) }} mm</strong></span>
            </li>
            <li class="formula">
              <span class="formula-titulo">Canal (bisagra)</span>
              <span>{{ f(t.bloque) }} ÷ 2 + {{ f(t.carton) }} = <strong>{{ f(t.canal) }} mm</strong></span>
            </li>
            <li class="formula">
              <span class="formula-titulo">Tela total</span>
              <span>2 × {{ f(t.anchoCarton) }} + {{ f(t.lomo) }} + 2 × {{ f(t.canal) }} + 2 × {{ f(t.margen) }} = <strong>{{ f(t.anchoTela) }} mm</strong></span>
            </li>
          </ul>
        </section>
      </aside>

      <!-- Resultados y dibujos -->
      <section class="space-y-5 lg:col-span-2">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="stat">
            <Scissor class="h-5 w-5 text-taller-acento" />
            <p class="stat-valor">{{ f(t.anchoTela) }} × {{ f(t.altoTela) }}</p>
            <p class="stat-etiqueta">Tela total (mm)</p>
          </div>
          <div class="stat">
            <Box class="h-5 w-5 text-slate-600" />
            <p class="stat-valor">{{ f(t.anchoCarton) }} × {{ f(t.altoCarton) }}</p>
            <p class="stat-etiqueta">Cada tapa (mm)</p>
          </div>
          <div class="stat">
            <Ruler class="h-5 w-5 text-amber-700" />
            <p class="stat-valor">{{ f(t.lomo) }}</p>
            <p class="stat-etiqueta">Lomo (mm)</p>
          </div>
          <div class="stat">
            <Eye class="h-5 w-5 text-taller-suave" />
            <p class="stat-valor">{{ f(t.canal) }}</p>
            <p class="stat-etiqueta">Canal (mm)</p>
          </div>
        </div>

        <div class="card">
          <h2 class="section-title"><Book class="h-5 w-5" /> Cómo queda el libro</h2>
          <div class="dibujo" v-html="dibujoCorte" />
        </div>

        <div class="card">
          <h2 class="section-title"><Scissor class="h-5 w-5" /> Plano de la tela</h2>
          <p class="mb-3 text-sm text-taller-suave">Así se extiende la tela sobre el cartón. Las zonas rayadas son las vueltas que se doblan hacia dentro.</p>
          <div class="dibujo" v-html="dibujoPlano" />
        </div>

        <div class="card">
          <h2 class="section-title"><Book class="h-5 w-5" /> El lomo, paso a paso</h2>
          <p class="mb-3 text-sm text-taller-suave">
            La pieza de tela del lomo es la que hace de bisagra. Así se ve cerrado, a medio abrir y abierto plano.
          </p>
          <div class="dibujo" v-html="dibujoLomo" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--radius-card, 12px);
  background: #fff;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(26, 29, 34, 0.08);
  border: 1px solid #e5e4e2;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.9rem;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-radius: var(--radius-card, 12px);
  background: #fff;
  padding: 0.9rem;
  border: 1px solid #e5e4e2;
  box-shadow: 0 1px 2px rgba(26, 29, 34, 0.05);
}
.stat-valor {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1d22;
  margin-top: 0.25rem;
}
.stat-etiqueta {
  font-size: 0.75rem;
  color: #3a5a74;
}
.formula {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  border-radius: 10px;
  background: #f6f4ef;
  padding: 0.6rem 0.75rem;
}
.formula-titulo {
  font-size: 0.75rem;
  font-weight: 600;
  color: #3a5a74;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.dibujo :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}
</style>
