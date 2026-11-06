<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { Box, Download, Page, Scissor, InfoCircle } from '@iconoir/vue'
import InfoTip from '../components/InfoTip.vue'
import Plegado3D from '../components/Plegado3D.vue'
import { BOX_STYLES } from '../lib/cajas/geometry/boxBuilders.ts'
import { NOMBRES_CAJAS } from '../lib/cajas/nombres.js'

// Cajas forradas (magnética y estuche) ahora están en el proyecto Cajas rígidas.
const EN_CAJAS_RIGIDAS = ['magnetic-flap', 'two-piece-base', 'two-piece-lid']
import { computeFlatLayout } from '../lib/cajas/geometry/layout.ts'
import { generateDielineSVG, downloadTextFile } from '../lib/cajas/geometry/svgExport.ts'
import { generateDielineDXF } from '../lib/cajas/geometry/dxfExport.ts'

const estilos = BOX_STYLES.filter((s) => !EN_CAJAS_RIGIDAS.includes(s.id)).map((s) => ({ id: s.id, label: `${NOMBRES_CAJAS[s.id].es} · ${NOMBRES_CAJAS[s.id].en}` }))
const estiloId = ref(BOX_STYLES.some((s) => s.id === useRoute().query.estilo) ? useRoute().query.estilo : BOX_STYLES[0].id)
const grosor = ref(1.5) // valor de referencia: cámbialo por el grosor real del cartón
const holgura = ref(0) // 0 = tapa al ras
const OPCIONES_HOLGURA = [
  { valor: 0, texto: 'Al ras (0 mm)' },
  { valor: 1.5, texto: 'Holgura ligera (1,5 mm)' },
  { valor: 3, texto: 'Holgura alta (3 mm)' },
]
const esMagnetica = computed(() => estiloId.value === 'magnetic-flap')
const dims = reactive({ ...(BOX_STYLES.find((s) => s.id === estiloId.value) ?? BOX_STYLES[0]).defaultDimensions })
const error = ref('')
// La vista inicial puede venir de la URL: ?vista=3d&p=0.5
const ruta = useRoute()
const pestana = ref(ruta.query.vista === '3d' ? '3d' : 'troquel')
const plegado = ref(Math.min(1, Math.max(0, Number(ruta.query.p ?? 0)) || 0))
const vistaAngulo = ref(ruta.query.ang ?? 'tres-cuartos')
const VISTAS_CAJA = [
  { id: 'frente', texto: 'Frente' },
  { id: 'lado', texto: 'Lado' },
  { id: 'atras', texto: 'Atrás' },
  { id: 'arriba', texto: 'Arriba' },
  { id: 'abajo', texto: 'Abajo' },
  { id: 'tres-cuartos', texto: '3/4' },
]

const estilo = computed(() => BOX_STYLES.find((s) => s.id === estiloId.value))

// Al cambiar de estilo, se cargan sus medidas de ejemplo.
watch(estiloId, () => {
  Object.assign(dims, estilo.value.defaultDimensions)
})

const arbol = computed(() => {
  try {
    return estilo.value.build({ ...dims, thickness: grosor.value, lidClearance: holgura.value })
  } catch (e) {
    console.error(e)
    return null
  }
})

const dieline = computed(() => {
  if (!arbol.value) {
    error.value = 'Con estas medidas la caja no se puede armar. Prueba con valores un poco más grandes.'
    return null
  }
  try {
    const layout = computeFlatLayout(arbol.value)
    error.value = ''
    return { layout, svg: generateDielineSVG(layout, { title: estilo.value.label, showDimensions: true }) }
  } catch (e) {
    console.error(e)
    error.value = 'Con estas medidas la caja no se puede armar. Prueba con valores un poco más grandes.'
    return null
  }
})

const escalaTroquel = computed(() => {
  const d = dieline.value
  if (!d) return 300
  return Math.max(d.layout.bounds.width, d.layout.bounds.height)
})

const nombreBase = computed(() => NOMBRES_CAJAS[estilo.value.id].en.replace(/\s+/g, '_').replace(/[()]/g, ''))

