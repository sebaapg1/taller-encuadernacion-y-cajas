<script setup>
import { reactive, computed } from 'vue'
import InfoTip from '../components/InfoTip.vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { calcularPortada, aMm, PAPEL, UNIDADES, TAMANOS } from '../lib/portada.js'

const datos = reactive({
  tamano: 1, // índice en TAMANOS
  anchoPagina: 127,
  altoPagina: 203.2,
  paginas: 200,
  formato: 'rustica',
  papel: 'crema',
  grosor: 0.1,
  sangrado: 3.175,
  envoltura: 15,
  margen: 3.175,
  unidad: 'mm',
})

function aplicarTamano(i) {
  datos.tamano = i
  datos.anchoPagina = TAMANOS[i].anchoMm
  datos.altoPagina = TAMANOS[i].altoMm
}

const opcionesTamano = TAMANOS.map((t, i) => ({ valor: i, nombre: t.nombre }))
const opcionesPapel = [
  { valor: 'crema', nombre: PAPEL.crema.nombre },
  { valor: 'blanco', nombre: PAPEL.blanco.nombre },
  { valor: 'personalizado', nombre: 'Otro grosor' },
]

const esTapa = computed(() => datos.formato === 'tapa')
const resultado = computed(() =>
  calcularPortada({
    anchoPaginaMm: aMm(datos.anchoPagina, 'mm'),
    altoPaginaMm: aMm(datos.altoPagina, 'mm'),
    paginas: Math.max(1, Math.round(datos.paginas || 0)),
    formato: datos.formato,
    papel: datos.papel,
    grosorMm: datos.grosor,
    sangrado: datos.sangrado,
    envoltura: datos.envoltura,
    margen: datos.margen,
  }),
)

const fmt = (mm) => {
  const u = UNIDADES[datos.unidad]
  return (mm * u.factor).toFixed(u.decimales).replace('.', ',')
}

