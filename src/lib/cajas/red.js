// Red de una caja forrada: cada parte se dibuja desplegada (como una caja abierta a plano),
// con el papel de forro que la envuelve como una sola hoja, y los cortes de esquina.
// Usa polygon-clipping (MIT). Medidas en mm.
import polygonClipping from 'polygon-clipping'

const rect = (x, y, w, h) => [
  [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
    [x, y],
  ],
]

const area = (pts) => {
  let s = 0
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % pts.length]
    s += x1 * y2 - x2 * y1
  }
  return s / 2
}

const unit = ([x, y]) => {
  const l = Math.hypot(x, y)
  return l === 0 ? [0, 0] : [x / l, y / l]
}

/**
 * Calcula el papel de forro de una parte.
 * @param {{nombre:string,x:number,y:number,w:number,h:number}[]} paneles cartones en la red
 * @param {number} m margen de papel alrededor de cada cartón (sangría)
 */
export function redParte(paneles, m) {
  const carton = polygonClipping.union(...paneles.map((p) => rect(p.x, p.y, p.w, p.h)))
  let papel = polygonClipping.union(...paneles.map((p) => rect(p.x - m, p.y - m, p.w + 2 * m, p.h + 2 * m)))

  // Diagonales en los extremos de cada espacio de bisagra (margen del papel contra el espacio).
  for (const pl of paneles.pliegues || []) {
    const ends = [pl.from, pl.to]
    for (const e of ends) {
      const s = e === pl.from ? -1 : 1
      let tri
      if (pl.orient === 'h') {
        const y0 = pl.pos - pl.g / 2
        tri = [[e, y0], [e + s * m, y0], [e, y0 + pl.g], [e, y0]]
      } else {
        const x0 = pl.pos - pl.g / 2
        tri = [[x0, e], [x0, e + s * m], [x0 + pl.g, e], [x0, e]]
      }
      papel = polygonClipping.difference(papel, [[tri]])
    }
  }

  // Corte de esquina en cada vértice cóncavo del cartón: las dos solapas se encuentran en una diagonal.
  for (const poligono of carton) {
    const pts = poligono[0].slice(0, -1)
    const a = area(pts)
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const p = pts[(i - 1 + n) % n]
      const c = pts[i]
      const q = pts[(i + 1) % n]
      const giro = (c[0] - p[0]) * (q[1] - c[1]) - (c[1] - p[1]) * (q[0] - c[0])
      if (giro * a >= 0) continue // convexo: no lleva corte interior
      const u = unit([p[0] - c[0], p[1] - c[1]])
      const v = unit([q[0] - c[0], q[1] - c[1]])
      const tri = [
        [c[0] + m * u[0], c[1] + m * u[1]],
        [c[0] + m * (u[0] + v[0]), c[1] + m * (u[1] + v[1])],
        [c[0] + m * v[0], c[1] + m * v[1]],
        [c[0] + m * u[0], c[1] + m * u[1]],
      ]
      papel = polygonClipping.difference(papel, [[tri]])
    }
  }
  return { carton, papel, paneles, margen: m }
}

/**
 * Bandeja (caja interior) desplegada. Cada bisagra deja un espacio igual al grosor del cartón
 * (g = t): el panel doblado no empuja al fondo y se cierra sin forzar el cartón.
 * Los pliegues se guardan en `.pliegues` para cortar las diagonales de esquina.
 */
export function paredesBandeja(interior, t) {
  const { largo: L, ancho: W, alto: H } = interior
  const g = t
  const Lo = L + 2 * t
  const Wo = W + 2 * t
  const paneles = [
    { nombre: 'Fondo', x: 0, y: 0, w: Lo, h: Wo },
    { nombre: 'Pared larga', x: 0, y: Wo + g, w: Lo, h: H },
    { nombre: 'Pared larga', x: 0, y: -(g + H), w: Lo, h: H },
    { nombre: 'Pared corta', x: -(g + H), y: t, w: H, h: W },
    { nombre: 'Pared corta', x: Lo + g, y: t, w: H, h: W },
  ]
  paneles.pliegues = [
    { orient: 'h', pos: Wo + g / 2, from: 0, to: Lo, g },
    { orient: 'h', pos: -g / 2, from: 0, to: Lo, g },
    { orient: 'v', pos: -g / 2, from: t, to: t + W, g },
    { orient: 'v', pos: Lo + g / 2, from: t, to: t + W, g },
  ]
  return paneles
}

