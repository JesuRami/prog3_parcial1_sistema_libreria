# Proposal

## Why

El Ejercicio 1 del parcial (20 puntos) exige una base HTML semántica con cinco vistas navegables, formularios etiquetados, tablas con encabezados y mensajes de estado, sobre un único `index.html` abierto sin npm. Es la base de la que dependen los ejercicios 2 a 6: sin esta estructura, la presentación, los datos locales, las altas, la venta y la persistencia no tienen dónde apoyarse.

## What Changes

- Se establece `index.html` como **punto de entrada único** del proyecto, abierto directamente en el navegador por `file://`, sin build ni dependencias.
- Se agrega la **estructura semántica**: enlace de salto al contenido, `<header>` con la marca de la librería, `<nav aria-label="Navegación principal">`, `<main id="contenido">` y `<footer>`.
- Se incorporan las **cinco vistas en una sola página** — Catálogo (`#catalogo`), Libros (`#libros`), Clientes (`#clientes`), Ventas (`#ventas`) e Historial (`#historial`) — enlazadas por anclas, con el catálogo como vista inicial cuando la URL no trae ancla.
- Se maquetan los **formularios** de búsqueda, alta de libro, alta de cliente y venta, con `<label for>` por campo, `<fieldset>`/`<legend>` para los grupos y ayudas asociadas con `aria-describedby`.
- Se agregan los **botones con texto que describe su acción** (Buscar libros, Guardar libro, Agregar renglón, Confirmar venta, etc.) y los botones de limpieza de cada formulario.
- Se agregan las **tablas con encabezados** de libros, clientes, renglones de venta, historial y detalle de venta, incluidos los pies de total con `<th scope="row">`.
- Se agregan los **contenedores de mensajes de estado**: listas vacías, búsqueda sin resultados, operaciones aceptadas (`role="status"`) y rechazadas (`role="alert"`), con texto además del color.
- Se agrega el **logotipo local** `assets/img/logo.svg` como imagen decorativa dentro del enlace de marca, con `alt=""` para no repetir el texto visible.
- No hay cambios disruptivos (**BREAKING**): el cambio solo incorpora estructura; no hay consumidores previos.
- Queda fuera de alcance: estilos y adaptación (Ejercicio 2), datos locales y filtro (Ejercicio 3), validaciones de alta (Ejercicio 4), venta simulada (Ejercicio 5), persistencia y documentación (Ejercicio 6).

## Capabilities

### New Capabilities

- `estructura-y-navegacion`: estructura semántica del documento, navegación por anclas entre las cinco vistas, vista inicial por defecto, etiquetado de campos y grupos, textos de acción de los botones, tablas con encabezados, mensajes de estado y uso de imágenes decorativas.

### Modified Capabilities

Ninguna. `openspec/specs/` está vacío: no existe una capacidad previa cuyos requisitos cambien.

## Impact

- **Archivos**: `index.html` (nuevo, punto de entrada), `assets/img/logo.svg` (logotipo local); `css/layout.css` aporta el mecanismo de visibilidad de vistas por `:target` y el estado activo del menú, sin el cual la navegación anclada no se ve como cinco pantallas.
- **Dependencias**: ninguna. Solo HTML nativo, CSS externo y recursos locales; no se agregan librerías, frameworks ni CDNs.
- **Backend / datos**: sin API, sin servidor, sin base de datos. En esta etapa los listados se resuelven con la estructura vacía y sus mensajes; el contenido real lo aportan los ejercicios 3 a 5.
- **Compatibilidad**: sin usuarios ni contratos previos; el cambio es la línea base del resto del roadmap (`C-02`…`C-06` dependen de él).

## Nota de cierre retrospectivo

Este change se documenta **as-built**: el código ya estaba implementado y commiteado antes de crear los artifacts de OpenSpec. La estructura inicial entró en `50632e4` (`html (ejercicio 1): estructura inicial del proyecto`), las vistas de catálogo, libros y clientes en `e6ccfae`, y las vistas de ventas e historial en `e633fd1`; ajustes posteriores de interfaz relacionados llegaron en `f867464` (etiqueta «Autor, es», altas con texto libre) y `f7f90d3` (mejoras de catálogo y libros). Los requisitos describen el comportamiento que el código tiene hoy, verificado sobre `index.html`; no se agrega alcance nuevo ni se planifica trabajo pendiente.
