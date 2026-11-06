// Dibujos planos de la calculadora de tapas duras. Se generan desde las medidas.
// Estilo: contornos definidos y relleno plano, sin degradados ni sombras.
// Código propio, licencia MIT (ver LICENSE-TAPAS).

const f = (n) => (Math.round(n * 10) / 10).toString().replace('.', ',')

const C = {
  linea: '#1f2937',
  tela: '#f3dcb8', // tela del lomo
  telaVuelta: '#e7c592', // vueltas de la tela
  tapa: '#9fb8cc', // cartón
  pagina: '#fbf7ee', // bloque de páginas
  paginaLinea: '#cfc4ae',
  bisagra: '#d1603d', // acento de la bisagra
  cota: '#1f2937',
  nota: '#64748b',
}

const flechas = `
  <marker id="fI" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M10 0 L0 5 L10 10 z" fill="${C.cota}"/></marker>
  <marker id="fF" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.cota}"/></marker>`

// Cota con flechas. `girar` escribe el texto en vertical.
function cota(x1, y1, x2, y2, texto, { girar = false, dx = 0, dy = 0 } = {}) {
  const mx = (x1 + x2) / 2 + dx
  const my = (y1 + y2) / 2 + dy
  const rot = girar ? ` transform="rotate(-90 ${mx} ${my})"` : ''
  const w = texto.length * 8.4 + 10
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.cota}" stroke-width="1.4" marker-start="url(#fI)" marker-end="url(#fF)"/>
  <g${rot}>
    <rect x="${mx - w / 2}" y="${my - 10}" width="${w}" height="20" rx="4" fill="#ffffff"/>
    <text x="${mx}" y="${my}" font-size="14" font-weight="700" fill="${C.cota}" text-anchor="middle" dominant-baseline="middle">${texto}</text>
  </g>`
}

const rect = (x, y, w, h, fill, extra = '') =>
  `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" fill="${fill}" stroke="${C.linea}" stroke-width="1.8" ${extra}/>`
const f2 = (n) => Math.round(n * 100) / 100

/**
 * Corte transversal: el libro visto desde la cabeza.
 * Horizontal = ancho de página; vertical = grosor del libro (exagerado para leerse).
 */
export function svgCorte(t) {
  const k = 330 / t.ancho
  const c = Math.max(t.carton * k, 9)
  const b = Math.max(t.bloque * k, 64)
  const H = b + 2 * c
  const x0 = 24
  const W = t.ancho * k
  const xf = x0 + W
  const y0 = 40
  const canal = Math.min(t.canal * k, W * 0.2)
  const r = Math.min(H / 2, 30)
  const xp = x0 + canal * 0.5

  const tela = `M ${x0 + r} ${y0} L ${xf} ${y0} L ${xf} ${y0 + H} L ${x0 + r} ${y0 + H} A ${r} ${r} 0 0 1 ${x0} ${y0 + H - r} L ${x0} ${y0 + r} A ${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`
  const lineas = []
  for (let i = 1; i < 16; i++) {
    const y = y0 + c + (b * i) / 16
    lineas.push(`<line x1="${xp}" y1="${y}" x2="${xf - 2}" y2="${y}" stroke="${C.paginaLinea}" stroke-width="1"/>`)
  }

  const cx = xf + 58
  const filas = [
    { titulo: 'Tapa superior', valor: `${f(t.carton)} mm de cartón`, y: y0 + c / 2 },
    { titulo: 'Bloque de páginas', valor: `${f(t.bloque)} mm`, y: y0 + H / 2 },
    { titulo: 'Tapa inferior', valor: `${f(t.carton)} mm de cartón`, y: y0 + H - c / 2 },
  ]
  const yCentro = y0 + H / 2
  const etiquetas = filas
    .map((fila, i) => {
      const yl = yCentro + (i - 1) * 50
      return `<path d="M ${xf - 16} ${fila.y} L ${cx - 8} ${yl}" fill="none" stroke="${C.cota}" stroke-width="1.2"/>
  <circle cx="${xf - 16}" cy="${fila.y}" r="2.6" fill="${C.cota}"/>
  <text x="${cx}" y="${yl - 2}" font-size="15" font-weight="700" fill="${C.linea}">${fila.titulo}</text>
  <text x="${cx}" y="${yl + 16}" font-size="13" fill="${C.nota}">${fila.valor}</text>`
    })
    .join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cx + 170} 260" role="img" aria-label="Corte transversal del libro con tapas, lomo y bloque de páginas">
  <defs>${flechas}</defs>
  <path d="${tela}" fill="${C.tela}" stroke="${C.linea}" stroke-width="1.8"/>
  <rect x="${xp}" y="${y0 + c}" width="${xf - xp - 2}" height="${b}" fill="${C.pagina}"/>
  ${lineas.join('\n  ')}
  ${rect(xp, y0, xf - xp - 1, c, C.tapa)}
  ${rect(xp, y0 + H - c, xf - xp - 1, c, C.tapa)}
  <line x1="${x0 + canal}" y1="${y0 + c}" x2="${x0 + canal}" y2="${y0 + H - c}" stroke="${C.bisagra}" stroke-width="2.4" stroke-dasharray="5 4"/>
  ${etiquetas}
  <text x="${x0}" y="${y0 + H + 34}" font-size="13" font-weight="700" fill="${C.bisagra}">Lomo ${f(t.lomo)} mm · canal ${f(t.canal)} mm</text>
  <text x="${x0}" y="${y0 + H + 52}" font-size="12" fill="${C.nota}">Dibujo ilustrativo: los grosores están exagerados para verlos.</text>
</svg>`
}

/**
 * Plano de la tela: cómo se extiende sobre las tapas, con las vueltas rayadas.
 */
export function svgPlano(t) {
  const pad = 46
  const m = t.margen
  const recorte = Math.max(0, 2 * m - t.carton * Math.SQRT2)
  const W = t.anchoTela
  const H = t.altoTela
  const xIzq = m
  const xLomo = m + t.anchoCarton + t.canal
  const xDer = xLomo + t.lomo + t.canal
  const yT = m
  const pts = [
    [recorte, 0], [W - recorte, 0], [W, recorte], [W, H - recorte],
    [W - recorte, H], [recorte, H], [0, H - recorte], [0, recorte],
  ]
    .map((p) => `${f2(p[0])},${f2(p[1])}`)
    .join(' ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}" role="img" aria-label="Plano de la tela con las tapas, el lomo y las vueltas">
  <defs>
    ${flechas}
    <pattern id="vueltas" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="${C.telaVuelta}"/>
      <line x1="0" y1="0" x2="0" y2="7" stroke="#b08250" stroke-width="1.6"/>
    </pattern>
  </defs>
  <polygon points="${pts}" fill="url(#vueltas)" stroke="${C.linea}" stroke-width="1.8"/>
  ${rect(xIzq, yT, t.anchoCarton, t.altoCarton, C.tapa, 'rx="3"')}
  ${rect(xDer, yT, t.anchoCarton, t.altoCarton, C.tapa, 'rx="3"')}
  ${rect(xLomo, yT, t.lomo, t.altoCarton, C.tela)}
  <g stroke="${C.bisagra}" stroke-width="2.4" stroke-dasharray="7 4">
    <line x1="${xLomo}" y1="${yT}" x2="${xLomo}" y2="${yT + t.altoCarton}"/>
    <line x1="${xDer}" y1="${yT}" x2="${xDer}" y2="${yT + t.altoCarton}"/>
  </g>
  <g font-size="15" font-weight="700" fill="${C.linea}" text-anchor="middle">
    <text x="${xIzq + t.anchoCarton / 2}" y="${yT + t.altoCarton / 2}">Tapa</text>
    <text x="${xDer + t.anchoCarton / 2}" y="${yT + t.altoCarton / 2}">Tapa</text>
  </g>
  <text x="${xLomo + t.lomo / 2}" y="${yT + t.altoCarton / 2}" font-size="14" font-weight="700" fill="${C.bisagra}" text-anchor="middle" transform="rotate(-90 ${xLomo + t.lomo / 2} ${yT + t.altoCarton / 2})">Lomo</text>
  ${cota(0, -20, W, -20, `${f(W)} mm`)}
  ${cota(-20, 0, -20, H, `${f(H)} mm`, { girar: true, dx: -4 })}
  ${cota(xIzq, yT - 12, xLomo, yT - 12, `vuelta ${f(m)}`)}
  ${cota(xIzq, H + 24, xIzq + t.anchoCarton, H + 24, `tapa ${f(t.anchoCarton)}`)}
  ${cota(xLomo, H + 24, xLomo + t.lomo, H + 24, `lomo ${f(t.lomo)}`)}
</svg>`
}

