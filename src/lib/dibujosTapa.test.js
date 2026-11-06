// Pruebas de los dibujos de la calculadora de tapas.
import { test, expect } from 'vitest'
import { calcularTapa, MEDIDAS_INICIALES } from './tapas.js'
import { svgCorte, svgPlano, svgLomo } from './dibujosTapa.js'

const t = calcularTapa(MEDIDAS_INICIALES)

test('el plano muestra el ancho total de la tela con coma decimal', () => {
  const svg = svgPlano(t)
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg).toContain('376 mm')
  expect(svg).toContain('276 mm')
})

test('el lomo muestra sus tres estados y la tela', () => {
  const svg = svgLomo(t)
  expect(svg).toContain('1 · Cerrado')
  expect(svg).toContain('2 · A medio abrir')
  expect(svg).toContain('3 · Abierto plano')
  expect(svg).toContain('lomo 25')
})

test('el corte muestra el grosor del cartón y del bloque', () => {
  const svg = svgCorte(t)
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg).toContain('2,5 mm de cartón')
  expect(svg).toContain('20 mm')
})
