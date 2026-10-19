# Funcionalidades

Organizadas por **épica** y luego por **historia de usuario** (formato `US-NNN`). Cada criterio de aceptación (CA) es verificable por observación manual, tal como lo exige la consigna ("comprobable mediante casos manuales reproducibles").

## Épica 1: Estructura y navegación HTML

### US-001 — Punto de entrada y estructura semántica
**Como** operador de librería
**Quiero** abrir el proyecto desde un único `index.html`
**Para** acceder a todas las vistas sin instalar nada.

**Criterios de aceptación**:
- [ ] CA-1: `index.html` abre con doble clic en el navegador, sin npm, sin servidor y sin errores en consola.
- [ ] CA-2: La página tiene `<header>` (título de la librería), `<nav>` (navegación) y `<main>` (contenido).
- [ ] CA-3: La navegación es visible y permite llegar a Catálogo, Libros, Clientes, Ventas e Historial.

**Reglas relacionadas**: RN-UI-01, RN-TEC-08, RN-UI-16

### US-002 — Formularios etiquetados y acciones descriptivas
**Como** operador de librería
**Quiero** que cada campo esté identificado y que los botones digan qué hacen
**Para** completar los formularios sin ambigüedad.

**Criterios de aceptación**:
- [ ] CA-1: Todo campo de entrada tiene su `<label>` asociado.
- [ ] CA-2: Todo botón tiene un texto que describe su acción (ej.: "Registrar libro", "Confirmar venta", "Quitar renglón").
- [ ] CA-3: Todas las tablas tienen encabezados (`<thead>` con `<th>`).

**Reglas relacionadas**: RN-UI-02, RN-UI-03, RN-UI-04

### US-003 — Mensajes de estado
**Como** operador de librería
**Quiero** saber siempre qué pasó con mi acción
**Para** no quedarme con la duda de si el registro se guardó.

**Criterios de aceptación**:
- [ ] CA-1: Las listas sin registros muestran un mensaje de lista vacía.
- [ ] CA-2: Una búsqueda sin resultados muestra un mensaje claro.
- [ ] CA-3: Una operación aceptada muestra un mensaje de resultado.
- [ ] CA-4: Una operación rechazada muestra el motivo del rechazo.

**Reglas relacionadas**: RN-UI-05, RN-HIS-04

---

## Épica 2: Presentación y uso adaptable

### US-004 — Identidad visual coherente
**Como** operador de librería
**Quiero** una interfaz con identidad propia
**Para** que el sistema se vea como un producto cuidado y no como una maqueta suelta.

**Criterios de aceptación**:
- [ ] CA-1: Existen colores, tipografía, espaciado, tarjetas, estilos de formulario y de botón definidos de forma coherente.
- [ ] CA-2: El CSS vive en archivos externos (`.css`), no en estilos inline dentro del HTML.
- [ ] CA-3: Elementos equivalentes reutilizan las mismas clases.

**Reglas relacionadas**: RN-UI-06, RN-UI-07, RN-UI-08

### US-005 — Adaptación a 320 px y 1280 px
**Como** operador de librería
**Quiero** usar la interfaz en una pantalla angosta y en una ancha
**Para** operar el sistema con comodidad en cualquier dispositivo.

**Criterios de aceptación**:
- [ ] CA-1: A 320 px los textos y los controles son legibles.
- [ ] CA-2: A 1280 px la composición aprovecha el ancho sin quedar dispersa.
- [ ] CA-3: En ambos anchos la página no tiene desplazamiento horizontal.
- [ ] CA-4: Las tablas anchas se desplazan dentro de su propio contenedor.

**Reglas relacionadas**: RN-UI-09, RN-UI-10, RN-UI-11

### US-006 — Accesibilidad básica
**Como** operador de librería que navega con teclado o con lector de pantalla
**Quiero** foco visible, errores en texto y textos alternativos
**Para** operar el sistema sin depender del color ni del mouse.