/** Funda (manga) desplegada: cuatro paredes en tira. */
export function paredesFunda(interior, t) {
  const { largo: L, ancho: W, alto: H } = interior
  const oL = L + 2 * t
  const oW = W + 2 * t
  return [
    { nombre: 'Pared larga', x: 0, y: 0, w: oL, h: H },
    { nombre: 'Pared corta', x: oL, y: 0, w: oW, h: H },
    { nombre: 'Pared larga', x: oL + oW, y: 0, w: oL, h: H },
    { nombre: 'Pared corta', x: 2 * oL + oW, y: 0, w: oW, h: H },
  ]
}

/**
 * Tapa envolvente desplegada en C: placa superior, pared lateral (lomo), placa inferior y
 * pestaña de cierre, en columna. Cada bisagra deja un espacio igual al grosor del cartón.
 */
export function paredesTapa(interior, t, holgura = 0) {
  const { largo: L, ancho: W, alto: H } = interior
  const g = t
  const oL = L + 2 * t + 2 * holgura + 2 * t
  const oW = W + 2 * t + 2 * holgura + 2 * t
  const oH = H + t
  const yLat = oW + g
  const hLat = oH + 2 * t
  const yInf = yLat + hLat + g
  const yCie = yInf + oW + g
  const paneles = [
    { nombre: 'Placa superior', x: 0, y: 0, w: oL, h: oW },
    { nombre: 'Pared lateral (lomo)', x: 0, y: yLat, w: oL, h: hLat },
    { nombre: 'Placa inferior', x: 0, y: yInf, w: oL, h: oW },
    { nombre: 'Pestaña de cierre', x: 0, y: yCie, w: oL, h: oH * 0.7 },
  ]
  paneles.pliegues = [
    { orient: 'h', pos: oW + g / 2, from: 0, to: oL, g },
    { orient: 'h', pos: yLat + hLat + g / 2, from: 0, to: oL, g },
    { orient: 'h', pos: yInf + oW + g / 2, from: 0, to: oL, g },
  ]
  return paneles
}

// Atributos SVG: punto decimal. Textos visibles: coma decimal.
const num = (n) => (Math.round(n * 100) / 100).toString()
const fmt = (n) => num(n).replace('.', ',')
// Grosor del espacio de doblez de una parte (el primer pliegue).
const grosor = (r) => (r.paneles.pliegues && r.paneles.pliegues[0] ? r.paneles.pliegues[0].g : 0)
const ruta = (poligonos) =>
  poligonos
    .map((poly) =>
      poly
        .map((ring) => 'M ' + ring.slice(0, -1).map(([x, y]) => `${num(x)} ${num(y)}`).join(' L ') + ' Z')
        .join(' '),
    )
    .join(' ')

const caja = (poligonos) => {
  const xs = []
  const ys = []
  for (const poly of poligonos) for (const [x, y] of poly[0]) (xs.push(x), ys.push(y))
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }
}

/**
 * Detalle ampliado de una esquina de bisagra: espacio, sangría y corte diagonal, con medidas.
 * (u, v) son coordenadas en mm respecto al extremo del espacio de bisagra.
 */
