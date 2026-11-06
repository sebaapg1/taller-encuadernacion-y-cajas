<script setup>
// Caja armada en 3D. Cada panel gira sobre su bisagra según el deslizador "plegado".
// Lógica tomada del visor de PackBox (MIT, sbarrak); dibujo y controles propios.
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps({
  raiz: { type: Object, default: null }, // árbol de paneles de la caja (cajas plegables)
  piezas: { type: Array, default: null }, // piezas rígidas (cajas forradas): {size, pos, nombre}
  plegado: { type: Number, default: 0 }, // 0 = plana, 1 = armada
  escala: { type: Number, default: 300 }, // tamaño del troquel en mm, para encuadrar
  vista: { type: String, default: '' }, // ángulo predefinido (ver VISTAS)
})

// Ángulos predefinidos: dirección desde la que se mira la caja.
const VISTAS = {
  frente: [0, 0, 1],
  lado: [1, 0, 0],
  atras: [0, 0, -1],
  arriba: [0, 1, 0.0001],
  abajo: [0, -1, 0.0001],
  'tres-cuartos': [0.55, 0.4, 1],
}
let destinoDireccion = null

const contenedor = ref(null)
let renderer, escena, camara, controles, grupoRaiz, observador, frameId
let articulaciones = []

// Dónde está la bisagra de cada panel, según el borde del padre al que se une.
function bisagra(nodo, padreW, padreH) {
  const desfase = nodo.parentOffset ?? 0
  switch (nodo.parentEdge) {
    case 'right': return { pivote: [padreW, desfase, 0], eje: 'y', base: 0 }
    case 'left': return { pivote: [0, desfase, 0], eje: 'y', base: 0 }
    case 'top': return { pivote: [desfase, padreH, 0], eje: 'x', base: 0 }
    case 'bottom': return { pivote: [desfase, 0, 0], eje: 'x', base: Math.PI }
    default: return { pivote: [0, 0, 0], eje: 'x', base: 0 }
  }
}

const COLOR = {
  exterior: 0xc9b99b,
  interior: 0xe9e0cc,
}

function construir(nodo, padreW, padreH, padre) {
  const { pivote, eje, base } = bisagra(nodo, padreW, padreH)
  const grupo = new THREE.Group()
  grupo.position.set(pivote[0], pivote[1], pivote[2])
  padre.add(grupo)

  const puntos = nodo.outline ?? [[0, 0], [nodo.w, 0], [nodo.w, nodo.h], [0, nodo.h]]
  const forma = new THREE.Shape(puntos.map(([x, y]) => new THREE.Vector2(x, y)))
  const geo = new THREE.ShapeGeometry(forma)
  const material = new THREE.MeshStandardMaterial({
    color: nodo.isInside ? COLOR.interior : COLOR.exterior,
    side: THREE.DoubleSide,
    roughness: 0.85,
  })
  grupo.add(new THREE.Mesh(geo, material))
  grupo.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x1f2937 })))

  articulaciones.push({
    grupo,
    eje,
    base,
    inicio: nodo.foldStart ?? 0,
    fin: nodo.foldEnd ?? 1,
    angulo: nodo.foldAngle ?? 0,
  })
  for (const hijo of nodo.children ?? []) construir(hijo, nodo.w, nodo.h, grupo)
}

function aplicarPlegado(p) {
  for (const a of articulaciones) {
    const ventana = a.fin > a.inicio ? Math.min(1, Math.max(0, (p - a.inicio) / (a.fin - a.inicio))) : p
    const giro = a.base + ventana * a.angulo
    if (a.eje === 'x') a.grupo.rotation.set(giro, 0, 0)
    else a.grupo.rotation.set(0, giro, 0)
  }
  encuadrar()
}

