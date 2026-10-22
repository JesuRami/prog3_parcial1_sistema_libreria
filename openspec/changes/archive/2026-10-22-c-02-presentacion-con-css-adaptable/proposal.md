# Proposal

## Why

La estructura de vistas del Ejercicio 1 ya existe (`index.html` con cinco secciones y navegación por anclas), pero sin una capa de presentación no hay identidad visual, ni adaptación a los anchos exigidos, ni garantías de accesibilidad básica. El Ejercicio 2 (20 puntos: coherencia y organización 8, adaptación 8, accesibilidad básica 4) requiere una presentación propia, adaptable y accesible que no rompa el alcance técnico del TPI.

## What Changes

- Se incorpora una capa de estilos externa en `css/`, referenciada desde `index.html` con `<link>` (nunca CSS embebido ni recursos externos).
- Se definen custom properties en `:root` para color, tipografía y espaciado, y se aplican de forma consistente en todo el sitio.
- Se organiza el contenido con Flexbox (encabezado, menú, acciones, formularios) y Grid (grilla de tarjetas, datos, layout dividido de formulario + listado).
- Se consolidan clases reutilizables para elementos equivalentes: `.tarjeta`, `.formulario`, `.campo`, `.boton`, `.mensaje`, `.tabla`, `.tabla-envoltura`, `.acciones`, `.datos`, `.grilla`.
- Se agregan media queries para ampliar tipografía y espaciado por encima de 768 px y para dividir en dos columnas por encima de 1024 px, respetando `prefers-reduced-motion`.
- Las tablas anchas se desplazan dentro de su propio contenedor `.tabla-envoltura` (`overflow-x: auto`, `max-width: 100%`), sin ensanchar la página.
- Se conserva el foco visible (`:focus-visible`) y el recorrido por teclado en todos los controles, incluidos los contenedores de tabla desplazables (`tabindex="0"` + `role="region"` + nombre accesible).
- Los errores se comunican con texto además del color: `.error-campo`, `.errores` y `.mensaje--error` incluyen prefijo textual (✖) y estilo de borde, no solo color.
- Las imágenes informativas llevan `alt`; el logotipo del encabezado es decorativo (`alt=""`) porque el nombre «Librería Lomo» se repite como texto visible.

## Capabilities

### New Capabilities

- `presentacion-adaptable`: presentación visual coherente y adaptable del sistema de librería (tokens, Flexbox/Grid, clases reutilizables, media queries, tablas con desplazamiento propio, foco visible, errores con texto e imágenes con texto alternativo).

### Modified Capabilities

_Ninguna: no existen specs previas en `openspec/specs/` y esta capa no cambia requisitos de comportamiento funcional._

## Impact

- Archivos de estilo nuevos: `css/base.css`, `css/layout.css`, `css/components.css`, `css/responsive.css`.
- `index.html`: incorpora los cuatro `<link rel="stylesheet">` y usa las clases de presentación; no agrega ni modifica comportamiento funcional.
- Sin dependencias, frameworks, CDNs, build ni backend. Sin cambios en `js/`, `README.md`, `CHANGES.md` ni `AGENTS.md` por parte de este change.
- Impacto en verificación: ancho de 320 px y 1280 px sin desplazamiento horizontal de página, recorrido con Tab con foco visible y tabla con desplazamiento propio (caso manual 8).

## Nota de cierre retrospectivo

Este change se documenta como **as-built**: el código se implementó antes de crear el change y los artifacts describen el CSS realmente presente en el repositorio, sin comportamiento inventado.

- `8d8ed92` — `css (ejercicio 2): identidad visual, base y layout` (`css/base.css`, `css/layout.css`).
- `c71db9f` — `css (ejercicio 2): tablas con scroll y responsive` (`css/components.css`, `css/responsive.css`).

Los commits posteriores (`f7f90d3`, `f867464`, entre otros) ampliaron `components.css` con estilos de venta, autores y control con acción; esta propuesta cubre el estado actual de esos archivos. No se modificó código durante el cierre.
