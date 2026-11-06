<script setup>
import { computed } from 'vue'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import ToggleSwitch from 'primevue/toggleswitch'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { Upload, Page, Printer, ViewGrid, Scissor, Settings, RefreshDouble, Eye, Download, Book, Check } from '@iconoir/vue'
import InfoTip from '../components/InfoTip.vue'
import { usarImposicion } from '../composables/usarImposicion.js'
import { PAGE_SIZES } from '../lib/imposicion/constants.js'

const {
  ajustes,
  resumen,
  ocupado,
  error,
  urlVista,
  hayArchivo,
  abrirArchivo,
  vistaPrevia,
  generar,
  restablecer,
} = usarImposicion()

// ---- Opciones -------------------------------------------------------------

const tamanos = computed(() => [
  ...Object.keys(PAGE_SIZES).map((clave) => {
    const [w, h] = PAGE_SIZES[clave]
    return { valor: clave, nombre: `${clave} · ${aCm(w)} × ${aCm(h)} cm` }
  }),
  { valor: 'CUSTOM', nombre: 'Medida personalizada' },
])
const aCm = (pt) => ((pt / 72) * 2.54).toFixed(1).replace('.', ',')

const origen = [
  { valor: 'none', nombre: 'Sin cambios', ayuda: 'Para libros que se leen como una novela: las páginas no se giran.' },
  { valor: '90cw', nombre: 'Girar 90° a la derecha', ayuda: 'Para libros que pasan las páginas como un calendario, de atrás hacia adelante.' },
  { valor: '90ccw', nombre: 'Girar 90° a la izquierda', ayuda: 'Para libros que pasan las páginas como un calendario, de adelante hacia atrás.' },
  { valor: 'out_binding', nombre: 'Lomo abajo (impares a la derecha, pares a la izquierda)', ayuda: 'El lomo queda en la parte inferior de la página.' },
  { valor: 'in_binding', nombre: 'Lomo arriba (impares a la izquierda, pares a la derecha)', ayuda: 'El lomo queda en la parte superior de la página.' },
]

const tiposCuadernillo = [
  {
    grupo: 'Libros',
    items: [
      { valor: 'booklet', nombre: 'Folleto (booklet)' },
      { valor: 'perfect', nombre: 'Encuadernación rústica (pegada)' },
      { valor: 'standardsig', nombre: 'Cuadernillos de tamaño fijo' },
      { valor: 'customsig', nombre: 'Cuadernillos de tamaños propios' },
    ],
  },
  {
    grupo: 'Diseños pequeños (varias páginas por hoja)',
    items: [
      { valor: 'A7_2_16s', nombre: '16 páginas por cara' },
      { valor: '8_zine', nombre: 'Zine de una hoja (8 páginas)' },
      { valor: '1_3rd', nombre: '6 páginas por cara' },
      { valor: 'a_3_6s', nombre: '18 páginas por cara' },
      { valor: 'a9_3_3_4', nombre: '20 páginas por cara' },
      { valor: 'a_4_8s', nombre: '32 páginas por cara' },
      { valor: 'a10_6_10s', nombre: '60 páginas por cara' },
    ],
  },
]
const esDisenoPequeno = computed(() =>
  tiposCuadernillo[1].items.some((i) => i.valor === ajustes.sigFormat),
)

const opcionesPapel = [
  { valor: 'duplex', nombre: 'Doble cara (en un solo archivo)' },
  { valor: 'single', nombre: 'Una cara (archivos separados)' },
]
const archivosGenerados = [
  { valor: 'both', nombre: 'Unificado y por cuadernillo' },
  { valor: 'aggregated', nombre: 'Solo el archivo unificado' },
  { valor: 'signatures', nombre: 'Solo los archivos por cuadernillo' },
]
const maquetaciones = [
  { valor: 'folio', nombre: 'In-folio · 2 páginas por cara' },
  { valor: 'quarto', nombre: 'En cuarto · 4 páginas por cara' },
  { valor: 'octavo', nombre: 'En octavo · 8 páginas por cara' },
  { valor: 'sextodecimo', nombre: 'Dieciseisavo · 16 páginas por cara' },
]
const escalas = [
  { valor: 'lockratio', nombre: 'Mantener proporciones' },
  { valor: 'centered', nombre: 'Tamaño original' },
  { valor: 'stretch', nombre: 'Estirar para llenar' },
]
const posiciones = [
  { valor: 'centered', nombre: 'Centrada' },
  { valor: 'binding_aligned', nombre: 'Pegada al lomo' },
]
const ubicacionCosido = [
  { valor: 'all', nombre: 'En el centro de cada folio' },
  { valor: 'only_out', nombre: 'Solo en el lomo' },
  { valor: 'only_in', nombre: 'Solo en el centro del cuadernillo' },
  { valor: 'in_n_out', nombre: 'En el lomo y en el centro' },
]

