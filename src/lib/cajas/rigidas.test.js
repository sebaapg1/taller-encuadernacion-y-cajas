// Pruebas de las cajas rígidas forradas.
import { test, expect } from 'vitest'
import { piezasBandeja, piezasFunda, piezasCajaMagnetica, troquelRigido, dimensionesPlanas } from './rigidas.js'

const T = 2
const I = { largo: 100, ancho: 60, alto: 30 }

test('bandeja: fondo exterior = interior + 2 grosores', () => {
  const fondo = piezasBandeja(I, T)[0]
  expect(fondo.size[0]).toBe(104)
  expect(fondo.size[1]).toBe(64)
})

test('bandeja: paredes largas miden el largo exterior y la altura interior', () => {
  const [, frente] = piezasBandeja(I, T)
  expect(frente.size[0]).toBe(104)
  expect(frente.size[2]).toBe(30)
})

test('funda: paredes exteriores alrededor del interior', () => {
  const [frente, , izq] = piezasFunda(I, T)
  expect(frente.size[0]).toBe(104)
  expect(izq.size[1]).toBe(60)
})

test('caja magnética al ras: la tapa envuelve exactamente la caja', () => {
  const piezas = piezasCajaMagnetica(I, T, 0)
  const placa = piezas.find((p) => p.nombre === 'Tapa: placa superior')
  expect(placa.size[0]).toBe(104 + 2 * T)
  expect(placa.size[1]).toBe(64 + 2 * T)
})

test('caja magnética con holgura: la tapa queda más ancha', () => {
  const alRas = piezasCajaMagnetica(I, T, 0).find((p) => p.nombre === 'Tapa: placa superior')
  const holgada = piezasCajaMagnetica(I, T, 3).find((p) => p.nombre === 'Tapa: placa superior')
  expect(holgada.size[0] - alRas.size[0]).toBe(6)
})

test('dimensiones planas quitan el espesor del cartón', () => {
  expect(dimensionesPlanas({ size: [104, 64, T] }, T)).toEqual([104, 64])
  expect(dimensionesPlanas({ size: [T, 60, 30] }, T)).toEqual([60, 30])
})

test('troquel: cada pieza tiene su papel de forro alrededor', () => {
  const piezas = piezasBandeja(I, T)
  const troquel = troquelRigido(piezas, T, { margen: 15 })
  expect(troquel.rects.length).toBe(5)
  expect(troquel.rects[0].pw).toBe(104 + 30)
})

test('una sola medida exterior: la tapa mide la caja cerrada; la caja se reduce con holgura', () => {
  const t = 1.2
  const ext = { largo: 184, ancho: 124, alto: 62 }
  // Al ras: la caja contenedora ocupa todo el interior de la tapa.
  const alRas = { largo: ext.largo - 4 * t, ancho: ext.ancho - 4 * t, alto: ext.alto - t }
  const placa = piezasCajaMagnetica(alRas, t, 0).find((p) => p.nombre === 'Tapa: placa superior')
  expect(placa.size[0]).toBeCloseTo(ext.largo)
  expect(placa.size[1]).toBeCloseTo(ext.ancho)
  // Con holgura de 3 mm: la caja se reduce 6 mm por lado y la tapa conserva la medida exterior.
  const holgura = 3
  const conHolgura = { largo: ext.largo - 4 * t - 2 * holgura, ancho: ext.ancho - 4 * t - 2 * holgura, alto: ext.alto - t }
  const placa2 = piezasCajaMagnetica(conHolgura, t, holgura).find((p) => p.nombre === 'Tapa: placa superior')
  expect(placa2.size[0]).toBeCloseTo(ext.largo)
  expect(conHolgura.largo).toBeCloseTo(alRas.largo - 2 * holgura)
})
