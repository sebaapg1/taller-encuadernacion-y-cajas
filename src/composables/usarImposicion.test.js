// @vitest-environment jsdom
// Prueba de integración: carga un PDF real, calcula el resumen y genera la vista previa.
import { describe, it, expect, beforeAll } from 'vitest'
import { PDFDocument } from '@cantoo/pdf-lib'
import { usarImposicion } from './usarImposicion.js'

// jsdom no implementa File.arrayBuffer(); el motor solo usa name y arrayBuffer().
async function pdfDePaginas(n, nombre = 'libro.pdf', bytesPersonalizados = null) {
  let bytes = bytesPersonalizados
  if (!bytes) {
    const doc = await PDFDocument.create()
    for (let i = 0; i < n; i++) doc.addPage([420, 595])
    bytes = await doc.save()
  }
  return { name: nombre, arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) }
}

describe('usarImposicion', () => {
  beforeAll(() => {
    // jsdom no implementa las URL de blob; la vista previa solo necesita una cadena.
    URL.createObjectURL = () => 'blob:prueba'
    URL.revokeObjectURL = () => {}
  })

  it('carga el PDF y calcula páginas, hojas y cuadernillos', async () => {
    const imp = usarImposicion()
    await imp.abrirArchivo(await pdfDePaginas(8))
    expect(imp.hayArchivo.value).toBe(true)
    expect(imp.resumen.paginasOriginal).toBe(8)
    expect(imp.resumen.hojas).toBeGreaterThan(0)
    expect(imp.resumen.cuadernillos).toBeGreaterThan(0)
    expect(imp.error.value).toBe('')
  })

  it('genera la vista previa', async () => {
    const imp = usarImposicion()
    await imp.abrirArchivo(await pdfDePaginas(8))
    await imp.vistaPrevia()
    expect(imp.urlVista.value).toBe('blob:prueba')
    expect(imp.error.value).toBe('')
  })

  it('avisa si el archivo no es un PDF', async () => {
    const imp = usarImposicion()
    await imp.abrirArchivo(await pdfDePaginas(0, 'x.pdf', new TextEncoder().encode('no soy pdf')))
    expect(imp.hayArchivo.value).toBe(false)
    expect(imp.error.value).toMatch(/PDF válido/)
  })
})
