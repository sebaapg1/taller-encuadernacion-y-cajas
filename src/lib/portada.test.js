// Pruebas del cálculo de portadas. Ejecutar con: npm test
import { test } from 'vitest'
import assert from 'node:assert/strict'
import { calcularPortada, aMm, lomoMm } from './portada.js'

const cerca = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} ≉ ${b}`)

const base = {
  anchoPaginaMm: 127,
  altoPaginaMm: 203.2,
  paginas: 200,
  papel: 'crema',
  sangrado: 3.175,
  envoltura: 15,
  margen: 3.175,
}

test('rústica crema: lomo = 0,0635 mm × páginas', () => {
  const r = calcularPortada({ ...base, formato: 'rustica' })
  cerca(r.lomo, 12.7)
  cerca(r.anchoTotal, 2 * 3.175 + 2 * 127 + 12.7)
  cerca(r.altoTotal, 2 * 3.175 + 203.2)
})

test('rústica: las guías del lomo quedan entre portada y contraportada', () => {
  const r = calcularPortada({ ...base, formato: 'rustica' })
  cerca(r.lomoBordes.izq, 3.175 + 127)
  cerca(r.lomoBordes.der - r.lomoBordes.izq, r.lomo)
  cerca(r.centros.contraportada, 3.175 + 63.5)
})

test('tapa dura blanca: fórmula empírica del lomo', () => {
  const lomo = lomoMm({ paginas: 200, formato: 'tapa', papel: 'blanco' })
  cerca(lomo, 0.0572 * 200 + 4.8)
})

test('tapa dura: ancho incluye envoltura, margen y bisagra', () => {
  const r = calcularPortada({ ...base, formato: 'tapa', papel: 'blanco', anchoPaginaMm: 152.4, altoPaginaMm: 228.6 })
  const esperado = 2 * 15 + 2 * 3.175 + 2 * 152.4 + 2 * 2 + (0.0572 * 200 + 4.8)
  cerca(r.anchoTotal, esperado)
  cerca(r.altoTotal, 2 * 15 + 2 * 3.175 + 228.6)
})

test('papel personalizado usa el grosor indicado', () => {
  const lomo = lomoMm({ paginas: 100, formato: 'rustica', papel: 'personalizado', grosorMm: 0.1 })
  cerca(lomo, 10)
})

test('conversión de unidades', () => {
  cerca(aMm(1, 'in'), 25.4)
  cerca(aMm(2, 'cm'), 20)
  cerca(aMm(10, 'mm'), 10)
})
