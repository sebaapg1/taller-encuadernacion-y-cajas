// Pruebas de las medidas de la caja de dos piezas.
import { test, expect } from 'vitest'
import { medidasCaja, VALORES_BASE } from './medidasObjeto.js'

test('bandeja: lado largo = largo del objeto; superior/inferior = ancho − grosor', () => {
  const r = medidasCaja({ largo: 100, ancho: 60, alto: 20 }, VALORES_BASE)
  expect(r.bandeja.ladoLargo).toBe(100)
  expect(r.bandeja.ladoSuperiorInferior).toBeCloseTo(60 - 2.4)
})

test('bandeja interior: objeto + 2 grosores + holgura', () => {
  const r = medidasCaja({ largo: 100, ancho: 60, alto: 20 }, VALORES_BASE)
  expect(r.bandeja.interior.largo).toBeCloseTo(100 + 2 * 2.4 + 2.5)
  expect(r.bandeja.interior.ancho).toBeCloseTo(60 + 2 * 2.4 + 2.5)
})

test('folder exterior: sobre la bandeja, con espina y solapa', () => {
  const r = medidasCaja({ largo: 100, ancho: 60, alto: 20 }, VALORES_BASE)
  expect(r.folder.largo).toBeCloseTo(r.bandeja.interior.largo + 2 * 2.4)
  expect(r.folder.espina).toBe(3)
  expect(r.folder.solapa).toBe(6)
})
