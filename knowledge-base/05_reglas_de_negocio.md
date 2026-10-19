# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad con la consigna y con los criterios de evaluación.

- **RN-CAT** — Catálogo y filtro
- **RN-LIB** — Alta de libros
- **RN-CLI** — Alta de clientes
- **RN-VTA** — Venta simulada
- **RN-HIS** — Historial
- **RN-PER** — Persistencia
- **RN-UI** — Presentación, accesibilidad y adaptación
- **RN-TEC** — Restricciones técnicas
- **RN-EXC** — Excepciones globales

---

## Dominio: Catálogo (RN-CAT)

- **RN-CAT-01**: La colección inicial incluye **al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes** ficticios.
- **RN-CAT-02**: Cada libro se relaciona con **una editorial existente** y con **uno o más autores existentes**.
- **RN-CAT-03**: El género es **opcional**; si se asigna, debe corresponder a un género existente.
- **RN-CAT-04**: El catálogo se genera con JavaScript **a partir del array de libros**, no con markup estático en el HTML.
- **RN-CAT-05**: El filtro por título **ignora las diferencias entre mayúsculas y minúsculas**.
- **RN-CAT-06**: El filtro busca **coincidencias parciales** (subcadena) en el título.
- **RN-CAT-07**: El filtro **elimina los espacios sobrantes en los extremos** de la búsqueda antes de comparar.
- **RN-CAT-08**: Una búsqueda vacía **muestra todo el catálogo**.
- **RN-CAT-09**: Una búsqueda sin coincidencias **muestra un mensaje claro**, no una tabla vacía silenciosa.
- **RN-CAT-10**: Un libro sin género asignado se muestra con la leyenda **«Sin clasificar»**.
- **RN-CAT-11**: El catálogo muestra por cada libro **título, ISBN, editorial, género, autores y precio**.
- **RN-CAT-12**: **No se requiere** administrar altas, bajas ni modificaciones de editoriales, géneros o autores.
- **RN-CAT-13**: **No se requiere** traer datos con `fetch`: todo el dataset es local.
- **RN-CAT-14**: En la etapa 1 de la consigna los listados y el historial pueden mostrar **datos estáticos de ejemplo**, siempre identificados como parte de la maqueta.

---

## Dominio: Alta de libros (RN-LIB)

- **RN-LIB-01**: El formulario registra **título, ISBN, precio** y las relaciones con **editorial, género y autores**.
- **RN-LIB-02**: El título **no puede estar vacío**.
- **RN-LIB-03**: El ISBN **no puede estar vacío**.
- **RN-LIB-04**: El ISBN **no debe existir** en el conjunto local (unicidad).
- **RN-LIB-05**: El ISBN se compara **sin espacios ni guiones**; **no se requiere implementar su dígito de control**.
- **RN-LIB-06**: El precio debe ser **numérico y mayor que cero**.
- **RN-LIB-07**: La editorial seleccionada **debe existir** en los datos locales.
- **RN-LIB-08**: **Todos** los autores seleccionados deben existir en los datos locales.
- **RN-LIB-09**: Se selecciona **al menos un autor**.
- **RN-LIB-10**: El género puede quedar sin asignar; **si se asigna, debe existir** en los datos locales.
- **RN-LIB-11**: Las opciones de editorial y género **se generan a partir de los datos locales**, mediante selectores.
- **RN-LIB-12**: Los autores se eligen con un **selector múltiple o controles de selección equivalentes**.
- **RN-LIB-13**: El selector de género incluye la opción **«Sin clasificar»**, que representa la ausencia de género.
- **RN-LIB-14**: El envío del formulario se controla con `preventDefault`; **solo se agrega el registro si todas las comprobaciones pasan**.
- **RN-LIB-15**: Los errores se muestran **cerca del formulario**, no solo en una zona lejana ni solo con color.
- **RN-LIB-16**: Tras un alta correcta, el **listado y las opciones relacionadas** (selectores de venta, por ejemplo) **se actualizan sin recargar la página**.
- **RN-LIB-17**: **No se exige editar ni eliminar** registros de libros.

---

## Dominio: Alta de clientes (RN-CLI)