/**
 * Lomo en tres estados: cerrado, a medio abrir y abierto plano.
 */
export function svgLomo(t) {
  const k = 240 / t.anchoCarton
  const c = Math.max(t.carton * k, 7)
  const b = Math.max(t.bloque * k, 30)
  const s = 2 * c + b
  const g = Math.max(t.canal * k, 18)
  const L = t.anchoCarton * k
  const Lb = (t.anchoCarton - t.sobresalir) * k
  const sw = 12

  // 1) Cerrado
  const x1 = 110
  const y1 = 80
  const panel1 = `
  <g transform="translate(${x1} ${y1})">
    <text x="0" y="-34" font-size="16" font-weight="700" fill="${C.linea}">1 · Cerrado</text>
    ${rect(0, 0, sw, s, C.tela)}
    ${rect(sw + g, 0, L, c, C.tapa)}
    ${rect(sw + g, s - c, L, c, C.tapa)}
    ${rect(sw + g, c, Lb, b, C.pagina)}
    ${cota(-14, 0, -14, s, `lomo ${f(t.lomo)}`, { girar: true, dx: -8 })}
    ${cota(sw, s + 16, sw + g, s + 16, `g ${f(t.canal)}`, { dy: 14 })}
    ${cota(sw + g, s + 16, sw + g + L, s + 16, `tapa ${f(t.anchoCarton)}`, { dy: 14 })}
    ${cota(sw + g + Lb + 14, c, sw + g + Lb + 14, c + b, `bloque ${f(t.bloque)}`, { girar: true, dx: 14 })}
  </g>`

  // 2) A medio abrir: las tapas giran desde los extremos de la tela del lomo
  const th = (19 * Math.PI) / 180
  const cos = Math.cos(th)
  const sin = Math.sin(th)
  const yc = s / 2
  const H1 = [0, c]
  const H2 = [0, s - c]
  const d1 = [cos, -sin]
  const d2 = [cos, sin]
  const n1 = [-sin, -cos]
  const n2 = [-sin, cos]
  const add = (p, q, m = 1) => [p[0] + q[0] * m, p[1] + q[1] * m]
  const poly = (...ps) => ps.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' ')
  const x2 = 110 + sw
  const y2 = 300
  const panel2 = `
  <text x="20" y="${y2 - yc - 60}" font-size="16" font-weight="700" fill="${C.linea}">2 · A medio abrir</text>
  <g transform="translate(${x2} ${y2 - yc})">
    ${rect(-sw, 0, sw, s, C.tela)}
    <polygon points="${poly(H1, add(H1, d1, Lb), add(H2, d2, Lb), H2)}" fill="${C.pagina}" stroke="${C.linea}" stroke-width="1.8"/>
    <polygon points="${poly(H1, add(H1, d1, L), add(add(H1, d1, L), n1, c), add(H1, n1, c))}" fill="${C.tapa}" stroke="${C.linea}" stroke-width="1.8"/>
    <polygon points="${poly(H2, add(H2, d2, L), add(add(H2, d2, L), n2, c), add(H2, n2, c))}" fill="${C.tapa}" stroke="${C.linea}" stroke-width="1.8"/>
    <circle cx="${H1[0]}" cy="${H1[1]}" r="3" fill="${C.bisagra}"/>
    <circle cx="${H2[0]}" cy="${H2[1]}" r="3" fill="${C.bisagra}"/>
    <text x="${-sw - 12}" y="${yc}" font-size="13" font-weight="700" fill="${C.bisagra}" text-anchor="end" dominant-baseline="middle">tela del lomo</text>
  </g>`

  // 3) Abierto plano (escala reducida)
  const k3 = 0.62
  const L3 = L * k3
  const g3 = Math.max(g * k3, 18)
  const b3 = b * k3
  const c3 = Math.max(c, 6)
  const panel3 = `
  <g transform="translate(110 470)">
    <text x="0" y="-26" font-size="16" font-weight="700" fill="${C.linea}">3 · Abierto plano</text>
    ${rect(0, 0, 2 * L3 + g3, b3, C.pagina)}
    ${rect(0, b3, L3, c3, C.tapa)}
    ${rect(L3 + g3, b3, L3, c3, C.tapa)}
    <path d="M ${L3} ${b3} L ${L3 + g3} ${b3} L ${L3 + g3} ${b3 + c3 + 8} Q ${L3 + g3 / 2} ${b3 + c3 + 18} ${L3} ${b3 + c3 + 8} Z" fill="${C.tela}" stroke="${C.linea}" stroke-width="1.8"/>
    ${cota(0, b3 + c3 + 44, L3, b3 + c3 + 44, `tapa ${f(t.anchoCarton)}`, { dy: 14 })}
    ${cota(L3, b3 + c3 + 44, L3 + g3, b3 + c3 + 44, `g ${f(t.canal)}`, { dy: 14 })}
    <text x="${L3 + g3 / 2}" y="${b3 + c3 + 84}" font-size="13" font-weight="700" fill="${C.bisagra}" text-anchor="middle">la tela cruza la bisagra</text>
  </g>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 600" role="img" aria-label="Lomo cerrado, a medio abrir y abierto plano, con la tela del lomo">
  <defs>${flechas}</defs>
  ${panel1}
  ${panel2}
  ${panel3}
</svg>`
}
