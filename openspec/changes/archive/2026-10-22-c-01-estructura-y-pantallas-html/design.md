# Design

## Context

Ver `proposal.md` — Why. El repositorio no tiene build, ni framework, ni servidor: la única forma de ejecución es abrir `index.html` por `file://` con HTML, CSS y JavaScript nativos. Los estilos ya están separados en `css/base.css`, `css/layout.css`, `css/components.css` y `css/responsive.css`, y los scripts se cargan al final del `body` en orden de dependencia (`seed` → `persistencia` → `store` → dominio → interfaz → `main`).

La restricción que más condiciona el diseño es la navegación: no puede haber router, historial de aplicación ni estado en JavaScript. La consigna permite varias páginas o secciones de una misma página, y exige que la navegación sea clara y esté disponible en todo momento.

## Goals / Non-Goals

**Goals:**

- Cinco pantallas completas y enlazadas entre sí dentro de un solo documento, sin duplicar encabezado ni menú.
- Navegación comprensible y operable por teclado, sin depender de JavaScript para cambiar de vista.
- Estructura preparada para que los ejercicios 3 a 5 inserten contenido (listas, tablas, opciones) sin reescribir el HTML.
- Regiones, etiquetas y encabezados de tabla verificables por inspección y por lector de pantalla.

**Non-Goals:**

- Estilos, identidad visual, adaptación a 320/1280 px y foco visible: Ejercicio 2 (`C-02`).
- Datos iniciales, renderizado del catálogo y filtro: Ejercicio 3 (`C-03`).
- Validaciones de alta y venta, y persistencia: Ejercicios 4 a 6.
- Administración de editoriales, géneros o autores (la consigna no la pide).
- Soporte de navegadores antiguos sin `:has()` ni `<datalist>`.

## Decisions

### Una sola página con cinco secciones ancladas

`index.html` contiene un `<main>` con cinco `<section class="vista">` y el menú apunta a sus anclas. **Alternativa descartada:** cinco archivos HTML separados; obligaría a repetir encabezado, menú, pie y recursos en cada uno, y rompería el estado en memoria de la venta al cambiar de pantalla. La consigna admite ambas formas; una sola página reduce duplicación y es coherente con la navegación de "cinco pantallas" del README.

### Visibilidad de vistas resuelta con `:target`

`css/layout.css` oculta `.vista` y muestra solo `.vista:target`; cuando no hay ninguna vista apuntada, muestra `#catalogo`. El estado activo del menú se pinta con el mismo criterio. **Alternativa descartada:** mostrar/ocultar secciones con JavaScript y un `hidden` por vista; requiere script para la navegación, agrega estado que hay que sincronizar y deja la pantalla en blanco si el script falla. Con anclas, el enlace es también el estado: la URL es compartible y el botón "atrás" del navegador funciona sin código.

El costo es una dependencia de presentación: la maqueta necesita esas dos reglas de `layout.css` para verse como cinco pantallas. Se documenta como dependencia con `C-02` y no se duplica el CSS en el HTML (regla dura 7).

### Vista inicial: catálogo como valor por defecto

La regla `.principal:not(:has(.vista:target)) #catalogo` resuelve el caso "sin hash" sin redirección ni script. **Alternativas descartadas:** redirigir a `#catalogo` con JavaScript (parpadeo y dependencia de script) y dejar la primera sección visible por orden del documento (frágil: cualquier reordenamiento cambia la pantalla inicial).

### Regiones semánticas y salto al contenido

`header`, `nav`, `main` y `footer` envuelven el contenido; el `nav` lleva `aria-label="Navegación principal"`; cada vista es una `<section aria-labelledby>` apuntando a su encabezado. Un enlace `.salto` al inicio del `body` lleva a `#contenido`. **Alternativa descartada:** `div` con roles ARIA; no aporta nada sobre el elemento nativo y pierde el comportamiento por defecto del navegador.

Cada vista tiene su propio `<h1>` porque cada una es una pantalla independiente y su nombre debe coincidir con el del menú. El documento queda con varios `h1` en el DOM, pero solo uno visible a la vez.

