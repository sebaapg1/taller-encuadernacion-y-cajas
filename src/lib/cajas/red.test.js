// Pruebas de la red de la caja: papel, cartón y cortes de esquina.
import { test, expect } from 'vitest'
import polygonClipping from 'polygon-clipping'
import { redParte, paredesBandeja, paredesFunda, paredesTapa } from './red.js'

// Área de un multipolígono: contorno exterior menos los huecos (los cortes de esquina son huecos).
const anillo = (ring) => {
  let a = 0
  for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]
  return Math.abs(a / 2)
}
const area = (mp) => polygonClipping.union(mp).reduce((s, poly) => s + anillo(poly[0]) - poly.slice(1).reduce((h, r) => h + anillo(r), 0), 0)

test('bandeja: el cartón es el fondo y las cuatro paredes, sin solaparse', () => {
  const paneles = paredesBandeja({ largo: 100, ancho: 60, alto: 30 }, 2)
  const r = redParte(paneles, 15)
  const suma = paneles.reduce((s, p) => s + p.w * p.h, 0)
  expect(area(r.carton)).toBeCloseTo(suma, 0)
})

test('bandeja: el papel es mayor que el cartón, pero con cortes en las esquinas', () => {
  const paneles = paredesBandeja({ largo: 100, ancho: 60, alto: 30 }, 2)
  const r = redParte(paneles, 15)
  const expandido = polygonClipping.union(...paneles.map((p) => [[[p.x - 15, p.y - 15], [p.x + p.w + 15, p.y - 15], [p.x + p.w + 15, p.y + p.h + 15], [p.x - 15, p.y + p.h + 15], [p.x - 15, p.y - 15]]]))
  expect(area(r.papel)).toBeGreaterThan(area(r.carton))
  expect(area(r.papel)).toBeLessThan(area(expandido))
})

test('funda y tapa: se desplegan como tiras con sus paredes', () => {
  expect(paredesFunda({ largo: 100, ancho: 60, alto: 30 }, 2).length).toBe(4)
  expect(paredesTapa({ largo: 100, ancho: 60, alto: 30 }, 2).length).toBe(4)
})

import { svgRed } from './red.js'
test('svgRed: dibuja cada parte con su papel en rojo y el cartón', () => {
  const svg = svgRed([{ nombre: 'Caja interior', paneles: paredesBandeja({ largo: 100, ancho: 60, alto: 30 }, 2) }], 15)
  expect(svg.startsWith('<svg')).toBe(true)
  expect(svg).toContain('Caja interior')
  expect(svg).toContain('Papel:')
})
