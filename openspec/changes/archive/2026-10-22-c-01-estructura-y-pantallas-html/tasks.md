# Tasks

> Cierre retrospectivo: todas las tareas ya se ejecutaron en los commits indicados. La columna de verificación describe cómo se comprobó cada una sobre el código entregado; los casos manuales de navegador quedan registrados en `C-06`, no se declaran aprobados aquí.

## 1. Punto de entrada y esqueleto semántico

- [x] 1.1 Crear `index.html` en la raíz con `<!DOCTYPE html>`, `lang="es"`, `meta charset`, `viewport`, título descriptivo, favicon local y las cuatro hojas de estilo externas — verificado: al abrir el archivo por `file://` no hay errores de carga de recursos ni CSS embebido (`50632e4`)
- [x] 1.2 Agregar el enlace "Saltar al contenido" y las regiones `<header>`, `<nav aria-label="Navegación principal">`, `<main id="contenido">` y `<footer>` — verificado por inspección: cada región envuelve su contenido y el enlace apunta a `#contenido` (`50632e4`)
- [x] 1.3 Agregar el menú `.menu` con los cinco enlaces a `#catalogo`, `#libros`, `#clientes`, `#ventas` y `#historial`, y el enlace de marca hacia `#catalogo` con el logo de `alt=""` — verificado: los cinco destinos existen como `id` en el documento (`50632e4`)
- [x] 1.4 Dejar el punto de carga de scripts al final del `body`, sin `<script>` ni `<style>` inline, con los archivos externos en orden de dependencia — verificado por inspección del cierre del documento (`50632e4`, scripts incorporados en `f7f90d3`)

## 2. Vista Catálogo

- [x] 2.1 Maquetar `<section id="catalogo" aria-labelledby="t-catalogo">` con su `<h1>` y el formulario de búsqueda `role="search"`: etiqueta del campo, ayuda asociada y botones "Buscar libros" y "Limpiar búsqueda" — verificado: el campo `#busqueda-titulo` tiene `label for` y `aria-describedby` a la ayuda (`e6ccfae`)
- [x] 2.2 Agregar el estado del catálogo: contador `role="status"`, mensaje de lista vacía, mensaje de búsqueda sin resultados y contenedor `#lista-catalogo` para las tarjetas — verificado: los mensajes existen con texto propio y arrancan con `hidden` (`e6ccfae`)

## 3. Vistas Libros y Clientes

- [x] 3.1 Maquetar el formulario de alta de libro con título, ISBN, precio, editorial (`datalist`), género (`select`) y autores (`fieldset` con `legend` "Autor, es" más alta de autor nuevo) — verificado: cada control tiene `label for` y cada ayuda/error está referenciada con `aria-describedby` (`e6ccfae`, etiqueta y altas con texto libre en `f867464`)
- [x] 3.2 Agregar los mensajes del formulario de libro (`role="alert"` para errores, `role="status"` para el resultado) y los botones "Guardar libro" y "Limpiar formulario" — verificado: las regiones tienen `id` y texto en español (`e6ccfae`)
- [x] 3.3 Agregar la tabla de libros registrados con `thead`, seis columnas con `th scope="col"` y envoltura desplazable con nombre accesible — verificado: el `tbody` queda vacío y el mensaje de lista vacía cubre el estado inicial (`e6ccfae`)
- [x] 3.4 Maquetar el formulario de cliente (nombre completo y email), sus mensajes y los botones "Guardar cliente" y "Limpiar formulario" — verificado: ambos campos tienen `label for`, ayuda/error asociados y el formulario usa `novalidate` (`e6ccfae`)
- [x] 3.5 Agregar la tabla de clientes registrados con `thead` y `th scope="col"` por columna, junto con su mensaje de lista vacía — verificado por inspección del marcado (`e6ccfae`)

## 4. Vistas Ventas e Historial

- [x] 4.1 Maquetar el formulario de venta: selección de cliente, `fieldset` "Agregar renglón" con libro y cantidad, botón "Agregar renglón" y región de errores — verificado: los `select` e `input` tienen etiqueta asociada y el grupo tiene `legend` (`e633fd1`)
- [x] 4.2 Agregar la tabla de renglones con `thead`, `tfoot` de total (`th scope="row"`), mensaje de renglones vacío, resumen en `<dl>` y los botones "Confirmar venta" y "Vaciar venta" — verificado: la columna del total es la última y el mensaje de resultado usa `role="status"` (`e633fd1`)
- [x] 4.3 Agregar la tabla de historial (identificador, fecha, cliente, total, detalle) con su `thead`, `th scope="col"` y mensaje de lista vacía — verificado por inspección del marcado (`e633fd1`)
- [x] 4.4 Agregar la sección de detalle de venta con su título, su mensaje de detalle vacío, su tabla con `thead`, `tfoot` de total y la referencia al título de la sección — verificado: el pie de la tabla usa `th scope="row"` (`e633fd1`)

## 5. Navegación y vista inicial

- [x] 5.1 Declarar en `css/layout.css` la visibilidad por ancla: `.vista` oculta, `.vista:target` visible y catálogo visible cuando no hay ancla — verificado: abrir `index.html` sin hash y con cada ancla muestra una sola vista (`8d8ed92`, rama de presentación `C-02`)
- [x] 5.2 Señalar el enlace activo del menú con fondo, peso y subrayado además del color — verificado: las reglas de `:has(:target)` cubren las cinco vistas y el caso sin ancla (`8d8ed92`)
- [x] 5.3 Comprobar que cada vista es una `<section aria-labelledby>` con un título visible al inicio y que el nombre coincide con el enlace del menú — verificado por inspección de `index.html` (`e633fd1`)

## 6. Verificación de cierre

- [x] 6.1 Verificar sobre el marcado que todos los `input` y `select` de los cuatro formularios tienen `label for` con el `id` correcto, y que los grupos usan `fieldset`/`legend` — verificado por revisión cruzada de `for`/`id` (`e6ccfae`, `e633fd1`)
- [x] 6.2 Verificar que los diez botones tienen texto que describe su acción y que ningún botón depende de un ícono — verificado: "Buscar libros", "Limpiar búsqueda", "Guardar libro", "Limpiar formulario", "Agregar", "Guardar cliente", "Agregar renglón", "Confirmar venta" y "Vaciar venta" (`e6ccfae`, `e633fd1`)
- [x] 6.3 Verificar que las cinco tablas tienen `thead`, `th scope="col"` y que los dos pies de total usan `th scope="row"` — verificado por inspección del marcado (`e6ccfae`, `e633fd1`)
- [x] 6.4 Verificar que existen los mensajes de lista vacía, búsqueda sin resultados y resultado aceptado/rechazado, con texto y regiones `status`/`alert` — verificado: no hay mensajes que dependan solo del color (`e6ccfae`, `e633fd1`)
- [x] 6.5 Verificar que todas las imágenes declaran `alt` y que el logotipo del encabezado usa `alt=""` para no repetir "Librería Lomo" — verificado sobre `index.html` (`50632e4`)

## Workflow follow-up

- Registrar en `C-06` el resultado observado de la navegación entre vistas al ejecutar los casos manuales de navegador.
- Archivar este change cuando el repositorio cierre la verificación global.