- **RN-CLI-01**: El formulario registra **nombre completo y email**. **No se requiere** un campo de apellido separado.
- **RN-CLI-02**: El nombre completo **no puede estar vacío**.
- **RN-CLI-03**: El email **no puede estar vacío**.
- **RN-CLI-04**: El email debe tener un **formato válido**.
- **RN-CLI-05**: **No puede existir otro cliente con el mismo email**, comparado **sin espacios exteriores** y **sin distinguir mayúsculas de minúsculas**.
- **RN-CLI-06**: El envío se controla con `preventDefault` y **solo se agrega el registro si todas las comprobaciones pasan**.
- **RN-CLI-07**: Tras un alta correcta, el **listado y las opciones relacionadas** (selector de cliente en Ventas) **se actualizan sin recargar la página**.
- **RN-CLI-08**: **No se exige editar ni eliminar** registros de clientes.

---

## Dominio: Venta simulada (RN-VTA)

- **RN-VTA-01**: Se requiere **un cliente existente** para poder confirmar.
- **RN-VTA-02**: Se requiere **al menos un renglón**, con un **libro existente** y una **cantidad entera mayor que cero**.
- **RN-VTA-03**: **No se admiten libros repetidos** dentro de la misma venta: se **modifica la cantidad del renglón existente** o se **informa el duplicado**.
- **RN-VTA-04**: **Antes de confirmar** se permite **cambiar cantidades** y **quitar renglones**.
- **RN-VTA-05**: Cada renglón muestra **libro, cantidad, precio unitario y subtotal**.
- **RN-VTA-06**: **subtotal = cantidad × precio unitario**.
- **RN-VTA-07**: **total = Σ subtotales** de los renglones.
- **RN-VTA-08**: Los importes se presentan con **dos decimales**.
- **RN-VTA-09**: **No se confirma** una venta **sin cliente**, **sin renglones** o **con cantidades inválidas**.
- **RN-VTA-10**: Al confirmar se registra un **identificador, fecha, cliente, renglones y total**.
- **RN-VTA-11**: El **precio unitario se copia al renglón como valor histórico**: no se vuelve a obtener del precio actual del catálogo al consultar el historial.
- **RN-VTA-12**: Se conservan **los datos descriptivos necesarios para leer esa venta** (título del libro y nombre del cliente copiados como snapshot).
- **RN-VTA-13**: La confirmación **limpia el formulario** para una nueva venta y **muestra un mensaje de resultado**.
- **RN-VTA-14**: **Las ventas confirmadas no se editan ni eliminan** desde la interfaz.
- **RN-VTA-15**: La venta es **simulada**: **no gestiona stock, cobros ni facturación fiscal**.

---

## Dominio: Historial (RN-HIS)

- **RN-HIS-01**: El historial muestra **identificador, fecha, cliente y total**.
- **RN-HIS-02**: Permite **consultar los renglones** (detalle) de cada venta.
- **RN-HIS-03**: El detalle muestra los importes **tal como fueron confirmados**, aunque el precio del catálogo haya cambiado después (ver `RN-VTA-11` y `RN-PER-05`).
- **RN-HIS-04**: Si no hay ventas registradas, se muestra un **mensaje de lista vacía**.
- **RN-HIS-05**: Las ventas del historial provienen del **almacenamiento persistente** y se recuperan tras recargar (ver `RN-PER-03`).

---

## Dominio: Persistencia (RN-PER)

- **RN-PER-01**: Se utiliza `localStorage` para conservar **libros, clientes y ventas** en la etapa final.
- **RN-PER-02**: **En el primer inicio se cargan los ejemplos** (seed).
- **RN-PER-03**: Al volver a abrir la aplicación **se recuperan los registros guardados sin duplicar los datos iniciales**.
- **RN-PER-04**: El README debe explicar que el almacenamiento **depende del navegador, del perfil y de la ubicación de apertura**, y que **no comparte información entre usuarios**.
- **RN-PER-05**: El **precio histórico no depende del precio actual del catálogo**: modificar el precio guardado del catálogo no altera las ventas ya confirmadas.
- **RN-PER-06**: El README debe identificar **la ubicación y la estructura del catálogo guardado** para permitir la comprobación guiada del docente.
- **RN-PER-07**: Si un caso falla o una funcionalidad queda pendiente, se registra el **comportamiento real**: *no se indica una prueba como aprobada sin ejecutarla*.

---

## Dominio: Presentación, accesibilidad y adaptación (RN-UI)