**Criterios de aceptación**:
- [ ] CA-1: Todos los controles son alcanzables con `Tab` y tienen foco visible.
- [ ] CA-2: Los errores se leen como texto (no solo como cambio de color).
- [ ] CA-3: Las imágenes informativas tienen `alt`; las decorativas no repiten la información del texto cercano.

**Reglas relacionadas**: RN-UI-12, RN-UI-13, RN-UI-14

---

## Épica 3: Datos locales, catálogo y filtro

### US-007 — Set de datos iniciales
**Como** operador de librería
**Quiero** que la aplicación arranque con datos de ejemplo
**Para** poder probar todas las funciones sin tener que cargar datos a mano.

**Criterios de aceptación**:
- [ ] CA-1: Hay al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes.
- [ ] CA-2: Cada libro referencia una editorial existente y al menos un autor existente.
- [ ] CA-3: Los datos son ficticios y están identificados como ejemplos.

**Reglas relacionadas**: RN-CAT-01, RN-CAT-02, RN-EXC-02

### US-008 — Catálogo generado desde los datos
**Como** operador de librería
**Quiero** ver el catálogo generado a partir del array de libros
**Para** que la lista y los datos sean siempre coherentes entre sí.

**Criterios de aceptación**:
- [ ] CA-1: El listado del catálogo se construye con JavaScript, no con HTML estático.
- [ ] CA-2: Cada libro muestra título, ISBN, editorial, género, autores y precio.
- [ ] CA-3: Un libro sin género muestra «Sin clasificar».

**Reglas relacionadas**: RN-CAT-04, RN-CAT-10, RN-CAT-11

### US-009 — Filtro por título
**Como** operador de librería
**Quiero** buscar por una parte del título
**Para** encontrar un libro concreto sin recorrer todo el catálogo.

**Criterios de aceptación**:
- [ ] CA-1: La búsqueda "el jardín" encuentra "El Jardín de las Máquinas" (coincidencia parcial).
- [ ] CA-2: La búsqueda no distingue mayúsculas de minúsculas ("EL JARDÍN" encuentra el mismo libro).
- [ ] CA-3: Los espacios sobrantes en los extremos de la búsqueda se ignoran ("  el jardín  " funciona igual).
- [ ] CA-4: Una búsqueda vacía muestra todo el catálogo.
- [ ] CA-5: Una búsqueda sin coincidencias muestra un mensaje claro y no una lista vacía sin explicación.

**Reglas relacionadas**: RN-CAT-05, RN-CAT-06, RN-CAT-07, RN-CAT-08, RN-CAT-09

---

## Épica 4: Alta de libros

### US-010 — Formulario de alta de libros
**Como** operador de librería
**Quiero** registrar un libro con su editorial, género y autores
**Para** ampliar el catálogo sin tocar el código.

**Criterios de aceptación**:
- [ ] CA-1: El formulario tiene título, ISBN, precio, editorial, género y autores.
- [ ] CA-2: El selector de editorial y el de género se llenan con los datos locales.
- [ ] CA-3: Los autores se seleccionan con un control múltiple o equivalente.
- [ ] CA-4: El selector de género incluye la opción «Sin clasificar».

**Reglas relacionadas**: RN-LIB-01, RN-LIB-11, RN-LIB-12, RN-LIB-13

### US-011 — Validación del alta de libros
**Como** operador de librería
**Quiero** que el sistema rechace los datos incorrectos
**Para** no cargar el catálogo con registros inválidos.

**Criterios de aceptación**:
- [ ] CA-1: Se rechaza título vacío.
- [ ] CA-2: Se rechaza ISBN vacío.
- [ ] CA-3: Se rechaza un ISBN ya existente (comparado sin espacios ni guiones).
- [ ] CA-4: Se rechaza un precio no numérico o menor o igual a cero.
- [ ] CA-5: Se rechaza la selección de más de un autor sin selección de al menos uno.
- [ ] CA-6: Se rechaza una editorial o un género que no existan en los datos locales.
- [ ] CA-7: El error se muestra cerca del formulario y en texto.
- [ ] CA-8: El envío está controlado con `preventDefault` y solo se agrega el libro si todas las comprobaciones pasan.

