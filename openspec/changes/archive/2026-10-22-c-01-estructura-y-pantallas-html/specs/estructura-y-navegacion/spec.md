# Spec Delta

## Purpose

Define la estructura HTML semántica y la navegación por anclas entre las cinco vistas del sistema de librería, con formularios etiquetados, tablas encabezadas y mensajes de estado verificables.

## ADDED Requirements

### Requirement: Punto de entrada único

El sistema SHALL exponer toda la interfaz desde un único `index.html` en la raíz del proyecto, abierto directamente en el navegador sin npm, servidor, compilación ni dependencias instaladas.

#### Scenario: Apertura directa del archivo

- **WHEN** se abre `index.html` con doble clic desde el explorador de archivos
- **THEN** se cargan la estructura, los estilos locales y las cinco vistas sin ejecutar ningún proceso de compilación

#### Scenario: Sin otra página de entrada

- **WHEN** se inspecciona la raíz del proyecto
- **THEN** no existe otra página HTML que duplique la navegación ni se necesita una URL distinta para llegar a las vistas

### Requirement: Estructura semántica y regiones

El documento SHALL declarar `lang="es"` y organizarse con `<header>` para la marca, `<nav>` para la navegación principal, `<main>` para el contenido y `<footer>` para el pie, de modo que las regiones se reconozcan al navegar con lector de pantalla.

#### Scenario: Regiones identificadas

- **WHEN** se inspecciona la página
- **THEN** existen un `header`, un `nav` con `aria-label="Navegación principal"`, un `main` con identificador `contenido` y un `footer`, cada uno envolviendo el contenido que le corresponde

#### Scenario: Salto al contenido

- **WHEN** la persona presiona `Tab` como primer foco de la página
- **THEN** aparece el enlace "Saltar al contenido" y al activarlo el foco se traslada al contenido principal

### Requirement: Navegación por anclas entre cinco vistas

La navegación principal SHALL enlazar las vistas Catálogo, Libros, Clientes, Ventas e Historial mediante las anclas `#catalogo`, `#libros`, `#clientes`, `#ventas` y `#historial`, y SHALL mostrar una sola vista a la vez.

#### Scenario: Menú completo y visible

- **WHEN** se observa el encabezado
- **THEN** están los cinco enlaces con esos nombres y destinos, disponibles en cualquier vista

#### Scenario: Cambio de vista sin recarga

- **WHEN** se activa el enlace "Clientes"
- **THEN** la URL incorpora `#clientes`, se muestra solo la sección de clientes y la página no se recarga

#### Scenario: Enlace activo señalado

- **WHEN** una vista está activa
- **THEN** su enlace en el menú se distingue con fondo, peso y subrayado, no únicamente por el color

### Requirement: Vista inicial por defecto

Si la URL no incluye un ancla de vista, el sistema SHALL mostrar el Catálogo como vista inicial y SHALL marcar su enlace como activo.

#### Scenario: Apertura sin ancla

- **WHEN** se abre `index.html` sin hash en la URL
- **THEN** se ve el catálogo con su título, su buscador y su listado, mientras las demás vistas permanecen ocultas

### Requirement: Encabezados y regiones de vista

Cada vista SHALL comenzar con su propio encabezado y SHALL declararse como sección etiquetada por ese encabezado mediante `aria-labelledby`, para que su nombre se anuncie al recorrer las regiones.

#### Scenario: Nombres de las vistas

- **WHEN** se recorre la página por regiones
- **THEN** cada sección anuncia Catálogo, Libros, Clientes, Ventas e Historial de ventas respectivamente

#### Scenario: Título visible al entrar

- **WHEN** se activa un enlace del menú
- **THEN** la vista muestra su título al inicio y ese título coincide con el nombre del enlace

### Requirement: Etiquetas asociadas a los campos

Todo control de formulario SHALL tener una etiqueta asociada mediante `<label for>` con el identificador del control, todo grupo de controles relacionados SHALL usar `<fieldset>` con `<legend>`, y las ayudas y los errores SHALL asociarse al control con `aria-describedby`.

