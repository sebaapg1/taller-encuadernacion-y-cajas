// Cajas rígidas forradas: se arman con piezas de cartón rígido pegadas, no se pliegan
// desde una sola hoja. Medidas en mm. Dimensiones "interiores" = lo que cabe dentro.
// Código propio de Taller (MIT).

const r1 = (n) => Math.round(n * 10) / 10

/**
 * Bandeja (fondo + 4 paredes). `interior` = medidas por dentro de la bandeja.
 */
export function piezasBandeja(interior, t, prefijo = 'Bandeja') {
  const { largo: L, ancho: W, alto: H } = interior
  const oL = L + 2 * t
  const oW = W + 2 * t
  const oH = H + t // fondo + paredes
  return [
    { nombre: `${prefijo}: fondo`, size: [oL, oW, t], pos: [0, 0, -oH / 2 + t / 2] },
    { nombre: `${prefijo}: pared larga (frente)`, size: [oL, t, H], pos: [0, -(oW / 2 - t / 2), t / 2] },
    { nombre: `${prefijo}: pared larga (atrás)`, size: [oL, t, H], pos: [0, oW / 2 - t / 2, t / 2] },
    { nombre: `${prefijo}: pared corta (izq.)`, size: [t, W, H], pos: [-(oL / 2 - t / 2), 0, t / 2] },
    { nombre: `${prefijo}: pared corta (der.)`, size: [t, W, H], pos: [oL / 2 - t / 2, 0, t / 2] },
  ]
}

/**
 * Funda (manga) de 4 paredes, abierta arriba y abajo. `interior` = medidas por dentro de la funda.
 */
export function piezasFunda(interior, t, prefijo = 'Funda') {
  const { largo: L, ancho: W, alto: H } = interior
  const oL = L + 2 * t
  const oW = W + 2 * t
  return [
    { nombre: `${prefijo}: pared larga (frente)`, size: [oL, t, H], pos: [0, -(oW / 2 - t / 2), 0] },
    { nombre: `${prefijo}: pared larga (atrás)`, size: [oL, t, H], pos: [0, oW / 2 - t / 2, 0] },
    { nombre: `${prefijo}: pared corta (izq.)`, size: [t, W, H], pos: [-(oL / 2 - t / 2), 0, 0] },
    { nombre: `${prefijo}: pared corta (der.)`, size: [t, W, H], pos: [oL / 2 - t / 2, 0, 0] },
  ]
}

/**
 * Caja magnética forrada: bandeja + tapa envolvente (funda de la tapa + placa superior
 * + pestaña de cierre). `holgura` = 0 al ras; mayor = la tapa queda más ancha.
 */
export function piezasCajaMagnetica(interior, t, holgura = 0) {
  const { largo: L, ancho: W, alto: H } = interior
  const piezas = piezasBandeja(interior, t, 'Caja')

  // Tapa envolvente en C (como en las guías): placa superior, pared lateral del lomo,
  // placa inferior bajo la caja, y pestaña de cierre en el lado abierto.
  const oL = L + 2 * t + 2 * holgura + 2 * t // exterior de la tapa (= caja cerrada)
  const oW = W + 2 * t + 2 * holgura + 2 * t
  const alto = H + t // altura exterior de la caja cerrada
  const zArriba = alto / 2 + t / 2
  const zAbajo = -alto / 2 - t / 2
  const cierreH = alto * 0.7
  piezas.push(
    { nombre: 'Tapa: placa superior', size: [oL, oW, t], pos: [0, 0, zArriba] },
    { nombre: 'Tapa: pared lateral (lomo)', size: [oL, t, alto + 2 * t], pos: [0, oW / 2 - t / 2, 0] },
    { nombre: 'Tapa: placa inferior', size: [oL, oW, t], pos: [0, 0, zAbajo] },
  )
  // Pestaña de cierre con imán: se pliega desde la placa inferior hacia el lado abierto.
  piezas.push({ nombre: 'Tapa: pestaña de cierre (imán)', size: [oL, t, cierreH], pos: [0, -(oW / 2 + t / 2), zAbajo + cierreH / 2] })
  return piezas
}

/** Piezas de cada estilo rígido, por nombre de estilo. */
export function piezasEstilo(id, interior, t, holgura = 0) {
  if (id === 'magnetic-flap') return piezasCajaMagnetica(interior, t, holgura)
  if (id === 'two-piece-base') return piezasBandeja(interior, t, 'Bandeja')
  if (id === 'two-piece-lid') return piezasFunda(interior, t, 'Funda')
  return []
}

/** Dimensiones planas de una pieza (sin el espesor del cartón). */
export function dimensionesPlanas(pieza, t) {
  const dims = [...pieza.size]
  const i = dims.findIndex((d) => Math.abs(d - t) < 1e-9)
  if (i >= 0) dims.splice(i, 1)
  return [r1(dims[0]), r1(dims[1])]
}

/**
 * Troquel: cada pieza con su papel de forro (margen alrededor), en filas.
 */
export function troquelRigido(piezas, t, { margen = 15, separacion = 10, anchoMax = 640 } = {}) {
  const items = piezas
    .filter((p) => p.pos)
    .map((p) => {
      const [w, h] = dimensionesPlanas(p, t)
      return { nombre: p.nombre, w, h, pw: w + 2 * margen, ph: h + 2 * margen }
    })
  const rects = []
  let x = 0
  let y = 0
  let filaAlto = 0
  for (const it of items) {
    if (x > 0 && x + it.pw > anchoMax) {
      x = 0
      y += filaAlto + separacion
      filaAlto = 0
    }
    rects.push({ ...it, x, y })
    x += it.pw + separacion
    filaAlto = Math.max(filaAlto, it.ph)
  }
  const ancho = Math.max(0, ...rects.map((r) => r.x + r.pw))
  const alto = rects.length ? Math.max(...rects.map((r) => r.y + r.ph)) : 0
  return { ancho, alto, rects, margen }
}

/** SVG del troquel: contorno rojo del papel de forro y línea discontinua de la pieza. */
export function svgTroquelRigido(layout) {
  const { rects, margen, ancho, alto } = layout
  const fmt = (n) => (Math.round(n * 10) / 10).toString()
  const piezas = rects
    .map(
      (r) => `
  <rect x="${fmt(r.x + margen)}" y="${fmt(r.y + margen)}" width="${fmt(r.w)}" height="${fmt(r.h)}" fill="#fbf7ee" stroke="#1f2937" stroke-width="0.6" stroke-dasharray="3 2"/>
  <rect x="${fmt(r.x)}" y="${fmt(r.y)}" width="${fmt(r.pw)}" height="${fmt(r.ph)}" fill="none" stroke="#dc2626" stroke-width="0.8"/>
  <text x="${fmt(r.x + margen)}" y="${fmt(r.y + margen + 4)}" font-size="4" fill="#1f2937">${r.nombre}</text>`,
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 ${fmt(ancho + 10)} ${fmt(alto + 10)}" role="img" aria-label="Troquel de las piezas rígidas">${piezas}
</svg>`
}