**Reglas relacionadas**: RN-LIB-02, RN-LIB-03, RN-LIB-04, RN-LIB-05, RN-LIB-06, RN-LIB-07, RN-LIB-08, RN-LIB-09, RN-LIB-10, RN-LIB-14, RN-LIB-15

### US-012 — Actualización sin recarga
**Como** operador de librería
**Quiero** ver el libro nuevo en el listado y en los selectores de venta
**Para** seguir trabajando sin perder el estado de la pantalla.

**Criterios de aceptación**:
- [ ] CA-1: Tras el alta, el listado de libros incluye el registro nuevo.
- [ ] CA-2: El selector de libro de la venta incluye el registro nuevo.
- [ ] CA-3: La página no se recarga.

**Reglas relacionadas**: RN-LIB-16

---

## Épica 5: Alta de clientes

### US-013 — Formulario de alta de clientes
**Como** operador de librería
**Quiero** registrar un cliente con nombre completo y email
**Para** poder seleccionarlo al armar una venta.

**Criterios de aceptación**:
- [ ] CA-1: El formulario tiene nombre completo y email; no hay campo de apellido separado.
- [ ] CA-2: Tras el alta, el listado y el selector de cliente de Ventas se actualizan sin recargar.

**Reglas relacionadas**: RN-CLI-01, RN-CLI-07

### US-014 — Validación del alta de clientes
**Como** operador de librería
**Quiero** que no se repitan clientes ni se acepten emails inválidos
**Para** mantener el padrón de clientes confiable.

**Criterios de aceptación**:
- [ ] CA-1: Se rechaza nombre completo vacío.
- [ ] CA-2: Se rechaza email vacío.
- [ ] CA-3: Se rechaza un email con formato inválido.
- [ ] CA-4: Se rechaza un email ya existente, sin distinguir mayúsculas de minúsculas y sin espacios exteriores.
- [ ] CA-5: Solo se agrega el cliente si todas las comprobaciones pasan; el error se muestra cerca del formulario.

**Reglas relacionadas**: RN-CLI-02, RN-CLI-03, RN-CLI-04, RN-CLI-05, RN-CLI-06, RN-CLI-15

---

## Épica 6: Venta simulada

### US-015 — Composición de la venta
**Como** operador de librería
**Quiero** elegir cliente y agregar renglones
**Para** registrar una venta con sus cantidades.

**Criterios de aceptación**:
- [ ] CA-1: Se puede seleccionar un cliente existente.
- [ ] CA-2: Se puede agregar un renglón con un libro existente y una cantidad entera mayor que cero.
- [ ] CA-3: No se admiten libros repetidos: se modifica la cantidad del renglón existente o se informa el duplicado.
- [ ] CA-4: Antes de confirmar se pueden cambiar cantidades y quitar renglones.
- [ ] CA-5: Cada renglón muestra libro, cantidad, precio unitario y subtotal.

**Reglas relacionadas**: RN-VTA-01, RN-VTA-02, RN-VTA-03, RN-VTA-04, RN-VTA-05

### US-016 — Cálculo de importes
**Como** operador de librería
**Quiero** ver el total antes de confirmar
**Para** verificar la venta antes de registrarla.

**Criterios de aceptación**:
- [ ] CA-1: El subtotal de un renglón es cantidad × precio unitario.
- [ ] CA-2: El total es la suma de los subtotales.
- [ ] CA-3: Todos los importes se presentan con dos decimales.

**Reglas relacionadas**: RN-VTA-06, RN-VTA-07, RN-VTA-08

### US-017 — Confirmación de la venta
**Como** operador de librería
**Quiero** confirmar una venta válida
**Para** que quede registrada en el historial con su total.