// Escala para dibujar el esquema: el dibujo siempre usa mm.
const vista = computed(() => `0 0 ${resultado.value.anchoTotal} ${resultado.value.altoTotal}`)
const r = computed(() => resultado.value)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <header class="mb-5 text-center">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Portada para imprimir</h1>
      <p class="mt-1 text-sm text-taller-suave">
        Calcula el tamaño total del archivo de portada: ancho, alto, lomo y las guías de corte.
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <!-- Formulario -->
      <section class="space-y-5 rounded-xl bg-taller-tarjeta p-5 shadow-sm ring-1 ring-taller-linea lg:col-span-2">
        <div>
          <label for="tamano" class="block text-sm font-medium">Tamaño del libro</label>
          <Select id="tamano" class="mt-1 w-full" :modelValue="datos.tamano" :options="opcionesTamano" optionLabel="nombre" optionValue="valor" @update:modelValue="aplicarTamano" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="ancho" class="block text-sm font-medium">Ancho de página (mm)</label>
            <InputNumber id="ancho" v-model="datos.anchoPagina" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
          </div>
          <div>
            <label for="alto" class="block text-sm font-medium">Alto de página (mm)</label>
            <InputNumber id="alto" v-model="datos.altoPagina" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
          </div>
        </div>

        <div>
          <label for="paginas" class="block text-sm font-medium">
            Número de páginas
            <InfoTip texto="Cuenta solo las hojas interiores; no incluyas la portada ni la contraportada." />
          </label>
          <InputNumber id="paginas" v-model="datos.paginas" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
        </div>

        <fieldset>
          <legend class="text-sm font-medium">Tipo de libro</legend>
          <div class="mt-2 flex gap-4 text-sm">
            <label class="flex items-center gap-2"><input v-model="datos.formato" type="radio" value="rustica" /> Rústica</label>
            <label class="flex items-center gap-2"><input v-model="datos.formato" type="radio" value="tapa" /> Tapa dura</label>
          </div>
        </fieldset>

        <div>
          <label for="papel" class="block text-sm font-medium">
            Papel
            <InfoTip texto="El grosor de cada hoja cambia cuánto mide el lomo. Usa el papel que vas a comprar." />
          </label>
          <Select id="papel" v-model="datos.papel" :options="opcionesPapel" optionLabel="nombre" optionValue="valor" class="mt-1 w-full" />
          <div v-if="datos.papel === 'personalizado'" class="mt-2">
            <label for="grosor" class="block text-sm">Grosor por hoja (mm)</label>
            <InputNumber id="grosor" v-model="datos.grosor" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
          </div>
        </div>

        <div v-if="!esTapa">
          <label for="sangrado" class="block text-sm font-medium">
            Sangrado (mm)
            <InfoTip texto="Margen extra que se imprime más allá del corte, para que no queden bordes blancos." />
          </label>
          <InputNumber id="sangrado" v-model="datos.sangrado" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div>
            <label for="envoltura" class="block text-sm font-medium">
              Envoltura (mm)
              <InfoTip texto="Cuánta tela o papel de la portada se dobla hacia dentro de la tapa." />
            </label>
            <InputNumber id="envoltura" v-model="datos.envoltura" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
          </div>
          <div>
            <label for="margen" class="block text-sm font-medium">Margen de la tapa (mm)</label>
            <InputNumber id="margen" v-model="datos.margen" :minFractionDigits="0" :maxFractionDigits="2" locale="es-CL" class="mt-1 w-full" />
          </div>
        </div>

        <div>
          <span class="block text-sm font-medium">Mostrar resultados en</span>
          <div class="mt-2 flex gap-4 text-sm">
            <label v-for="(u, clave) in UNIDADES" :key="clave" class="flex items-center gap-2">
              <input v-model="datos.unidad" type="radio" :value="clave" /> {{ u.nombre }}
            </label>
          </div>
        </div>
      </section>

      <!-- Resultados y esquema -->
      <section class="space-y-4 lg:col-span-3">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-xl bg-taller-tarjeta p-4 shadow-sm ring-1 ring-taller-linea">
            <p class="text-xs text-taller-suave">Ancho total</p>
            <p class="mt-1 text-lg font-semibold">{{ fmt(r.anchoTotal) }}</p>
          </div>
          <div class="rounded-xl bg-taller-tarjeta p-4 shadow-sm ring-1 ring-taller-linea">
            <p class="text-xs text-taller-suave">Alto total</p>
            <p class="mt-1 text-lg font-semibold">{{ fmt(r.altoTotal) }}</p>
          </div>
          <div class="rounded-xl bg-taller-tarjeta p-4 shadow-sm ring-1 ring-taller-linea">
            <p class="text-xs text-taller-suave">Lomo</p>
            <p class="mt-1 text-lg font-semibold">{{ fmt(r.lomo) }}</p>
          </div>
          <div class="rounded-xl bg-taller-tarjeta p-4 shadow-sm ring-1 ring-taller-linea">
            <p class="text-xs text-taller-suave">Tamaño de página</p>
            <p class="mt-1 text-sm font-semibold">{{ fmt(aMm(datos.anchoPagina, 'mm')) }} × {{ fmt(aMm(datos.altoPagina, 'mm')) }}</p>
          </div>
        </div>

        <div class="rounded-xl bg-taller-tarjeta p-4 shadow ring-1 ring-taller-linea">
          <h2 class="mb-3 text-sm font-semibold">Esquema de la portada</h2>
          <svg :viewBox="vista" class="h-auto w-full" role="img" aria-label="Esquema de la portada con guías de corte, lomo y centros">
            <rect x="0" y="0" :width="r.anchoTotal" :height="r.altoTotal" fill="#f5f3ee" stroke="#2b2622" :stroke-width="r.anchoTotal / 400" />
            <!-- Lomo -->
            <rect :x="r.lomoBordes.izq" y="0" :width="r.lomo" :height="r.altoTotal" fill="#fef3c7" />
            <!-- Zona de corte (bordes) -->
            <rect :x="r.bordes.izq" :y="r.bordes.sup" :width="r.bordes.der - r.bordes.izq" :height="r.bordes.inf - r.bordes.sup" fill="none" stroke="#dc2626" :stroke-width="r.anchoTotal / 500" stroke-dasharray="4 3" />
            <!-- Centros y tercios -->
            <line :x1="r.centros.contraportada" y1="0" :x2="r.centros.contraportada" :y2="r.altoTotal" stroke="#16a34a" :stroke-width="r.anchoTotal / 500" stroke-dasharray="2 3" />
            <line :x1="r.centros.portada" y1="0" :x2="r.centros.portada" :y2="r.altoTotal" stroke="#16a34a" :stroke-width="r.anchoTotal / 500" stroke-dasharray="2 3" />
            <line :x1="r.lomoBordes.izq" y1="0" :x2="r.lomoBordes.izq" :y2="r.altoTotal" stroke="#2563eb" :stroke-width="r.anchoTotal / 500" />
            <line :x1="r.lomoBordes.der" y1="0" :x2="r.lomoBordes.der" :y2="r.altoTotal" stroke="#2563eb" :stroke-width="r.anchoTotal / 500" />
            <text :x="r.lomoBordes.izq + r.lomo / 2" :y="r.altoTotal / 2" :font-size="r.anchoTotal / 35" text-anchor="middle" dominant-baseline="middle" :transform="`rotate(-90 ${r.lomoBordes.izq + r.lomo / 2} ${r.altoTotal / 2})`" fill="#2b2622">lomo</text>
          </svg>
          <p class="mt-2 text-xs text-taller-suave">
            Línea discontinua roja: límite de corte. Líneas azules: bordes del lomo. Líneas verdes: centro de cada tapa.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
