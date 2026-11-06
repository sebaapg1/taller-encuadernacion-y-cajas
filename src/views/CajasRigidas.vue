<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { Box, Scissor, Download, Eye, Book } from '@iconoir/vue'
import Plegado3D from '../components/Plegado3D.vue'
import { piezasCajaMagnetica, piezasBandeja } from '../lib/cajas/rigidas.js'
import { svgRed, paredesBandeja, paredesTapa } from '../lib/cajas/red.js'
import { medidasCaja, VALORES_BASE } from '../lib/cajas/medidasObjeto.js'

// Modelos: nombres en español e inglés.
const ESTILOS = [
  { id: 'magnetic-flap', texto: 'Caja magnética con tapa envolvente · Magnetic box', ayuda: 'Dos piezas: caja interior y tapa envolvente con cierre magnético.' },
  { id: 'estuche', texto: 'Estuche de dos piezas · Two-piece box', ayuda: 'Dos piezas: bandeja interior y funda exterior.' },
]
// Medidas de referencia (interiores de la caja, en mm).
// Medidas exteriores de la caja cerrada (una sola medida para todas las piezas).
const DEFECTOS = {
  'magnetic-flap': { length: 184, width: 124, height: 62 },
  estuche: { length: 158, width: 108, height: 36 },
}

const ruta = useRoute()
const estiloId = ref(ruta.query.estilo === 'estuche' ? 'estuche' : 'magnetic-flap')
const dims = reactive({ ...DEFECTOS['magnetic-flap'] })
const grosor = ref(1.2) // cartón gris (greyboard) de 0,8 a 1,4 mm; valor de referencia
const margen = ref(15) // sangría: papel de forro que sobra alrededor de cada cartón
const holgura = ref(0) // 0 = tapa al ras
const OPCIONES_HOLGURA = [
  { valor: 0, texto: 'Al ras (0 mm)' },
  { valor: 1.5, texto: 'Holgura ligera (1,5 mm)' },
  { valor: 3, texto: 'Holgura alta (3 mm)' },
]
const pestana = ref(ruta.query.vista === '3d' ? '3d' : 'troquel')
const vistaAngulo = ref(ruta.query.ang ?? 'tres-cuartos')
const VISTAS = [
  { id: 'frente', texto: 'Frente' },
  { id: 'lado', texto: 'Lado' },
  { id: 'atras', texto: 'Atrás' },
  { id: 'arriba', texto: 'Arriba' },
  { id: 'abajo', texto: 'Abajo' },
  { id: 'tres-cuartos', texto: '3/4' },
]

const estilo = computed(() => ESTILOS.find((e) => e.id === estiloId.value))
const esMagnetica = computed(() => estiloId.value === 'magnetic-flap')

watch(estiloId, (id) => Object.assign(dims, DEFECTOS[id]))

// Una sola medida (exterior de la caja cerrada) define todas las piezas:
// - La tapa envuelve la caja: su interior es el exterior menos dos grosores.
// - La caja contenedora se reduce por la holgura, si la tapa no va al ras.
const ext = computed(() => ({ largo: dims.length, ancho: dims.width, alto: dims.height }))
const t = computed(() => grosor.value)
const h = computed(() => (esMagnetica.value ? holgura.value : 0))
// Interior de la caja contenedora (lo que cabe dentro).
const interiorCaja = computed(() => ({
  largo: ext.value.largo - 4 * t.value - 2 * h.value,
  ancho: ext.value.ancho - 4 * t.value - 2 * h.value,
  alto: ext.value.alto - t.value,
}))
// Interior de la tapa (magnética) o de la funda (estuche): la caja exterior menos dos grosores.
const interiorTapa = computed(() => ({
  largo: ext.value.largo - 2 * t.value,
  ancho: ext.value.ancho - 2 * t.value,
  alto: ext.value.alto,
}))