function detalleEsquina(pl, m, bx, by, K) {
  const g = pl.g
  const ancho = (m + 8 + 16) * K
  const alto = 28 * K
  const X = (u) => bx + (u + m + 8) * K
  const Y = (v) => by + (v + 14) * K
  const rect = (u0, v0, u1, v1, fill, extra = '') =>
    `<rect x="${num(X(u0))}" y="${num(Y(v0))}" width="${num((u1 - u0) * K)}" height="${num((v1 - v0) * K)}" fill="${fill}" ${extra}/>`
  return `<g>
    <rect x="${num(bx)}" y="${num(by)}" width="${num(ancho)}" height="${num(alto)}" fill="#ffffff" stroke="#e5e7eb" stroke-width="0.5"/>
    ${rect(-m, -14, 16, 14, '#fff7ed')}
    ${rect(0, -14, 16, -g / 2, '#e7d8bd', 'stroke="#1f2937" stroke-width="0.4"')}
    ${rect(0, g / 2, 16, 14, '#e7d8bd', 'stroke="#1f2937" stroke-width="0.4"')}
    ${rect(-(m + 8), -g / 2, 16, g / 2, '#bfdbfe', 'opacity="0.85"')}
    <line x1="${num(X(-m))}" y1="${num(Y(-g / 2))}" x2="${num(X(0))}" y2="${num(Y(g / 2))}" stroke="#dc2626" stroke-width="0.9"/>
    <text x="${num(X(-m / 2))}" y="${num(Y(-g / 2 - 3))}" font-size="4" text-anchor="middle" fill="#dc2626">corte ${fmt(m)} mm</text>
    <text x="${num(X(-m - 6))}" y="${num(Y(0))}" font-size="4" fill="#dc2626" text-anchor="end">sangría ${fmt(m)}</text>
    <text x="${num(X(8))}" y="${num(Y(0) + 1.5)}" font-size="4" text-anchor="middle" fill="#1e3a8a">espacio ${fmt(g)} mm</text>
    <text x="${num(X(8))}" y="${num(Y(-7))}" font-size="4" text-anchor="middle" fill="#1f2937">cartón</text>
    <text x="${num(bx + 2)}" y="${num(by + 6)}" font-size="5" font-weight="700" fill="#1f2937">Detalle de esquina (ampliado ${K}×)</text>
  </g>`
}

/**
 * Dibujo de las partes desplegadas, una al lado de la otra, cada una con su papel de forro.
 * @param {{nombre:string, paneles:object[]}[]} partes
 */