**Criterios de aceptación**:
- [ ] CA-1: No se confirma una venta sin cliente, sin renglones o con cantidades inválidas.
- [ ] CA-2: Al confirmar se registra identificador, fecha, cliente, renglones y total.
- [ ] CA-3: El precio unitario queda copiado en el renglón como valor histórico.
- [ ] CA-4: Se conservan los datos descriptivos necesarios para leer la venta.
- [ ] CA-5: El formulario queda limpio para una nueva venta y se muestra un mensaje de resultado.
- [ ] CA-6: La venta confirmada no se puede editar ni eliminar desde la interfaz.

**Reglas relacionadas**: RN-VTA-09, RN-VTA-10, RN-VTA-11, RN-VTA-12, RN-VTA-13, RN-VTA-14, RN-VTA-15

---

## Épica 7: Historial

### US-018 — Listado de ventas
**Como** operador de librería
**Quiero** ver todas las ventas registradas
**Para** consultar la operatoria histórica.

**Criterios de aceptación**:
- [ ] CA-1: El historial muestra identificador, fecha, cliente y total de cada venta.
- [ ] CA-2: Si no hay ventas, se muestra un mensaje de lista vacía.

**Reglas relacionadas**: RN-HIS-01, RN-HIS-04

### US-019 — Detalle de una venta
**Como** operador de librería
**Quiero** abrir el detalle de una venta
**Para** ver qué libros y qué importes la componen.

**Criterios de aceptación**:
- [ ] CA-1: Desde el historial se accede al detalle de los renglones.
- [ ] CA-2: El detalle muestra los importes tal como se confirmó la venta.
- [ ] CA-3: Cambiar el precio de un libro en el catálogo guardado no altera el detalle de una venta ya confirmada.

**Reglas relacionadas**: RN-HIS-02, RN-HIS-03, RN-VTA-11, RN-PER-05

---

## Épica 8: Persistencia, verificación y documentación

### US-020 — Persistencia en `localStorage`
**Como** operador de librería
**Quiero** que mis registros sobrevivan a una recarga
**Para** no perder el trabajo hecho.

**Criterios de aceptación**:
- [ ] CA-1: Los libros, clientes y ventas quedan guardados en `localStorage`.
- [ ] CA-2: En el primer inicio se cargan los ejemplos.
- [ ] CA-3: Al reabrir se recuperan los registros guardados **sin duplicar los datos iniciales**.

**Reglas relacionadas**: RN-PER-01, RN-PER-02, RN-PER-03

### US-021 — Comprobación guiada del precio histórico
**Como** docente revisor
**Quiero** que el precio de una venta confirmada sobreviva a un cambio de precio en el catálogo
**Para** verificar que el historial es inmutable frente al catálogo.

**Criterios de aceptación**:
- [ ] CA-1: Se confirma una venta y se anotan sus importes.
- [ ] CA-2: Con las herramientas de almacenamiento del navegador se modifica únicamente el precio del libro dentro del catálogo guardado, sin modificar ni borrar las ventas guardadas.
- [ ] CA-3: Al recargar la página y consultar el detalle de la venta anterior, el precio unitario, los subtotales y el total conservan los valores confirmados.
- [ ] CA-4: El README identifica la ubicación y la estructura del catálogo guardado para reproducir la comprobación.

**Reglas relacionadas**: RN-PER-05, RN-PER-06, RN-VTA-11, RN-HIS-03

### US-022 — Registro de los 7 casos manuales en el README
**Como** docente revisor
**Quiero** leer en el README el resultado observado de cada caso manual
**Para** comprobar que las funcionalidades fueron verificadas de verdad.

**Criterios de aceptación**:
- [ ] CA-1: El README registra los 7 casos con el resultado **observado**, no solo el esperado.
- [ ] CA-2: Si un caso falla o una funcionalidad queda pendiente, se registra el comportamiento real.
- [ ] CA-3: No se declara ninguna prueba como aprobada sin haberla ejecutado.

**Reglas relacionadas**: RN-PER-07

