// Calculadora de tapas duras (encuadernación con tela).
//
// Código original para Taller, licenciado bajo MIT (ver LICENSE-TAPAS).
// Inspirado en easy-hardcovers de ittia-9b, pero escrito desde cero.
// Todas las medidas están en milímetros.

export const MEDIDAS_INICIALES = {
  anchoPagina: 150,
  altoPagina: 230,
  grosorBloque: 20,
  grosorCarton: 2.5,
  sobresalirTapa: 3,
  margenTela: 20,
}

/**
 * Calcula las dimensiones de la tapa a partir de las medidas del libro.
 * @param {typeof MEDIDAS_INICIALES} m
 */
export function calcularTapa(m) {
  const ancho = m.anchoPagina
  const alto = m.altoPagina
  const bloque = m.grosorBloque
  const carton = m.grosorCarton
  const sobresalir = m.sobresalirTapa
  const margen = m.margenTela

  // Cartón de cada tapa: la página menos la mitad del bloque, más lo que sobresale.
  const anchoCarton = ancho - bloque / 2 + sobresalir
  const altoCarton = alto + 2 * sobresalir

  // Lomo: el bloque más el cartón de ambos lados.
  const lomo = bloque + 2 * carton

  // Canal: el espacio de bisagra entre tapa y lomo.
  const canal = bloque / 2 + carton

  // Tela total: dos tapas, lomo, dos canales y dos márgenes.
  const anchoTela = 2 * anchoCarton + lomo + 2 * canal + 2 * margen
  const altoTela = altoCarton + 2 * margen

  return {
    ancho,
    alto,
    bloque,
    carton,
    sobresalir,
    margen,
    anchoCarton,
    altoCarton,
    lomo,
    canal,
    anchoTela,
    altoTela,
  }
}
