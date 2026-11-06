// Medidas de cartón para una caja de dos piezas (bandeja interior + folder exterior),
// según el método del video de referencia. Todo en mm.
export const VALORES_BASE = {
  grosor: 2.4, // grosor del cartón (valor del video)
  holgura: 2.5, // holgura de la bandeja: 2 a 3 mm
  espina: 3, // espacio de la espina (depende del grosor)
  solapa: 6, // espacio de la solapa de cierre
}

/**
 * @param {{largo:number, ancho:number, alto:number}} objeto medidas del objeto a guardar
 * @param {{grosor:number, holgura:number, espina:number, solapa:number}} p parámetros
 */
export function medidasCaja(objeto, p = VALORES_BASE) {
  const { largo, ancho, alto } = objeto
  const { grosor: t, holgura: h, espina, solapa } = p

  // Bandeja interior
  const bandejaInterior = {
    largo: largo + 2 * t + h,
    ancho: ancho + 2 * t + h,
    alto: alto + h,
  }
  const bandeja = {
    ladoLargo: largo, // según el método: exactamente el largo del objeto
    ladoSuperiorInferior: ancho - t, // según el método: ancho del objeto menos el grosor
    interior: bandejaInterior,
  }

  // Folder exterior: misma lógica que la bandeja, sobre su interior.
  const folder = {
    largo: bandejaInterior.largo + 2 * t,
    ancho: bandejaInterior.ancho + 2 * t,
    alto: bandejaInterior.alto + 2 * t,
    espina,
    solapa,
  }

  return { bandeja, folder, redondeo: (n) => Math.round(n * 10) / 10 }
}