export function svgRed(partes, m) {
  const separacion = 60
  let cursor = 0
  let alto = 0
  const bloques = partes.map((parte) => {
    const r = redParte(parte.paneles, m)
    const b = caja(r.papel)
    const ancho = b.x1 - b.x0
    const altoParte = b.y1 - b.y0
    const dx = cursor - b.x0
    const dy = -b.y0 + 40
    cursor += ancho + separacion
    alto = Math.max(alto, altoParte + 60)
    return { parte, r, b, dx, dy, ancho, altoParte }
  })
  const total = cursor - separacion
  const pintados = bloques
    .map(({ parte, r, b, dx, dy, ancho, altoParte }) => {
      const paneles = r.paneles
        .map(
          (p) =>
            `<rect x="${num(p.x)}" y="${num(p.y)}" width="${num(p.w)}" height="${num(p.h)}" fill="none" stroke="#1f2937" stroke-width="0.5" stroke-dasharray="3 2"/>
      <text x="${num(p.x + p.w / 2)}" y="${num(p.y + p.h / 2 - 2)}" font-size="5" text-anchor="middle" fill="#1f2937">${p.nombre}</text>
      <text x="${num(p.x + p.w / 2)}" y="${num(p.y + p.h / 2 + 4)}" font-size="4" text-anchor="middle" fill="#64748b">${fmt(p.w)} × ${fmt(p.h)} mm</text>`,
        )
        .join('\n      ')
      return `<g transform="translate(${num(dx)} ${num(dy)})">
      <path d="${ruta(r.papel)}" fill="#fff7ed" fill-rule="evenodd" stroke="#dc2626" stroke-width="1.1"/>
      <path d="${ruta(r.carton)}" fill="#e7d8bd" stroke="#1f2937" stroke-width="0.9"/>
      ${(r.paneles.pliegues || []).map((pl) => {
        const x = pl.orient === 'h' ? pl.from : pl.pos - pl.g / 2
        const y = pl.orient === 'h' ? pl.pos - pl.g / 2 : pl.from
        const w = pl.orient === 'h' ? pl.to - pl.from : pl.g
        const h = pl.orient === 'h' ? pl.g : pl.to - pl.from
        const linea = pl.orient === 'h'
          ? `M ${num(pl.from)} ${num(pl.pos)} L ${num(pl.to)} ${num(pl.pos)}`
          : `M ${num(pl.pos)} ${num(pl.from)} L ${num(pl.pos)} ${num(pl.to)}`
        return `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" fill="#bfdbfe" opacity="0.85"/>
      <path d="${linea}" stroke="#1e3a8a" stroke-width="0.6" stroke-dasharray="2 1.5" fill="none"/>`
      }).join('\n      ')}
      ${paneles}
      ${(r.paneles.pliegues || []).map((pl, i) => {
        // Cota del espacio de bisagra: línea de medida a un lado, con su valor.
        const yc = pl.pos
        const xs = pl.from
        const ox = pl.orient === 'h' ? xs - 14 : pl.pos + 14
        const oy = pl.orient === 'h' ? yc : pl.from - 14
        const txt = `espacio ${fmt(pl.g)} mm`
        return `<line x1="${num(pl.orient === 'h' ? xs : pl.pos)}" y1="${num(pl.orient === 'h' ? yc : pl.from)}" x2="${num(ox)}" y2="${num(oy)}" stroke="#1e3a8a" stroke-width="0.4"/>
      <text x="${num(ox - (pl.orient === 'h' ? 2 : -2))}" y="${num(oy - 1)}" font-size="4" text-anchor="${pl.orient === 'h' ? 'end' : 'start'}" fill="#1e3a8a">${i === 0 ? txt : ''}</text>`
      }).join('\n      ')}
      ${(r.paneles.pliegues || []).map((pl) => {
        // Corte diagonal de cada extremo, trazado en rojo con su medida.
        return [pl.from, pl.to].map((e) => {
          const s = e === pl.from ? -1 : 1
          if (pl.orient !== 'h') return ''
          const y0 = pl.pos - pl.g / 2
          return `<line x1="${num(e + s * r.margen)}" y1="${num(y0)}" x2="${num(e)}" y2="${num(y0 + pl.g)}" stroke="#dc2626" stroke-width="0.9"/>`
        }).join('')
      }).join('')}
      <text x="${num(b.x0 + ancho / 2)}" y="${num(b.y0 - 14)}" font-size="8" font-weight="700" text-anchor="middle" fill="#1f2937">${parte.nombre}</text>
      <text x="${num(b.x0 + ancho / 2)}" y="${num(b.y1 + 22)}" font-size="5" text-anchor="middle" fill="#1e3a8a">Franja azul: espacio de doblez = grosor del cartón (${fmt(grosor(r))} mm)</text>
      <text x="${num(b.x0 + ancho / 2)}" y="${num(b.y1 + 16)}" font-size="6" text-anchor="middle" fill="#dc2626">Papel: ${fmt(ancho)} × ${fmt(altoParte)} mm (sangría ${fmt(m)} mm)</text>
    </g>`
    })
    .join('\n    ')
  const primera = partes[0] && partes[0].paneles.pliegues && partes[0].paneles.pliegues[0]
  const K = 7
  const detalleX = total + 60
  const detalle = primera ? detalleEsquina(primera, m, detalleX, 20, K) : ''
  const anchoTotal = primera ? detalleX + (m + 8 + 16) * K + 20 : total + 40
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 ${num(anchoTotal)} ${num(Math.max(alto + 40, 240))}" role="img" aria-label="Red de las partes de la caja con su papel de forro">
    ${pintados}
    ${detalle}
  </svg>`
}