### Formularios: etiqueta explícita y ayudas asociadas

Cada control usa `id` + `<label for>`; los grupos (autores del libro, alta de renglón) usan `<fieldset>` con `<legend>`; las ayudas y los errores son párrafos con `id` referenciados desde el control con `aria-describedby`. Los formularios llevan `novalidate` para que la validación quede en JavaScript y los mensajes se muestren en el lugar previsto, no en globos del navegador. **Alternativa descartada:** usar `placeholder` como etiqueta; desaparece al escribir y no es accesible.

### Mensajes de estado como contenedores fijos

Los mensajes de lista vacía, búsqueda sin resultados, resultado aceptado y error se declaran en el HTML con `id`, texto en español y `hidden`; el código posterior los muestra u oculta. Los de resultado usan `role="status"` con `aria-live="polite"`; los de error usan `role="alert"`. **Alternativa descartada:** crear los mensajes dinámicamente; complica la verificación del Ejercicio 1 sin JavaScript y multiplica los textos. El riesgo de desincronización se acota manteniendo un único `id` por mensaje y sin duplicar su texto en el script.

### Tablas con encabezado y contenedor desplazable

Las tablas de libros, clientes, renglones, historial y detalle declaran `<thead>` con `<th scope="col">` y, cuando hay total, `<tfoot>` con `<th scope="row">`. Cada tabla vive dentro de `.tabla-envoltura` con `tabindex="0"`, `role="region"` y `aria-labelledby` (o `aria-label`) para que el desplazamiento horizontal, definido en `C-02`, sea alcanzable por teclado y tenga nombre accesible. **Alternativa descartada:** dejar la tabla suelta; en pantallas angostas ensancharía la página (regla dura 10).

### Recursos locales y logotipo decorativo

El logotipo `assets/img/logo.svg` es propio y local; se usa como favicon y dentro del enlace de marca con `alt=""`, porque el nombre "Librería Lomo" ya está en texto al lado. **Alternativa descartada:** usar un CDN de iconos o una imagen con `alt="Librería Lomo"` que repita el texto adyacente.

## Risks / Trade-offs

- **Navegador sin `:has()`** → sin la regla de vista por defecto, abrir sin hash no muestra ninguna sección. Mitigación: el README exige navegador moderno y el enlace de marca apunta a `#catalogo`, que funciona con `:target` en cualquier navegador.
- **Estado de vista fuera de JavaScript** → el código de los ejercicios posteriores no puede consultar "qué vista está activa" por una variable; debe leer `location.hash` si lo necesita. Mitigación: ninguna lógica de negocio depende de la vista activa.
- **Mensajes declarados pero ocultos** → sin JavaScript los textos de estado no aparecen y los listados quedan vacíos. Mitigación: el aviso `#aviso-datos` explica que la aplicación completa requiere JavaScript; la verificación del Ejercicio 1 se hace con el script cargado.
- **Varios `h1` en el DOM** → un lector de pantalla puede anunciar cinco encabezados de nivel 1 al recorrer el documento completo. Mitigación: cada vista es una región etiquetada y solo una está visible.
- **`.tabla-envoltura` con `tabindex="0"`** → agrega una parada de tabulación por tabla. Mitigación: `role="region"` y nombre accesible hacen que esa parada anuncie su propósito en lugar de ser un foco anónimo.
- **Datos de ejemplo en el HTML** → no se escriben filas estáticas: las tablas arrancan con `tbody` vacío y los mensajes de lista vacía cubren el estado inicial. Mitigación: el contenido real lo insertan `C-03` a `C-05` sin tocar el marcado de las tablas.

## Migration Plan

No hay migración: el cambio es la línea base del proyecto y no existen usuarios, datos persistidos ni contratos previos. El "despliegue" es abrir `index.html`; revertir consiste en volver atrás los archivos `index.html` y `assets/img/logo.svg` y las reglas de visibilidad de vistas en `css/layout.css`.
