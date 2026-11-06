// Conecta el motor de imposición (src/lib/imposicion) con la interfaz de Vue.
// El motor no conoce el DOM: aquí solo se guardan ajustes, se recalcula y se
// pide la vista previa o el ZIP final.
import { reactive, ref, computed, watch } from 'vue'
import { Book } from '../lib/imposicion/book.js'
import { schema } from '../lib/imposicion/models/configuration.js'

const CLAVE_AJUSTES = 'taller.encuadernacion.ajustes'

function cargarAjustes() {
  try {
    const guardado = localStorage.getItem(CLAVE_AJUSTES)
    return schema.parse(guardado ? JSON.parse(guardado) : {})
  } catch {
    return schema.parse({})
  }
}

export function usarImposicion() {
  const ajustes = reactive(cargarAjustes())
  const archivo = ref(null)
  const resumen = reactive({
    paginasOriginal: 0,
    paginasProcesadas: 0,
    paginasSalida: 0,
    hojas: 0,
    cuadernillos: 0,
    arreglo: '',
  })
  const ocupado = ref(false)
  const error = ref('')
  const urlVista = ref('')

  const book = new Book(schema.parse({ ...ajustes }), { shareUrl: window.location.href })

  async function recalcular() {
    error.value = ''
    try {
      const cfg = schema.parse({ ...ajustes })
      book.update(cfg)
      localStorage.setItem(CLAVE_AJUSTES, JSON.stringify(cfg))
      if (!book.currentdoc) return
      await book.createpages()
      resumen.paginasOriginal = book.sourcePageCount ?? 0
      resumen.paginasProcesadas = book.pagecount ?? 0
      if (book.book) {
        resumen.hojas = book.book.sheets
        resumen.cuadernillos = book.book.sigconfig.length
        resumen.arreglo = book.book.sigconfig.join(', ')
        resumen.paginasSalida = book.book.pagelistdetails.reduce(
          (total, lista) => total + lista.reduce((t, sub) => t + (sub.length || 1), 0),
          0,
        )
      }
    } catch (e) {
      console.error(e)
      error.value = 'No pude preparar el PDF con estos ajustes. Revisa las medidas o el tipo de cuadernillo.'
    }
  }

  // Cada cambio recalcula, con una pausa corta para no hacerlo en cada tecla.
  let temporizador = null
  watch(
    ajustes,
    () => {
      clearTimeout(temporizador)
      temporizador = setTimeout(recalcular, 250)
    },
    { deep: true },
  )

  async function abrirArchivo(file) {
    archivo.value = file
    urlVista.value = ''
    error.value = ''
    try {
      await book.openpdf(file)
    } catch (e) {
      console.error(e)
      archivo.value = null
      error.value = 'Ese archivo no parece un PDF válido.'
      return
    }
    await recalcular()
  }

  async function vistaPrevia() {
    ocupado.value = true
    try {
      await recalcular()
      await book.createoutputfiles(true)
      urlVista.value = book.previewUrl ?? ''
    } catch (e) {
      console.error(e)
      error.value = 'No se pudo generar la vista previa.'
    } finally {
      ocupado.value = false
    }
  }

  async function generar() {
    ocupado.value = true
    try {
      await recalcular()
      await book.createoutputfiles(false)
    } catch (e) {
      console.error(e)
      error.value = 'No se pudo generar el ZIP.'
    } finally {
      ocupado.value = false
    }
  }

  function restablecer() {
    Object.assign(ajustes, schema.parse({}))
  }

  return {
    ajustes,
    archivo,
    resumen,
    ocupado,
    error,
    urlVista,
    hayArchivo: computed(() => archivo.value !== null),
    abrirArchivo,
    vistaPrevia,
    generar,
    restablecer,
  }
}