- **RN-UI-01**: La estructura usa **encabezado, navegación y contenido principal** con etiquetas semánticas.
- **RN-UI-02**: **Cada campo posee una etiqueta asociada** (`<label for>`).
- **RN-UI-03**: **Los botones tienen textos que describen su acción** (no íconos sin texto).
- **RN-UI-04**: **Las tablas incluyen encabezados** (`<thead>`, `<th>` con `scope`).
- **RN-UI-05**: Se incorporan **mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas**.
- **RN-UI-06**: Se define una **identidad visual propia y coherente**: colores, tipografía, espaciado, tarjetas, formularios y botones.
- **RN-UI-07**: El CSS se mantiene en **archivos externos** y **se reutilizan clases** para elementos equivalentes.
- **RN-UI-08**: Se utiliza **Flexbox o Grid** para organizar el contenido.
- **RN-UI-09**: La interfaz se comprueba con un ancho de **320 px** y otro de **1280 px**: textos y controles legibles.
- **RN-UI-10**: El contenido **no provoca desplazamiento horizontal de toda la página** en esos anchos.
- **RN-UI-11**: Si una tabla necesita más espacio, **se desplaza dentro de su propio contenedor** (no la página).
- **RN-UI-12**: Los controles **conservan un foco visible** y **se recorren con el teclado**.
- **RN-UI-13**: Los **mensajes de error se expresan con texto** y no dependen únicamente de un color.
- **RN-UI-14**: Las **imágenes informativas tienen texto alternativo**; las decorativas **no repiten información innecesaria**.
- **RN-UI-15**: El **diseño no reemplaza a las validaciones**: la maqueta debe facilitar el uso de las operaciones, pero los datos se siguen validando en JavaScript.
- **RN-UI-16**: La navegación entre las 5 vistas debe ser **clara y visible** en todo momento.

---

## Dominio: Restricciones técnicas (RN-TEC)

- **RN-TEC-01**: Se utilizan **únicamente HTML, CSS y JavaScript nativos**.
- **RN-TEC-02**: **No se utilizan librerías, frameworks ni CDNs** de CSS o JavaScript. Su uso incumple el alcance técnico y se informa en la evaluación.
- **RN-TEC-03**: **No se requiere API, base de datos, servidor ni conexión con el backend**.
- **RN-TEC-04**: **No se requiere un inicio de sesión real**.
- **RN-TEC-05**: Los **estilos, scripts, imágenes y demás recursos se incluyen en el proyecto** (archivos locales).
- **RN-TEC-06**: **No se incluyen dependencias instaladas ni herramientas de compilación** en la entrega.
- **RN-TEC-07**: Se valora **código legible, nombres comprensibles, funciones acotadas** y **separación entre estructura, estilos y comportamiento**.
- **RN-TEC-08**: `index.html` es el **punto de entrada** del proyecto.
- **RN-TEC-09**: Los **datos escritos por usuarios se insertan como texto en el DOM** (no se interpretan como HTML).
- **RN-TEC-10**: Se usan **eventos y funciones con responsabilidades reconocibles** (no un bloque monolítico de código).
- **RN-TEC-11**: La entrega es una **carpeta o archivo comprimido** con `index.html`, los demás HTML si corresponden, carpetas de CSS, JavaScript y recursos locales, y `README.md`.

---

## Dominio: Excepciones globales (RN-EXC)

- **RN-EXC-01**: Las validaciones y el almacenamiento del navegador **sirven para la práctica; no representan seguridad ni integridad garantizada por un servidor**.
- **RN-EXC-02**: Los datos son **ficticios**.
- **RN-EXC-03**: La venta **no gestiona stock, cobros ni facturación fiscal**: registra cantidades y precios para obtener un total simulado.
- **RN-EXC-04**: No se exige **editar ni eliminar** registros de libros ni de clientes.
- **RN-EXC-05**: **No se requiere administrar** altas, bajas ni modificaciones de editoriales, géneros o autores.
- **RN-EXC-06**: La consigna **no fija penalizaciones adicionales** por incumplimientos ni un **mínimo de aprobación**: la evaluación se informa por separado.
- **RN-EXC-07**: El TP backend de Programación III del otro docente **solo se toma como contexto**; esta entrega desarrolla exclusivamente el frontend.