#### Scenario: Etiqueta por campo

- **WHEN** se inspeccionan los formularios de búsqueda, alta de libro, alta de cliente y venta
- **THEN** cada `input` y cada `select` tiene un `label` cuyo atributo `for` coincide con su `id`

#### Scenario: Grupos rotulados

- **WHEN** se revisan el grupo de autores del libro y el grupo de alta de renglón de la venta
- **THEN** cada grupo está dentro de un `fieldset` con un `legend` que lo nombra

#### Scenario: Ayuda y error asociados

- **WHEN** un campo muestra un texto de ayuda o un mensaje de error
- **THEN** ese texto está referenciado desde el control mediante `aria-describedby`

### Requirement: Botones con texto que describe su acción

Todo botón SHALL tener un nombre accesible en texto que describa la acción que ejecuta y el alcance sobre el que actúa; no SHALL existir botones identificados solo por un ícono.

#### Scenario: Acciones principales

- **WHEN** se revisan los formularios
- **THEN** los botones dicen "Buscar libros", "Guardar libro", "Guardar cliente", "Agregar renglón" y "Confirmar venta" según el formulario al que pertenecen

#### Scenario: Acciones de limpieza

- **WHEN** se revisa cada formulario
- **THEN** su botón de limpieza nombra el alcance —"Limpiar búsqueda", "Limpiar formulario" o "Vaciar venta"— y no se limita a "Limpiar" o "Reset"

#### Scenario: Acción auxiliar

- **WHEN** se revisa el alta de un autor nuevo desde el formulario de libro
- **THEN** el botón que suma el autor se rotula "Agregar"

### Requirement: Tablas con encabezados

Toda tabla de datos SHALL tener `<thead>` con celdas `<th scope="col">`, y los totales SHALL declararse en `<tfoot>` con `<th scope="row">`, para que se anuncie la relación entre encabezado y celda.

#### Scenario: Encabezado en cada columna

- **WHEN** se revisan las tablas de libros, clientes, renglones de venta, historial y detalle de venta
- **THEN** cada tabla tiene un `thead` con un `th` de alcance de columna por cada columna de datos

#### Scenario: Fila de total rotulada

- **WHEN** se revisa el pie de la tabla de renglones y el del detalle de venta
- **THEN** el total se rotula con un `th` de alcance de fila y el importe ocupa la última columna

### Requirement: Mensajes de estado textuales

Las vistas SHALL incluir mensajes en texto para lista vacía, búsqueda sin resultados y resultado de operación aceptada o rechazada; los mensajes no SHALL depender solo del color y SHALL anunciarse como estado (`role="status"`) o alerta (`role="alert"`).

#### Scenario: Lista vacía

- **WHEN** una colección no tiene registros
- **THEN** se muestra un mensaje que lo dice en texto, por ejemplo "No hay libros registrados todavía."

#### Scenario: Búsqueda sin resultados

- **WHEN** la búsqueda no encuentra coincidencias
- **THEN** aparece "No se encontraron libros que coincidan con la búsqueda." en lugar de una lista vacía sin explicación

#### Scenario: Operación aceptada

- **WHEN** una operación se completa correctamente
- **THEN** el resultado se anuncia en una región `role="status"` con `aria-live="polite"` y texto visible

#### Scenario: Operación rechazada

- **WHEN** una operación se rechaza
- **THEN** el motivo aparece en texto dentro de una región `role="alert"`, además del cambio de color

### Requirement: Imágenes decorativas sin texto redundante

Las imágenes decorativas SHALL llevar `alt=""` para no repetir el texto que las acompaña, y ninguna imagen SHALL quedar sin atributo `alt`.

#### Scenario: Logotipo del encabezado

- **WHEN** se inspecciona el enlace de marca del encabezado
- **THEN** el logotipo tiene `alt=""` porque el nombre "Librería Lomo" ya se presenta como texto junto a él

#### Scenario: Imágenes sin alt

- **WHEN** se revisan las imágenes de la página
- **THEN** todas declaran el atributo `alt`, vacío cuando son decorativas
