# Taller

Herramientas para hacer libros y cajas a mano. Una sola aplicación web, pensada para correr en un servidor propio (un "Nido") y usarla desde cualquier navegador.

**Versión:** V2.2 · **Licencia:** MIT (con excepciones de terceros, ver abajo)

## Herramientas

| Herramienta | Qué hace | Estado |
|---|---|---|
| **Encuadernación** | Toma un PDF y lo reordena en pliegos listos para imprimir, doblar y coser (cuadernillos, en cuarto, en octavo, folios, marcas de ayuda). Todo se calcula en el navegador. | Disponible |
| **Tapas duras** | Calcula la tela y el cartón de una tapa dura, con planos de la tela, del corte transversal y del lomo en tres estados. | Disponible |
| **Portada para imprimir** | Calcula el ancho, el alto y el lomo de la portada, con sangrado (rústica) o envoltura y margen (tapa dura). | Disponible |
| **Cajas** | Troqueles de cajas plegables, con vista plana y caja armada en 3D, y botones para verla desde varios ángulos. | Disponible |
| **Cajas rígidas** | Caja magnética con tapa envolvente en C, y estuche de dos piezas (bandeja y funda). Muestra la red de cada parte con su papel de forro, los espacios de bisagra y los cortes de esquina. | En pruebas |
| **Guía** | Explica cada herramienta, qué hace cada sección y en qué orden conviene usarla. | Disponible |

## Desarrollo

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm test         # pruebas (Vitest)
npm run build    # genera dist/ para publicar
```

El proyecto usa Vue 3 con Vite, Vue Router, PrimeVue (tema Aura), Iconoir y Tailwind CSS 4.

## Estructura

```
src/
  views/          una vista por herramienta
  components/     piezas reutilizables (barra, campos numéricos, 3D de cajas)
  lib/            cálculos puros, sin interfaz, con sus pruebas
    imposicion/   motor de Encuadernación (MPL-2.0)
    cajas/        motor de geometría de cajas (MIT, PackBox) y cajas rígidas
  version.js      versión visible de la aplicación
deploy/
  spa.conf        configuración de nginx (caché y rutas de la aplicación)
```

## Publicar

La aplicación es estática. Basta con servir `dist/` con nginx usando `deploy/spa.conf`, que:

- nunca guarda `index.html` en caché, así cada entrega llega al tiro;
- guarda `/assets/` un año, porque sus nombres de archivo cambian en cada build;
- redirige las rutas de la aplicación a `index.html`.

Para cada entrega, sube la versión en `src/version.js`, `package.json` y `CHANGELOG.md`.

## Créditos y licencias

Taller combina código propio con motores derivados de otros proyectos. Detalles en [CREDITS.md](CREDITS.md).

- **Código propio:** MIT, © 2026 Sebastian Palma (ver [LICENSE](LICENSE)).
- **Motor de imposición de Encuadernación** (`src/lib/imposicion`): derivado de [bookbinder-js](https://github.com/momijizukamori/bookbinder-js), **MPL-2.0**. Ver `src/lib/imposicion/LICENSE-MPL`.
- **Motor de geometría de Cajas** (`src/lib/cajas/geometry`): derivado de [PackBox Studio](https://github.com/sbarrak/packbox), **MIT**, © 2026 sbarrak. Ver `src/lib/cajas/LICENSE-MIT`.
- **Calculadora de tapas duras:** inspirada en [easy-hardcovers](https://github.com/ittia-9b/easy-hardcovers) de ittia-9b. Código escrito desde cero.
- **Portada para imprimir:** inspirada en [CoverSizeCalculator](https://github.com/BenjaminTMilnes/CoverSizeCalculator) de Benjamin T. Milnes. Sus fórmulas se reescribieron; el valor de lomo de tapa dura es empírico, según esa fuente.

## Limitaciones conocidas

- Las cajas rígidas usan valores de referencia para el grosor del cartón, la sangría y el espacio de bisagra. Hay que comprobarlos con un prototipo impreso antes de cortar una caja real.
- Los cortes de esquina del papel de forro son una aproximación; el corte a 45° todavía no está definido.
- El rebaje y la posición exacta de los imanes no están modelados.
- El lomo de tapa dura de Portada usa una fórmula empírica: conviene confirmarlo con la imprenta.
