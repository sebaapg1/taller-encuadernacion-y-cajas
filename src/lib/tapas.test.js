// Pruebas de la calculadora de tapas. Ejecutar con: npm test
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { calcularTapa, MEDIDAS_INICIALES } from './tapas.js'

const cerca = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`)

test('medidas iniciales: valores calculados a mano', () => {
  const r = calcularTapa(MEDIDAS_INICIALES)
  cerca(r.anchoCarton, 143) // 150 − 10 + 3
  cerca(r.altoCarton, 236) // 230 + 2·3
  cerca(r.lomo, 25) // 20 + 2·2,5
  cerca(r.canal, 12.5) // 10 + 2,5
  cerca(r.anchoTela, 376) // 286 + 25 + 25 + 40
  cerca(r.altoTela, 276) // 236 + 40
})

test('el lomo crece con el grosor del bloque', () => {
  const a = calcularTapa({ ...MEDIDAS_INICIALES, grosorBloque: 10 })
  const b = calcularTapa({ ...MEDIDAS_INICIALES, grosorBloque: 30 })
  assert.ok(b.lomo > a.lomo)
  cerca(b.lomo - a.lomo, 20)
})

test('cambiar el margen de tela solo cambia la tela, no el cartón', () => {
  const a = calcularTapa(MEDIDAS_INICIALES)
  const b = calcularTapa({ ...MEDIDAS_INICIALES, margenTela: 30 })
  cerca(a.anchoCarton, b.anchoCarton)
  cerca(b.anchoTela - a.anchoTela, 20) // dos márgenes de 10 mm más
})