// Cada parte se dibuja desplegada, con su papel de forro.
const partes = computed(() => {
  if (estiloId.value === 'magnetic-flap') {
    return [
      { nombre: 'Caja interior', paneles: paredesBandeja(interiorCaja.value, t.value) },
      { nombre: 'Tapa envolvente', paneles: paredesTapa(interiorCaja.value, t.value, h.value) },
    ]
  }
  return [
    { nombre: 'Bandeja interior', paneles: paredesBandeja(interiorCaja.value, t.value) },
    { nombre: 'Funda exterior', paneles: paredesBandeja(interiorTapa.value, t.value) },
  ]
})
// Piezas de cartón armadas, para el 3D.
const piezas = computed(() => {
  if (estiloId.value === 'magnetic-flap') return piezasCajaMagnetica(interiorCaja.value, t.value, h.value)
  return [
    ...piezasBandeja(interiorCaja.value, t.value, 'Bandeja'),
    ...piezasBandeja(interiorTapa.value, t.value, 'Funda'),
  ]
})
const svg = computed(() => svgRed(partes.value, margen.value))
const escala = computed(() => Math.max(dims.length, dims.width, dims.height) + 80)

// Calculadora de medidas desde el objeto (bandeja y funda).
const objeto = reactive({ largo: 100, ancho: 60, alto: 20 })
const medidas = computed(() => medidasCaja(objeto, { ...VALORES_BASE, grosor: grosor.value }))
const f1 = (n) => n.toFixed(1).replace('.', ',')
const esEstuche = computed(() => estiloId.value === 'estuche')

function usarMedidasObjeto() {
  const m = medidas.value
  // La medida del objeto se convierte en la caja cerrada: bandeja interior + grosores + funda.
  const extL = m.folder.largo + 2 * grosor.value
  const extA = m.folder.ancho + 2 * grosor.value
  Object.assign(dims, { length: extL, width: extA, height: m.bandeja.interior.alto + grosor.value + 2 * grosor.value })
}