const medidaPersonalizada = computed(() => ajustes.paperSize === 'CUSTOM')

async function alElegirArchivo(evento) {
  const archivoElegido = evento.target.files?.[0]
  if (archivoElegido) await abrirArchivo(archivoElegido)
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <header class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <Book class="h-7 w-7 text-taller-acento" />
          Encuadernación
        </h1>
        <p class="mt-1 text-sm text-taller-suave">
          Sube un PDF y te lo dejo listo para imprimir y encuadernar a mano. Todo se calcula en tu navegador.
        </p>
      </div>
      <Button label="Restablecer ajustes" severity="secondary" outlined size="small" @click="restablecer">
        <template #icon><RefreshDouble class="h-4 w-4" /></template>
      </Button>
    </header>

    <Message v-if="error" severity="error" class="mb-4">{{ error }}</Message>

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- Columna principal: ajustes -->
      <div class="space-y-5 lg:col-span-2">
        <!-- 1. Archivo -->
        <section class="card">
          <h2 class="section-title"><Upload class="h-5 w-5" /> 1. Tu archivo</h2>
          <label class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-taller-linea bg-taller-fondo p-6 text-center hover:border-taller-acento">
            <Upload class="h-8 w-8 text-taller-acento" />
            <span class="text-sm font-medium">{{ hayArchivo ? 'Cambiar PDF' : 'Elige un PDF' }}</span>
            <span class="text-xs text-taller-suave">Se procesa en tu navegador; el archivo no se sube a ningún lado.</span>
            <input type="file" accept=".pdf,application/pdf" class="sr-only" @change="alElegirArchivo" />
          </label>
          <p v-if="hayArchivo" class="mt-3 flex items-center gap-2 text-sm text-green-700">
            <Check class="h-4 w-4" /> Páginas en el PDF: {{ resumen.paginasOriginal }}
          </p>

          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="rango" class="field-label">Páginas a usar <InfoTip texto="Opcional. Ejemplos: 1-8 o 1,3,5-7. Si lo dejas vacío se usan todas." /></label>
              <InputText id="rango" v-model="ajustes.pageRange" placeholder="Todas las páginas" class="w-full" />
            </div>
            <div>
              <label for="archivos" class="field-label">Archivos que quieres</label>
              <Select id="archivos" v-model="ajustes.printFile" :options="archivosGenerados" optionLabel="nombre" optionValue="valor" class="w-full" />
            </div>
          </div>
        </section>

        <!-- 2. Origen -->
        <section class="card">
          <h2 class="section-title"><Page class="h-5 w-5" /> 2. Orientación de las páginas</h2>
          <Select v-model="ajustes.sourceRotation" :options="origen" optionLabel="nombre" optionValue="valor" class="w-full" />
          <p class="mt-2 text-sm text-taller-suave">
            {{ origen.find((o) => o.valor === ajustes.sourceRotation)?.ayuda }}
          </p>
          <div class="mt-3 flex items-center gap-2">
            <Checkbox v-model="ajustes.rotatePage" binary inputId="alterna" />
            <label for="alterna" class="text-sm">Voltear por el lado largo (páginas alternas) <InfoTip texto="Útil cuando las páginas pares e impares se giran en direcciones opuestas." /></label>
          </div>
        </section>

        <!-- 3. Impresora -->
        <section class="card">
          <h2 class="section-title"><Printer class="h-5 w-5" /> 3. Tu impresora y papel</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="papel" class="field-label">Tamaño del papel</label>
              <Select id="papel" v-model="ajustes.paperSize" :options="tamanos" optionLabel="nombre" optionValue="valor" class="w-full" />
            </div>
            <template v-if="medidaPersonalizada">
              <div>
                <label for="ancho-papel" class="field-label">Ancho (puntos)</label>
                <InputNumber id="ancho-papel" v-model="ajustes.paperSizeCustomWidth" :min="0" locale="es-CL" class="w-full" />
              </div>
              <div>
                <label for="alto-papel" class="field-label">Alto (puntos) <InfoTip texto="Un punto = 1/72 de pulgada. Si tienes centímetros, multiplica por 28,35." /></label>
                <InputNumber id="alto-papel" v-model="ajustes.paperSizeCustomHeight" :min="0" locale="es-CL" class="w-full" />
              </div>
            </template>
            <div>
              <span class="field-label">Tipo de impresión</span>
              <div class="space-y-2">
                <div v-for="o in opcionesPapel" :key="o.valor" class="flex items-center gap-2">
                  <RadioButton v-model="ajustes.printerType" :inputId="`imp-${o.valor}`" :value="o.valor" />
                  <label :for="`imp-${o.valor}`" class="text-sm">{{ o.nombre }}</label>
                </div>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <Checkbox v-model="ajustes.paperRotation90" binary inputId="girar" />
              <label for="girar" class="text-sm">Girar el papel 90° (horizontal) <InfoTip texto="La maquetación es la misma, pero el papel queda acostado." /></label>
            </div>
          </div>
        </section>

        <!-- 4. Maquetación -->
        <section class="card">
          <h2 class="section-title"><ViewGrid class="h-5 w-5" /> 4. Cómo se acomoda en la hoja</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="maq" class="field-label">Páginas por cara</label>
              <Select id="maq" v-model="ajustes.pageLayout" :options="maquetaciones" optionLabel="nombre" optionValue="valor" class="w-full" />
            </div>
            <div>
              <label for="escala" class="field-label">Tamaño de las páginas</label>
              <Select id="escala" v-model="ajustes.pageScaling" :options="escalas" optionLabel="nombre" optionValue="valor" class="w-full" />
            </div>
            <div>
              <label for="pos" class="field-label">Posición</label>
              <Select id="pos" v-model="ajustes.pagePositioning" :options="posiciones" optionLabel="nombre" optionValue="valor" class="w-full" />
            </div>
          </div>
          <details class="mt-4 rounded-lg bg-taller-fondo p-3 text-sm">
            <summary class="cursor-pointer font-medium">Márgenes (en puntos)</summary>
            <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div><label class="field-label">Cabeza/pie</label><InputNumber v-model="ajustes.mainForeEdgePaddingPt" :min="0" locale="es-CL" class="w-full" /></div>
              <div><label class="field-label">Lomo</label><InputNumber v-model="ajustes.bindingEdgePaddingPt" :min="0" locale="es-CL" class="w-full" /></div>
              <div><label class="field-label">Arriba</label><InputNumber v-model="ajustes.topEdgePaddingPt" :min="0" locale="es-CL" class="w-full" /></div>
              <div><label class="field-label">Abajo</label><InputNumber v-model="ajustes.bottomEdgePaddingPt" :min="0" locale="es-CL" class="w-full" /></div>
            </div>
          </details>
        </section>

        <!-- 5. Cuadernillos -->
        <section class="card">
          <h2 class="section-title"><Settings class="h-5 w-5" /> 5. Cuadernillos</h2>
          <label for="tipo" class="field-label">Tipo de cuadernillo</label>
          <Select id="tipo" v-model="ajustes.sigFormat" :options="tiposCuadernillo" optionLabel="nombre" optionValue="valor" optionGroupLabel="grupo" optionGroupChildren="items" class="w-full" />

          <div v-if="ajustes.sigFormat === 'standardsig'" class="mt-4 max-w-xs">
            <label for="hojas" class="field-label">Hojas por cuadernillo <InfoTip texto="Cuántas hojas de papel tiene cada cuadernillo." /></label>
            <InputNumber id="hojas" v-model="ajustes.sigLength" :min="1" locale="es-CL" class="w-full" />
          </div>
          <div v-if="ajustes.sigFormat === 'customsig'" class="mt-4 max-w-xs">
            <label for="custom" class="field-label">Hojas de cada cuadernillo <InfoTip texto="Escríbelas separadas por comas, por ejemplo: 10, 10, 8." /></label>
            <InputText id="custom" v-model="ajustes.customSigLength" placeholder="10, 10, 8" class="w-full" />
          </div>

          <div v-if="esDisenoPequeno" class="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-taller-fondo p-3 sm:grid-cols-2">
            <div>
              <label class="field-label">Margen de la cabeza (puntos)</label>
              <InputNumber v-model="ajustes.foreEdgePaddingPt" :min="0" locale="es-CL" class="w-full" />
            </div>
            <div>
              <span class="field-label">Separación</span>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2"><RadioButton v-model="ajustes.wackySpacing" inputId="sp1" value="wacky_pack" /><label for="sp1">Compacta</label></div>
                <div class="flex items-center gap-2"><RadioButton v-model="ajustes.wackySpacing" inputId="sp2" value="wacky_gap" /><label for="sp2">Espacio distribuido</label></div>
              </div>
            </div>
          </div>

          <div class="mt-4 max-w-xs">
            <label for="guardas" class="field-label">Hojas de guarda <InfoTip texto="Páginas en blanco al inicio y al final del libro." /></label>
            <InputNumber id="guardas" v-model="ajustes.flyleafs" :min="0" locale="es-CL" class="w-full" />
          </div>
        </section>

        <!-- 6. Marcas -->
        <section class="card">
          <h2 class="section-title"><Scissor class="h-5 w-5" /> 6. Marcas de ayuda</h2>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-2"><Checkbox v-model="ajustes.cropMarks" binary inputId="m1" /><label for="m1" class="text-sm">Líneas de doblez <InfoTip texto="Guías para doblar, de la más gruesa a la más fina." /></label></div>
            <div class="flex items-center gap-2"><Checkbox v-model="ajustes.cutMarks" binary inputId="m2" /><label for="m2" class="text-sm">Líneas de corte</label></div>
            <div class="flex items-center gap-2"><Checkbox v-model="ajustes.pdfEdgeMarks" binary inputId="m3" /><label for="m3" class="text-sm">Marcas de arriba y abajo en el lomo</label></div>
            <div class="flex items-center gap-2"><Checkbox v-model="ajustes.sigOrderMarks" binary inputId="m4" /><label for="m4" class="text-sm">Orden de los cuadernillos en el lomo</label></div>
          </div>

          <div class="mt-4 rounded-lg bg-taller-fondo p-3">
            <div class="flex items-center justify-between">
              <label for="cosido" class="text-sm font-medium">Marcas para coser <InfoTip texto="Puntos donde se hacen los agujeros para coser el cuadernillo." /></label>
              <ToggleSwitch v-model="ajustes.sewingMarksEnabled" inputId="cosido" />
            </div>
            <div v-if="ajustes.sewingMarksEnabled" class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="field-label">Dónde dibujarlas</label>
                <Select v-model="ajustes.sewingMarkLocation" :options="ubicacionCosido" optionLabel="nombre" optionValue="valor" class="w-full" />
              </div>
              <div><label class="field-label">Margen (puntos)</label><InputNumber v-model="ajustes.sewingMarksMarginPt" :min="0" locale="es-CL" class="w-full" /></div>
              <div><label class="field-label">Cantidad de puntos</label><InputNumber v-model="ajustes.sewingMarksAmount" :min="1" locale="es-CL" class="w-full" /></div>
              <div><label class="field-label">Ancho de la cinta (puntos)</label><InputNumber v-model="ajustes.sewingMarksTapeWidthPt" :min="0" locale="es-CL" class="w-full" /></div>
            </div>
          </div>
        </section>
      </div>

      <!-- Columna lateral: resumen, vista previa y descarga -->
      <aside class="space-y-5">
        <section class="card sticky top-20">
          <h2 class="section-title"><Eye class="h-5 w-5" /> Resumen</h2>
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-lg bg-taller-fondo p-3"><dt class="text-taller-suave">Páginas del PDF</dt><dd class="text-lg font-semibold">{{ resumen.paginasOriginal || '—' }}</dd></div>
            <div class="rounded-lg bg-taller-fondo p-3"><dt class="text-taller-suave">Hojas a imprimir</dt><dd class="text-lg font-semibold">{{ resumen.hojas || '—' }}</dd></div>
            <div class="rounded-lg bg-taller-fondo p-3"><dt class="text-taller-suave">Cuadernillos</dt><dd class="text-lg font-semibold">{{ resumen.cuadernillos || '—' }}</dd></div>
            <div class="rounded-lg bg-taller-fondo p-3"><dt class="text-taller-suave">Páginas de salida</dt><dd class="text-lg font-semibold">{{ resumen.paginasSalida || '—' }}</dd></div>
          </dl>
          <p v-if="resumen.arreglo" class="mt-3 text-xs text-taller-suave">Hojas por cuadernillo: {{ resumen.arreglo }}</p>

          <div class="mt-5 flex flex-col gap-2">
            <Button label="Vista previa" severity="secondary" :disabled="!hayArchivo || ocupado" :loading="ocupado" @click="vistaPrevia">
              <template #icon><Eye class="h-4 w-4" /></template>
            </Button>
            <Button label="Generar y descargar ZIP" :disabled="!hayArchivo || ocupado" @click="generar">
              <template #icon><Download class="h-4 w-4" /></template>
            </Button>
          </div>
          <p v-if="!hayArchivo" class="mt-3 text-xs text-taller-suave">Sube un PDF para activar los botones.</p>
        </section>

        <section v-if="urlVista" class="card">
          <h2 class="section-title text-base">Vista previa</h2>
          <iframe :src="urlVista" title="Vista previa de la imposición" class="h-96 w-full rounded-lg border border-taller-linea" />
        </section>
      </aside>
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
</style>
