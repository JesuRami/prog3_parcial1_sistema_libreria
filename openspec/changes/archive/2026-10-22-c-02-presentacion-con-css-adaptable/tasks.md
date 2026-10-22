# Tasks

> Change cerrado en forma retrospectiva (as-built): las tareas ya están implementadas sobre el código existente. Los commits `8d8ed92` y `c71db9f` son los del Ejercicio 2; `f867464` sumó dos bloques de componentes ya presentes en `css/components.css`.

## 1. Base visual y tokens

- [x] 1.1 Declarar las custom properties de color, tipografía, espaciado y radio en el selector raíz. Verificado: `css/base.css:4-26` define `--tinta`, `--lomo`, `--papel`, `--error`, `--fuente-titulos`, `--fuente-texto`, `--esp-1`…`--esp-4` y `--radio` (commit `8d8ed92`).
- [x] 1.2 Aplicar reset de caja, tipografía base y corte de palabras largas para evitar desbordes. Verificado: `css/base.css:28-53` usa `box-sizing: border-box`, `line-height: 1.5` y `overflow-wrap: break-word` en `body`.
- [x] 1.3 Asegurar que el atributo `hidden` prevalezca sobre los `display` de los componentes. Verificado: `css/base.css:30` declara `[hidden] { display: none !important; }`.
- [x] 1.4 Definir foco visible global, enlace de salto y utilidad para lectores de pantalla. Verificado: `css/base.css:56-80` con `:focus-visible` (outline de 3 px), `.salto` y `.solo-lectores`.

## 2. Layout y navegación

- [x] 2.1 Componer encabezado, marca y menú con Flexbox y resaltar la vista activa. Verificado: `css/layout.css:5-62` usa `display: flex` con `flex-wrap`, y resalta el enlace según `.vista:target` (commit `8d8ed92`).
- [x] 2.2 Contener el ancho del contenido principal y conmutar las vistas por ancla. Verificado: `css/layout.css:65-75` fija `max-width: 64rem`, centra con `margin: 0 auto` y muestra solo `.vista:target`.
- [x] 2.3 Estilar el pie y dejar preparada la disposición dividida y la barra de acciones. Verificado: `css/layout.css:78-100` define `.pie`, `.dividido` con `display: grid` de una columna y `.acciones` con `display: flex`.

## 3. Componentes reutilizables

- [x] 3.1 Crear tarjetas, grilla de libros y lista de datos reutilizables. Verificado: `css/components.css:5-36` define `.tarjeta`, `.tarjeta-libro`, `.grilla` con `minmax(min(100%, 17rem), 1fr)` y `.datos` con Grid (commit `c71db9f`).
- [x] 3.2 Estilar formularios, campos, grupos y textos de ayuda con una misma clase por elemento equivalente. Verificado: `css/components.css:39-70` define `.formulario`, `.campo`, `.grupo`, `.ayuda` y fija `min-height: 44px` en los controles.
- [x] 3.3 Estilar botones principales, secundarios y chicos con una base común. Verificado: `css/components.css:73-92` define `.boton`, `.boton--secundario` y `.boton--chico`.
- [x] 3.4 Comunicar estados y errores con texto además del color. Verificado: `css/components.css:95-165` combina color, borde izquierdo, `.error-campo`, `[aria-invalid="true"]` con borde discontinuo y prefijos textuales `✔`, `ℹ` y `✖` mediante `::before`.
- [x] 3.5 Contener las tablas anchas en un contenedor con desplazamiento propio. Verificado: `css/components.css:123-149` define `.tabla-envoltura` con `overflow-x: auto; max-width: 100%` y `.tabla` con `min-width: 30rem` (commit `c71db9f`).
- [x] 3.6 Estilar la selección de autores, su listado con tope de altura y el par campo + botón. Verificado: `css/components.css:168-197` define `.lista-check`, `.lista-scroll`, `.check` y `.control-con-accion` con `flex-wrap` (bloque agregado en `f867464`).
- [x] 3.7 Estilar cantidad y resumen de la venta. Verificado: `css/components.css:200-201` define `.cantidad` y `.resumen`.

## 4. Adaptación por ancho y preferencias

- [x] 4.1 Ampliar tipografía y espaciado desde 768 px. Verificado: `css/responsive.css:4-9` aplica `@media (min-width: 48rem)` sobre `h1`, `.encabezado`, `.principal` y `.formulario.tarjeta` (commit `c71db9f`).
- [x] 4.2 Pasar la disposición dividida a dos columnas desde 1024 px. Verificado: `css/responsive.css:11-13` aplica `@media (min-width: 64rem)` con `grid-template-columns: minmax(0, 22rem) minmax(0, 1fr)`.
- [x] 4.3 Respetar la preferencia de movimiento reducido. Verificado: `css/responsive.css:16-18` anula transiciones, animaciones y desplazamiento suave bajo `prefers-reduced-motion: reduce`.

## 5. Verificación estática sobre el código

- [x] 5.1 Confirmar que las hojas se enlazan como archivos externos y no hay CSS embebido. Verificado: `index.html:8-11` enlaza las cuatro hojas de `css/`; una búsqueda de `<style`, `style=`, `@import` y `http` en `index.html` y `css/` no devuelve coincidencias.
- [x] 5.2 Confirmar que no se referencian recursos externos ni dependencias de terceros. Verificado: las hojas solo usan familias tipográficas del sistema y `assets/img/logo.svg` es local.
- [x] 5.3 Confirmar que cada contenedor de tabla es accesible por teclado y tiene nombre accesible. Verificado: `index.html:121`, `:160`, `:204`, `:233` y `:245` declaran `class="tabla-envoltura"` con `tabindex="0"`, `role="region"` y `aria-labelledby` o `aria-label`.
- [x] 5.4 Confirmar el tratamiento de la única imagen del sitio. Verificado: `index.html:18` usa `alt=""` para el logotipo decorativo y el nombre «Librería Lomo» aparece como texto visible a su lado.
- [x] 5.5 Confirmar que ningún control queda sin foco visible por una regla `outline: none`. Verificado: búsqueda de `outline` en `css/` solo devuelve las declaraciones de `:focus-visible` y el cambio de color del foco en el menú.

## Workflow follow-up

- Ejecutar el caso manual 8 del README (recorrido con teclado y anchos de 320 px y 1280 px, con tabla de desplazamiento propio) y registrar el resultado real; el README lo mantiene como «Pendiente de ejecución» y esa verificación corresponde a C-06.
- Archivar el change cuando el resto de los artifacts valide y el caso manual 8 esté registrado.
