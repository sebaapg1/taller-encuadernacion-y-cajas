# Créditos y licencias

Taller combina código propio con motores derivados de otros proyectos. Cada origen se acredita aquí y en la página `/creditos`.

## Herramientas propias (licencia MIT, © 2026 Sebastian Palma)

- **Calculadora de tapas duras:** inspirada en [easy-hardcovers](https://github.com/ittia-9b/easy-hardcovers) de ittia-9b. Código original; no se copiaron su código ni sus imágenes.
- **Portada para imprimir:** inspirada en [CoverSizeCalculator](https://github.com/BenjaminTMilnes/CoverSizeCalculator) de Benjamin T. Milnes, que no declara licencia. Código original; sus fórmulas se reescribieron. El valor de lomo de tapa dura (0,0572 mm por página + 4,8 mm, y 0,0635 para papel crema) es empírico, según esa fuente.
- **Cajas rígidas (caja magnética, estuche, redes de cajas) y Guía:** código original.

## Excepciones (licencias de terceros)

- **Encuadernación, motor de imposición** (`src/lib/imposicion`): derivado de [bookbinder-js](https://github.com/momijizukamori/bookbinder-js) de momijizukamori, que parte de [Bookbinder](http://quantumelephant.co.uk/bookbinder/bookbinder.html) de Quantum Elephant. Licencia **MPL-2.0**. Ver `src/lib/imposicion/LICENSE-MPL`.
- **Cajas, motor de geometría** (`src/lib/cajas/geometry`): derivado de [PackBox Studio](https://github.com/sbarrak/packbox) de sbarrak. Licencia **MIT**, © 2026 sbarrak. Ver `src/lib/cajas/LICENSE-MIT`.

## Bibliotecas

- MIT: Vue.js, Vue Router, Vite, Tailwind CSS, PrimeVue, Iconoir, pdf-lib (`@cantoo/pdf-lib`), file-saver, Zod, polygon-clipping, Three.js.
- MIT o GPL-3.0: JSZip.
