# Design

## Context

Ver `proposal.md` — Why. El punto de partida es `index.html` (Ejercicio 1) con cinco vistas conmutadas por anclas y `:target`, formularios con etiquetas, tablas con encabezados y contenedores de tabla ya marcados con `tabindex="0"`, `role="region"` y `aria-labelledby`/`aria-label`. No hay specs previas ni capa de estilos. Restricciones: solo HTML, CSS y JavaScript nativos; CSS externo; sin dependencias, CDNs, build ni backend; entrada por `file://` con doble clic.

El CSS existe y este documento lo describe tal como está en `css/base.css`, `css/layout.css`, `css/components.css` y `css/responsive.css` (cierre retrospectivo).

## Goals / Non-Goals

**Goals:**

- Una única fuente de verdad para color, tipografía y espaciado, consumida por todos los componentes.
- Composición predecible en móvil (320 px) y escritorio (1280 px) sin depender de JavaScript para el layout.
- Que cualquier tabla ancha desborde solo dentro de su contenedor, nunca en la página.
- Accesibilidad básica verificable con teclado, zoom de texto y vista sin color.

**Non-Goals:**

- Tema oscuro, tipografías web descargadas o iconografía externa.
- Rediseño de la estructura HTML del Ejercicio 1 (solo se consumen sus clases y atributos).
- Animaciones, transiciones decorativas o efectos que requieran JavaScript.
- Ajustes finos de impresión o soporte de navegadores sin `:has()` y `:focus-visible`.

## Decisions

### Cuatro hojas por responsabilidad, cargadas en orden de cascada

`base.css` (tokens, reset, tipografía, foco, utilidades) → `layout.css` (encabezado, menú, principal, vistas, pie, dividido, acciones) → `components.css` (tarjetas, formularios, botones, mensajes, tablas) → `responsive.css` (media queries). El orden importa: las media queries deben poder sobrescribir lo definido en las hojas anteriores.

Alternativa descartada: una sola hoja. Se descartó porque el criterio «coherencia y organización» (8 puntos) evalúa la organización del CSS, y porque separar responsabilidades evita que un cambio de componente obligue a recorrer un archivo único de cientos de líneas.

### Tokens en `:root` con nombres en español

`--tinta`, `--lomo`, `--lomo-oscuro`, `--papel`, `--blanco`, `--borde`, `--gris`, `--error`, `--error-fondo`, `--ok`, `--ok-fondo`, `--info-fondo`; `--fuente-titulos`, `--fuente-texto`; `--esp-1`…`--esp-4` y `--radio`. Los nombres siguen el dominio (lomo, papel, tinta) y no la apariencia (`azul`, `gris-2`), para que un cambio de paleta no deje nombres mentirosos.

Alternativa descartada: preprocesador con variables. Prohibido por el alcance (sin herramientas de compilación); las custom properties nativas cubren el caso.

### Mobile-first con `min-width` en 48rem y 64rem

La base está escrita para 320 px sin media queries; a 768 px se amplían `h1`, espaciado del encabezado y del principal; a 1024 px `.dividido` pasa de una columna a `minmax(0, 22rem) minmax(0, 1fr)`. `minmax(0, …)` es deliberado: sin el mínimo en `0`, el contenido de la tabla fuerza el ancho de la columna y reaparece el desborde.

Alternativa descartada: desktop-first con `max-width`. Se descartó porque obliga a neutralizar reglas de escritorio en móvil y porque la consigna verifica primero 320 px.

### Grilla de tarjetas con `minmax(min(100%, 17rem), 1fr)`

`grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr))` garantiza columnas que nunca exceden el contenedor: en 320 px `min(100%, 17rem)` resuelve a `100%`, así que la columna se ajusta en lugar de desbordar.

Alternativa descartada: `repeat(auto-fit, minmax(17rem, 1fr))`. A 320 px el mínimo de 17rem (272 px más padding) puede superar el ancho disponible y producir scroll horizontal.

### Tablas: `min-width` interno + contenedor con `overflow-x: auto`