function descargarSvg() {
  if (dieline.value) downloadTextFile(`${nombreBase.value}.svg`, dieline.value.svg)
}
function descargarDxf() {
  if (dieline.value && dieline.value.layout) downloadTextFile(`${nombreBase.value}.dxf`, generateDielineDXF(dieline.value.layout), 'application/dxf')
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <header class="mb-6">
      <h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
        <Box class="h-7 w-7 text-taller-acento" />
        Cajas
      </h1>
      <p class="mt-1 max-w-2xl text-sm text-taller-suave">
        Elige un tipo de caja, escribe sus medidas y obtén el troquel para cortarlo e imprimirlo.
        Las líneas rojas son de corte y las verdes, de doblez.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <aside class="space-y-5">
        <section class="card">
          <h2 class="section-title"><Page class="h-5 w-5" /> Tipo de caja</h2>
          <Select v-model="estiloId" :options="estilos" optionLabel="label" optionValue="id" class="w-full" />
          <p class="mt-3 text-sm">{{ NOMBRES_CAJAS[estilo.id].descripcionEs }}</p>
          <p class="mt-1 text-xs text-taller-suave">{{ estilo.description }}</p>
        </section>

        <section class="card">
          <h2 class="section-title"><Scissor class="h-5 w-5" /> Medidas (mm)</h2>
          <div class="space-y-3">
            <div>
              <label for="largo" class="field-label">Largo <InfoTip texto="La cara frontal de la caja, de izquierda a derecha." /></label>
              <InputNumber id="largo" v-model="dims.length" :min="10" :maxFractionDigits="1" locale="es-CL" class="w-full" />
            </div>
            <div>
              <label for="ancho" class="field-label">Ancho <InfoTip texto="La profundidad de la caja: la cara lateral." /></label>
              <InputNumber id="ancho" v-model="dims.width" :min="10" :maxFractionDigits="1" locale="es-CL" class="w-full" />
            </div>
            <div>
              <label for="alto" class="field-label">Alto <InfoTip texto="La altura de la caja, de abajo hacia arriba." /></label>
              <InputNumber id="alto" v-model="dims.height" :min="10" :maxFractionDigits="1" locale="es-CL" class="w-full" />
            </div>
          </div>
          <div class="mt-4 border-t border-taller-linea pt-4">
            <label for="grosor" class="field-label">Grosor del cartón (mm) <InfoTip texto="Grosor real del cartón que vas a usar. Lo usan los cálculos de la tapa y de las esquinas." /></label>
            <InputNumber id="grosor" v-model="grosor" :min="0.5" :maxFractionDigits="2" locale="es-CL" class="w-full" />
          </div>
          <p class="mt-3 flex items-start gap-2 text-xs text-taller-suave">
            <InfoCircle class="mt-0.5 h-4 w-4 flex-shrink-0" />
            Las solapas y las pestañas se calculan solas a partir de estas medidas.
          </p>
        </section>

                <section class="card">
          <h2 class="section-title"><Download class="h-5 w-5" /> Descargar</h2>
          <div class="flex flex-col gap-2">
            <Button label="Troquel en SVG" :disabled="!dieline" @click="descargarSvg">
              <template #icon><Download class="h-4 w-4" /></template>
            </Button>
            <Button label="Troquel en DXF (CAD)" severity="secondary" outlined :disabled="!dieline" @click="descargarDxf" />
          </div>
          <p class="mt-3 text-xs text-taller-suave">Imprime el SVG a escala 100 % y verifica que la regla mida lo que indica.</p>
        </section>
      </aside>

      <section class="space-y-5 lg:col-span-2">
        <Message v-if="error" severity="warn">{{ error }}</Message>
        <div class="card">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex gap-2">
              <button type="button" class="tab" :class="{ activa: pestana === 'troquel' }" @click="pestana = 'troquel'">Troquel plano</button>
              <button type="button" class="tab" :class="{ activa: pestana === '3d' }" @click="pestana = '3d'">Caja armada (3D)</button>
            </div>
          </div>
          <div v-if="pestana === 'troquel' && dieline" class="troquel" v-html="dieline.svg" />
          <template v-if="pestana === '3d' && arbol">
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span class="mr-1 text-sm text-taller-suave">Ver desde:</span>
              <button v-for="v in VISTAS_CAJA" :key="v.id" type="button" class="tab" :class="{ activa: vistaAngulo === v.id }" @click="vistaAngulo = v.id">
                {{ v.texto }}
              </button>
            </div>
            <Plegado3D :raiz="arbol" :plegado="plegado" :escala="escalaTroquel" :vista="vistaAngulo" />
            <div class="mt-4 flex items-center gap-3">
              <span class="text-sm text-taller-suave">Plana</span>
              <input v-model.number="plegado" type="range" min="0" max="1" step="0.01" class="w-full accent-taller-acento" aria-label="Plegado de la caja" />
              <span class="text-sm text-taller-suave">Armada</span>
            </div>
            <p class="mt-2 text-xs text-taller-suave">Arrastra sobre la caja para girarla. Rueda del ratón para acercar.</p>
          </template>
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
.field-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
  color: #3a5a74;
}
.tab {
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  border: 1px solid #e5e4e2;
  color: #3a5a74;
  background: #fff;
}
.tab.activa {
  background: #0e3754;
  color: #fff;
  border-color: #0e3754;
}
.objeto :deep(.p-inputnumber),
.objeto :deep(.p-inputnumber-input) {
  width: 100%;
  min-width: 0;
}
.troquel :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}
</style>