### US-023 — Casos manuales obligatorios

Los 7 casos son los que la consigna exige registrar. Cada historiaCodifica un caso verificable:

**US-023.1 — Búsqueda por título**
**Criterios de aceptación**: (a) una parte del título en mayúsculas devuelve coincidencias sin distinguir mayúsculas; (b) el catálogo completo se muestra con búsqueda vacía; (c) un texto inexistente muestra un mensaje sin resultados.
**Reglas relacionadas**: RN-CAT-05, RN-CAT-08, RN-CAT-09

**US-023.2 — Alta de libro con ISBN existente y luego nuevo**
**Criterios de aceptación**: (a) el ISBN duplicado se rechaza; (b) el libro con ISBN nuevo aparece en el catálogo y en el selector de venta.
**Reglas relacionadas**: RN-LIB-04, RN-LIB-16

**US-023.3 — Alta de cliente con email inválido, existente en mayúsculas y nuevo**
**Criterios de aceptación**: (a) el email inválido se rechaza; (b) el email existente en mayúsculas se rechaza; (c) el cliente nuevo aparece en el listado y en el selector de venta.
**Reglas relacionadas**: RN-CLI-04, RN-CLI-05, RN-CLI-07

**US-023.4 — Venta sin cliente, cantidad cero, negativa o decimal; libro repetido**
**Criterios de aceptación**: (a) la venta no se confirma; (b) el duplicado no crea otro renglón.
**Reglas relacionadas**: RN-VTA-02, RN-VTA-03, RN-VTA-09

**US-023.5 — Venta válida: dos unidades a 1500 y una a 2000**
**Criterios de aceptación**: subtotales 3000 y 2000; total 5000; detalle conservado en el historial.
**Reglas relacionadas**: RN-VTA-06, RN-VTA-07, RN-VTA-11, RN-HIS-03

**US-023.6 — Venta confirmada y cambio exclusivo del precio de catálogo guardado**
**Criterios de aceptación**: al consultar nuevamente el historial después de recargar, el precio unitario, los subtotales y el total de esa venta conservan los valores confirmados.
**Reglas relacionadas**: RN-VTA-11, RN-PER-05, RN-HIS-03

**US-023.7 — Recarga después de altas y venta**
**Criterios de aceptación**: se recuperan los datos sin duplicar ejemplos ni ventas.
**Reglas relacionadas**: RN-PER-01, RN-PER-02, RN-PER-03

---

## Épica 9: Entrega y documentación

### US-024 — README de entrega
**Como** docente revisor
**Quiero** un README completo
**Para** abrir, operar y evaluar la entrega sin asistencia externa.

**Criterios de aceptación**:
- [ ] CA-1: Identifica a quienes realizan el trabajo.
- [ ] CA-2: Contiene los pasos para abrir `index.html` en el navegador sin npm.
- [ ] CA-3: Describe la navegación entre vistas.
- [ ] CA-4: Enumera las funcionalidades implementadas y las pendientes.
- [ ] CA-5: Indica la ubicación de los datos iniciales en `localStorage`.
- [ ] CA-6: Explica el funcionamiento y los límites de `localStorage`.
- [ ] CA-7: Incluye los resultados de los casos manuales.
- [ ] CA-8: Declara la procedencia de imágenes ajenas, si existen.

**Reglas relacionadas**: RN-TEC-11, RN-PER-04, RN-PER-06, RN-PER-07

### US-025 — Formato de entrega
**Como** docente revisor
**Quiero** una carpeta o archivo comprimido con la estructura pedida
**Para** evaluar la entrega tal como fue.

**Criterios de aceptación**:
- [ ] CA-1: Contiene `index.html`, los demás HTML si corresponde, carpetas de CSS, JavaScript y recursos locales, y `README.md`.
- [ ] CA-2: No contiene dependencias instaladas ni herramientas de compilación.

**Reglas relacionadas**: RN-TEC-06, RN-TEC-11