// Centra la cámara en la caja en su estado actual, a una distancia que le
// corresponde a su tamaño. Conserva el ángulo que el usuario haya elegido.
function encuadrar() {
  if (!grupoRaiz || !controles) return
  const caja = new THREE.Box3().setFromObject(grupoRaiz)
  if (caja.isEmpty()) return
  const centro = caja.getCenter(new THREE.Vector3())
  const tam = caja.getSize(new THREE.Vector3())
  const maximo = Math.max(tam.x, tam.y, tam.z, 1)
  const direccion = camara.position.clone().sub(controles.target)
  if (direccion.lengthSq() < 1e-6) direccion.set(0, 0, 1)
  direccion.normalize()
  controles.target.copy(centro)
  camara.position.copy(centro).addScaledVector(direccion, maximo * 1.9)
  camara.lookAt(centro)
  controles.update()
}

// Piezas rígidas: un bloque de cartón por pieza, en su posición.
function construirPiezas(lista) {
  const material = new THREE.MeshStandardMaterial({ color: COLOR.exterior, roughness: 0.8 })
  for (const p of lista) {
    if (!p.pos) continue
    const [sx, sy, sz] = p.size
    const malla = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material)
    malla.position.set(p.pos[0], p.pos[1], p.pos[2])
    const bordes = new THREE.LineSegments(new THREE.EdgesGeometry(malla.geometry), new THREE.LineBasicMaterial({ color: 0x1f2937 }))
    malla.add(bordes)
    grupoRaiz.add(malla)
  }
}

function reconstruir() {
  if (!grupoRaiz) return
  while (grupoRaiz.children.length) grupoRaiz.remove(grupoRaiz.children[0])
  articulaciones = []
  if (props.piezas) construirPiezas(props.piezas)
  else if (props.raiz) construir(props.raiz, props.raiz.w, props.raiz.h, grupoRaiz)
  else return
  aplicarPlegado(props.plegado)
}

function ajustarTamano() {
  if (!renderer || !contenedor.value) return
  const { clientWidth: w, clientHeight: h } = contenedor.value
  renderer.setSize(w, h, false)
  camara.aspect = w / h
  camara.updateProjectionMatrix()
}

function bucle() {
  frameId = requestAnimationFrame(bucle)
  // Transición suave hacia la vista elegida.
  if (destinoDireccion && controles) {
    const centro = controles.target
    const actual = camara.position.clone().sub(centro)
    const dist = actual.length() || 1
    actual.normalize().lerp(destinoDireccion, 0.12).normalize()
    camara.position.copy(centro).addScaledVector(actual, dist)
    if (camara.position.clone().sub(centro).normalize().distanceTo(destinoDireccion) < 0.002) destinoDireccion = null
  }
  controles.update()
  renderer.render(escena, camara)
}

onMounted(() => {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  contenedor.value.appendChild(renderer.domElement)

  escena = new THREE.Scene()
  escena.background = new THREE.Color('#f6f4ef')
  escena.add(new THREE.AmbientLight(0xffffff, 0.8))
  const luz = new THREE.DirectionalLight(0xffffff, 0.9)
  luz.position.set(300, 400, 200)
  escena.add(luz)

  camara = new THREE.PerspectiveCamera(40, 1, 1, 5000)
  // Vista inicial de tres cuartos: se ve el volumen de la caja.
  camara.position.set(0.55, 0.4, 1)
  controles = new OrbitControls(camara, renderer.domElement)
  controles.enableDamping = true
  controles.dampingFactor = 0.08

  grupoRaiz = new THREE.Group()
  escena.add(grupoRaiz)

  observador = new ResizeObserver(ajustarTamano)
  observador.observe(contenedor.value)
  ajustarTamano()
  reconstruir()
  bucle()
})

watch(() => [props.raiz, props.piezas], reconstruir)
watch(() => props.plegado, aplicarPlegado)
watch(
  () => props.vista,
  (nombre) => {
    const v = VISTAS[nombre]
    if (v) destinoDireccion = new THREE.Vector3(...v).normalize()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  observador?.disconnect()
  controles?.dispose()
  renderer?.dispose()
  renderer?.domElement.remove()
})
</script>

<template>
  <div ref="contenedor" class="h-[460px] w-full overflow-hidden rounded-lg" />
</template>