function descargarSvg() {
  const blob = new Blob([svg.value], { type: 'image/svg+xml' })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(blob)
  enlace.download = `${estiloId.value}.svg`
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <header class="mb-6">
      <h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
        <Box class="h-7 w-7 text-taller-acento" />
        Cajas rígidas
      </h1>
      <p class="mt-1 max-w-3xl text-sm text-taller-suave">
        Cajas forradas: se arman con piezas de cartón rígido pegadas, no se pliegan de una sola hoja.
        El troquel muestra cada pieza de cartón con su papel de forro alrededor.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <aside class="space-y-5">
        <section class="card">
          <h2 class="section-title"><Book class="h-5 w-5" /> Modelo</h2>
          <Select v-model="estiloId" :options="ESTILOS" optionLabel="texto" optionValue="id" class="w-full" />
          <p class="mt-3 text-sm">{{ estilo.ayuda }}</p>
        </section>

        <section class="card">
          <h2 class="section-title"><Scissor class="h-5 w-5" /> Medidas (mm)</h2>
          <div class="space-y-3">
            <div>
              <label for="largo" class="field-label">Largo exterior (caja cerrada)</label>
              <InputNumber id="largo" v-model="dims.length" :min="10" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" />
            </div>
            <div>
              <label for="ancho" class="field-label">Ancho exterior (caja cerrada)</label>
              <InputNumber id="ancho" v-model="dims.width" :min="10" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" />
            </div>
            <div>
              <label for="alto" class="field-label">Alto exterior (caja cerrada)</label>
              <InputNumber id="alto" v-model="dims.height" :min="5" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" />
            </div>
          </div>
          <div class="mt-4 border-t border-taller-linea pt-4">
            <label for="grosor" class="field-label">Grosor del cartón (mm)</label>
            <InputNumber id="grosor" v-model="grosor" :min="0.5" :maxFractionDigits="2" locale="es-CL" class="w-full" inputClass="w-full" />
            <p class="mt-1 text-xs text-taller-suave">El cartón gris suele medir entre 0,8 y 1,4 mm.</p>
            <label for="margen" class="field-label mt-3">Sangría del papel (mm)</label>
            <InputNumber id="margen" v-model="margen" :min="5" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" />
            <p class="mt-1 text-xs text-taller-suave">Papel que sobra alrededor de cada cartón para doblarlo hacia dentro.</p>
            <template v-if="esMagnetica">
              <label for="holgura" class="field-label mt-3">Tapa respecto a la caja</label>
              <Select id="holgura" v-model="holgura" :options="OPCIONES_HOLGURA" optionLabel="texto" optionValue="valor" class="w-full" />
            </template>
          </div>
        </section>

        <section v-if="esEstuche" class="card">
          <h2 class="section-title"><Scissor class="h-5 w-5" /> Medidas desde el objeto</h2>
          <p class="mb-3 text-xs text-taller-suave">Escribe el objeto que va dentro. Usa el grosor del cartón de arriba.</p>
          <div class="objeto grid grid-cols-3 gap-2">
            <div><label for="ol" class="field-label">Largo</label><InputNumber id="ol" v-model="objeto.largo" :min="1" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" /></div>
            <div><label for="oa" class="field-label">Ancho</label><InputNumber id="oa" v-model="objeto.ancho" :min="1" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" /></div>
            <div><label for="oh" class="field-label">Alto</label><InputNumber id="oh" v-model="objeto.alto" :min="1" :maxFractionDigits="1" locale="es-CL" class="w-full" inputClass="w-full" /></div>
          </div>
          <Button label="Usar estas medidas para la caja cerrada" class="mt-4 w-full" @click="usarMedidasObjeto" />
          <dl class="mt-4 space-y-2 text-sm">
            <p class="font-semibold">Bandeja interior</p>
            <div class="flex justify-between"><dt>Lado largo</dt><dd>{{ f1(medidas.bandeja.ladoLargo) }} mm</dd></div>
            <div class="flex justify-between"><dt>Lados superior e inferior</dt><dd>{{ f1(medidas.bandeja.ladoSuperiorInferior) }} mm</dd></div>
            <div class="flex justify-between"><dt>Hueco interior (largo × ancho)</dt><dd>{{ f1(medidas.bandeja.interior.largo) }} × {{ f1(medidas.bandeja.interior.ancho) }} mm</dd></div>
            <p class="pt-2 font-semibold">Funda exterior</p>
            <div class="flex justify-between"><dt>Medida total (largo × ancho)</dt><dd>{{ f1(medidas.folder.largo) }} × {{ f1(medidas.folder.ancho) }} mm</dd></div>
            <div class="flex justify-between"><dt>Espina</dt><dd>{{ f1(medidas.folder.espina) }} mm</dd></div>
            <div class="flex justify-between"><dt>Solapa de cierre</dt><dd>{{ f1(medidas.folder.solapa) }} mm</dd></div>
          </dl>
        </section>

        <section class="card">
          <h2 class="section-title"><Download class="h-5 w-5" /> Descargar</h2>
          <Button label="Troquel en SVG" :disabled="!piezas.length" @click="descargarSvg">
            <template #icon><Download class="h-4 w-4" /></template>
          </Button>
          <p class="mt-3 text-xs text-taller-suave">Imprime a escala 100 % y comprueba que la regla mida lo indicado.</p>
        </section>
      </aside>

      <section class="space-y-5 lg:col-span-2">
        <div class="card">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex gap-2">
              <button type="button" class="tab" :class="{ activa: pestana === 'troquel' }" @click="pestana = 'troquel'">Troquel plano</button>
              <button type="button" class="tab" :class="{ activa: pestana === '3d' }" @click="pestana = '3d'">Caja armada (3D)</button>
            </div>
          </div>
          <div v-if="pestana === 'troquel'" class="troquel" v-html="svg" />
          <p v-if="pestana === 'troquel'" class="mt-3 text-xs text-taller-suave">Rojo: corte del papel de forro. Gris: cartón rígido. Líneas discontinuas: dobleces.</p>
          <template v-if="pestana === '3d'">
            <div class="mb-3 flex flex-wrap items-center gap-2">
              <span class="mr-1 text-sm text-taller-suave">Ver desde:</span>
              <button v-for="v in VISTAS" :key="v.id" type="button" class="tab" :class="{ activa: vistaAngulo === v.id }" @click="vistaAngulo = v.id">
                {{ v.texto }}
              </button>
            </div>
            <Plegado3D :piezas="piezas" :escala="escala" :vista="vistaAngulo" />
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