`.tabla` usa `width: 100%; min-width: 30rem` y `.tabla-envoltura` usa `position: relative; overflow-x: auto; max-width: 100%`. La tabla conserva legibilidad de columnas y el desplazamiento ocurre dentro del contenedor. `position: relative` mantiene contenidos posicionados (textos solo para lectores) dentro del área de scroll. Cada contenedor lleva `tabindex="0"`, `role="region"` y nombre accesible en el HTML, de modo que quien usa teclado puede enfocarlo y desplazarlo.

Alternativa descartada: convertir tablas en tarjetas apiladas en móvil. Requeriría duplicar datos en el DOM o generar markup alterno desde JavaScript, y la consigna pide explícitamente el desplazamiento dentro del contenedor.

### Foco visible global, con variante sobre fondo oscuro

`:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }` en `base.css`, sin ninguna regla `outline: none`. En el menú sobre fondo `--tinta` se cambia solo `outline-color` a `#ffd166` para conservar contraste. El enlace «Saltar al contenido» está fuera de pantalla y aparece al enfocarse (`.salto:focus`).

Alternativa descartada: estilos de foco por componente. Se descartó por riesgo de olvidar controles; una regla global garantiza cobertura y las excepciones son mínimas y explícitas.

### Errores con tres señales: texto, prefijo y borde

`.mensaje--error` y `.errores` combinan color, borde izquierdo y prefijo textual generado con `::before` (`✖`; `✔` para éxito, `ℹ` para información). Los errores por campo usan `.error-campo` (texto) y `[aria-invalid="true"]` cambia además el estilo del borde a discontinuo. Nunca se usa el color como única señal.

Alternativa descartada: íconos de una fuente externa. Prohibido por el alcance sin CDNs; los prefijos Unicode no requieren recursos.

### Imagen del encabezado decorativa

`<img src="assets/img/logo.svg" alt="" width="40" height="40">` dentro de `.marca`, junto al texto «Librería Lomo». El texto ya nombra la marca; repetirla en `alt` haría que el lector de pantalla la anuncie dos veces.

### `[hidden] { display: none !important; }` como guarda del estado

Los mensajes de vacío, resultados y errores se alternan con el atributo `hidden` desde JavaScript. Como varios contenedores declaran `display: flex` o `grid`, la regla `!important` evita que esas declaraciones anulen `hidden` y dejen visible un mensaje que debería estar oculto.

Alternativa descartada: clases `.oculto` controladas por JavaScript. Duplicaría el mecanismo y obligaría a tocar el JS, fuera del alcance de C-02.

### Movimiento reducido

`@media (prefers-reduced-motion: reduce)` anula transiciones, animaciones y `scroll-behavior` con `!important`, porque hoy el sitio no anima pero la regla protege futuros agregados sin costo.

## Risks / Trade-offs

- [`min-width: 30rem` en tablas pequeñas como Clientes] → a 320 px esas tablas también desplazan dentro de su contenedor; es el comportamiento aceptado por la consigna y no afecta la página.
- [Dependencia de `:has()` para mostrar la vista activa y el catálogo por defecto] → requiere navegador moderno; el README ya declara Chrome, Edge o Firefox actuales. Sin `:has()`, las vistas apiladas seguirían siendo navegables por anclas.
- [Textos largos sin espacios (emails, ISBN) podrían desbordar] → `overflow-wrap: break-word` en `body` y `min-width: 0` en campos y columnas de grilla.
- [Ampliar la paleta o la escala sin tokens puede reintroducir literales] → los valores sueltos que quedan (`#6b7a8a` en bordes de control, `#f2a900`/`#ffd166` en foco) son intencionales por contraste; cualquier color nuevo debería entrar como token.
- [Cierre retrospectivo: el CSS ya está escrito y validado visualmente, pero el caso manual 8 sigue «Pendiente de ejecución» en el README] → el registro de la verificación corresponde a C-06; este change no declara aprobado ningún caso no ejecutado.

## Migration Plan

No aplica migración de datos ni de código: el cambio se documenta después de implementado. Para revertir la presentación alcanza con quitar los cuatro `<link rel="stylesheet">` de `index.html` (o revertir `8d8ed92` y `c71db9f` junto con los ajustes posteriores de `components.css`); el HTML sigue siendo válido sin estilos, aunque pierde la conmutación de vistas por `:target`.

## Open Questions

- ¿Se documentará la paleta y la escala de espaciado en el README de entrega? Es material de C-06 y no altera este diseño ni los requisitos.
