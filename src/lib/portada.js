// Cálculo del tamaño de la portada para imprimir (rústica y tapa dura).
//
// Fórmulas basadas en la CoverSizeCalculator de Benjamin T. Milnes
// (https://github.com/BenjaminTMilnes/CoverSizeCalculator), reescritas aquí.
// Todas las medidas internas están en milímetros.

const MM_POR_PULGADA = 25.4

// Grosor del papel por página (valores de KDP).
export const PAPEL = {
  crema: { nombre: 'Crema', mmPorPagina: 0.0635 },
  blanco: { nombre: 'Blanco', mmPorPagina: 0.0572 },
}

// Para tapa dura, el lomo se calcula con una fórmula empírica:
// lomo = mmPorPágina × páginas + 4,8 mm (así lo calcula la fuente original).
const DESFASE_LOMO_TAPA_MM = 4.8

// Holgura fija de la bisagra de la tapa dura (mm).
const BISAGRA_TAPA_MM = 2

export const UNIDADES = {
  mm: { nombre: 'milímetros', factor: 1, decimales: 1 },
  cm: { nombre: 'centímetros', factor: 0.1, decimales: 2 },
  in: { nombre: 'pulgadas', factor: 1 / MM_POR_PULGADA, decimales: 3 },
}

export function aMm(valor, unidad) {
  const u = UNIDADES[unidad]
  return valor / u.factor
}

export function lomoMm({ paginas, formato, papel, grosorMm }) {
  if (formato === 'tapa') {
    const mmPorPagina = papel === 'crema' ? PAPEL.crema.mmPorPagina : PAPEL.blanco.mmPorPagina
    return mmPorPagina * paginas + DESFASE_LOMO_TAPA_MM
  }
  return grosorMm * paginas
}

/**
 * @param {object} p
 * @param {number} p.anchoPaginaMm   ancho de una página cortada
 * @param {number} p.altoPaginaMm    alto de una página cortada
 * @param {number} p.paginas         número de páginas
 * @param {'rustica'|'tapa'} p.formato
 * @param {'crema'|'blanco'|'personalizado'} p.papel
 * @param {number} [p.grosorMm]      grosor por hoja (solo si papel es 'personalizado')
 * @param {number} p.sangrado        sangrado (rústica), mm
 * @param {number} p.envoltura       envoltura de la tela (tapa), mm
 * @param {number} p.margen          margen interior de la tapa (tapa), mm
 */
export function calcularPortada(p) {
  const grosorMm = p.papel === 'personalizado' ? p.grosorMm : PAPEL[p.papel].mmPorPagina
  const lomo = lomoMm({ paginas: p.paginas, formato: p.formato, papel: p.papel, grosorMm })

  const esTapa = p.formato === 'tapa'
  const borde = esTapa ? p.envoltura : p.sangrado

  let anchoTotal = 2 * borde + 2 * p.anchoPaginaMm + lomo
  let altoTotal = 2 * borde + p.altoPaginaMm
  if (esTapa) {
    anchoTotal = 2 * p.envoltura + 2 * p.margen + 2 * p.anchoPaginaMm + 2 * BISAGRA_TAPA_MM + lomo
    altoTotal = 2 * p.envoltura + 2 * p.margen + p.altoPaginaMm
  }

  // Posiciones de las guías, medidas desde la esquina superior izquierda.
  const inicioPortada = esTapa ? p.envoltura : p.sangrado
  const bordeIzq = inicioPortada
  const bordeDer = anchoTotal - inicioPortada
  const bordeSup = inicioPortada
  const bordeInf = altoTotal - inicioPortada

  const lomoIzq = esTapa
    ? p.envoltura + p.margen + p.anchoPaginaMm + BISAGRA_TAPA_MM
    : inicioPortada + p.anchoPaginaMm
  const lomoDer = lomoIzq + lomo

  const centroContraportada = bordeIzq + p.anchoPaginaMm / 2
  const centroPortada = bordeDer - p.anchoPaginaMm / 2
  const centroVertical = bordeSup + p.altoPaginaMm / 2

  return {
    lomo,
    anchoTotal,
    altoTotal,
    bordes: { izq: bordeIzq, der: bordeDer, sup: bordeSup, inf: bordeInf },
    lomoBordes: { izq: lomoIzq, der: lomoDer },
    centros: { contraportada: centroContraportada, portada: centroPortada, vertical: centroVertical },
    tercios: {
      contraportada: [bordeIzq + p.anchoPaginaMm / 3, bordeIzq + (2 * p.anchoPaginaMm) / 3],
      portada: [bordeDer - (2 * p.anchoPaginaMm) / 3, bordeDer - p.anchoPaginaMm / 3],
    },
  }
}

// Formatos de página habituales (en mm).
export const TAMANOS = [
  { nombre: '12,7 × 19,8 cm', anchoMm: 127, altoMm: 198.4 },
  { nombre: '13,3 × 20,3 cm (5 × 8 in)', anchoMm: 127, altoMm: 203.2 },
  { nombre: '14 × 21,6 cm (5,5 × 8,5 in)', anchoMm: 139.7, altoMm: 215.9 },
  { nombre: '15,2 × 22,9 cm (6 × 9 in)', anchoMm: 152.4, altoMm: 228.6 },
  { nombre: 'A5 (14,8 × 21 cm)', anchoMm: 148, altoMm: 210 },
  { nombre: 'A4 (21 × 29,7 cm)', anchoMm: 210, altoMm: 297 },
]
