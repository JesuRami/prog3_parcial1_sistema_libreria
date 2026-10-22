# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **prog3_parcial1_sistema_libreria**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**
>
> **Fuente única y exclusiva**: `docs/consignas_parcial.pdf` (TPI: frontend de una librería).
> Los 6 changes corresponden 1:1 a los seis bloques `Ejercicio` de la consigna, en su orden.
> Ningún contenido proviene de `knowledge-base/` (andamiaje con supuestos del orquestador,
> no parte de la consigna) ni de versiones anteriores de este archivo. Toda regla dura de este
> documento es rastreable a una oración literal de la consigna, citada en la tabla correspondiente.

---

## Cómo usar este documento

1. Identificar el change a ejecutar (`C-01` … `C-06`) según el árbol de dependencias.
2. Leer en `docs/consignas_parcial.pdf` la sección `Consignas` → `Ejercicio N` del change, y su fila en `Criterios de evaluación`.
3. Proponer con `/opsx:propose C-NN-nombre-del-change`, con el scope estrictamente limitado a ese ejercicio (no agregar alcance que la consigna no pida).
4. Verificar **manualmente** los casos manuales que el change cubre (sección [Verificación](#verificación)). La consigna es tajante: «No se indica una prueba como aprobada sin ejecutarla» (Ejercicio 6).
5. Marcar el checkbox de estado del change y avanzar según dependencias.

---

## Árbol de dependencias

```
C-01 estructura-y-pantallas-html           (Ejercicio 1 · 20 pts)
├── C-02 presentacion-con-css-adaptable    (Ejercicio 2 · 20 pts)   ← rama de presentación
└── C-03 datos-locales-catalogo-y-filtro   (Ejercicio 3 · 15 pts)   ← rama de datos
    └── C-04 alta-de-libros-y-clientes     (Ejercicio 4 · 15 pts)
        └── C-05 venta-simulada-e-historial (Ejercicio 5 · 20 pts)
            └── C-06 persistencia-verificacion-y-documentacion (Ejercicio 6 · 10 pts)
```

**Regla de dependencias**: el orden del grafo es el orden de la consigna (`Ejercicio 1` … `Ejercicio 6`), acotado por `Organización del trabajo` («Etapa 1 … las pantallas del ejercicio 1 y su presentación del ejercicio 2»; «Etapa 2 … se completan los ejercicios 3 a 6»). `C-03` no requiere `C-02` terminado: la propia Etapa 1 contempla «incorporar una interacción básica, como el filtro por título», y el Ejercicio 1 establece que «La estructura contempla los campos y estados que luego utiliza JavaScript». `C-04` requiere el modelo de datos locales del Ejercicio 3 («Las opciones se generan a partir de los datos locales»); `C-05` requiere libros y clientes existentes (Ejercicios 3 y 4); `C-06` persiste y verifica el alcance completo (libros, clientes y ventas, y los casos manuales de todos los ejercicios).

### Paralelismo por fase

La consigna no declara paralelismo; de su texto solo se sostiene **un fork**: tras la estructura HTML, la presentación CSS (C-02) y la rama de datos (C-03…) pueden avanzar en paralelo.

```
GATE 0: inicio
  → C-01 estructura-y-pantallas-html                    [Agente A]

GATE 1: C-01 ✓                                          ← ÚNICO FORK
  → C-02 presentacion-con-css-adaptable                 [Agente B]
  → C-03 datos-locales-catalogo-y-filtro                [Agente A]

GATE 2: C-03 ✓
  → C-04 alta-de-libros-y-clientes                      [Agente A]

GATE 3: C-04 ✓  (C-02 puede seguir en paralelo; debe cerrar antes de C-06)
  → C-05 venta-simulada-e-historial                     [Agente A]

GATE 4: C-05 ✓ y C-02 ✓
  → C-06 persistencia-verificacion-y-documentacion      [Agente A — si C-02 ✓]
```

### Camino crítico (5 changes — mínimo irreducible)

```
C-01 → C-03 → C-04 → C-05 → C-06
```

`C-02` (20 puntos) es indispensable para el TPI completo (100 puntos) pero, según la consigna, solo depende de `C-01` y corre en paralelo al resto de la rama de datos: aporta la rama paralela con holgura, no la cadena crítica de dependencias. La entrega final exige ambos ramales.

### Plan óptimo con 3 agentes

| Paso | Agente A (estructura / datos / ventas) | Agente B (presentación) | Agente C |
|------|----------------------------------------|-------------------------|----------|
| 1 | `C-01` Estructura y pantallas HTML | — | — |
| 2 | `C-03` Datos locales, catálogo y filtro | `C-02` Presentación con CSS | — |
| 3 | `C-04` Alta de libros y clientes | `C-02` (si continúa) | — |
| 4 | `C-05` Venta simulada e historial | — | — |
| 5 | `C-06` Persistencia, verificación y documentación | — | — |

La consigna no sustenta más paralelismo: es un frontend estático único, sin backend, auth ni tareas transversales. `C-02` es la única rama paralela posible; el Agente C queda sin asignación (no hay scope adicional que no invente alcance).

---

## FASE 1 — Etapa 1 · Maquetación y presentación

> Consigna, `Organización del trabajo` (Etapa 1): «Se priorizan las pantallas del ejercicio 1 y su presentación del ejercicio 2: navegación, catálogo, alta y listado de libros, alta y listado de clientes, formulario de venta e historial. Se usan ejemplos estáticos para definir su aspecto.»

### [C-01] `estructura-y-pantallas-html`

- **Estado**: `[x]` completado
- **Título en la consigna**: Ejercicio 1 · Estructura y pantallas HTML
- **Puntaje**: 20 — «Vistas y navegación: 10; semántica, formularios y estados: 10»
- **Scope**:
  - `index.html` como entrada del proyecto. Se permite usar varias páginas o secciones de una misma página, siempre que exista navegación clara entre las vistas.
  - Vistas requeridas: **Catálogo** (título de la librería, buscador por título y listado de libros; cada libro muestra título, ISBN, editorial, género, autores y precio; sin género asignado se muestra «Sin clasificar»); **Libros** (formulario de alta y listado de registrados); **Clientes** (formulario de alta y listado de registrados); **Ventas** (selección de cliente, composición de renglones y resumen de la venta); **Historial** (listado de ventas y acceso a sus detalles).
  - Encabezado, navegación y contenido principal con etiquetas semánticas.
  - Cada campo con etiqueta asociada; botones con textos que describen su acción; tablas con encabezados.
  - Mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
  - Para la primera etapa, listados e historial pueden mostrar datos estáticos de ejemplo; la estructura contempla los campos y estados que luego utiliza JavaScript.
- **Dependencias**: ninguna
- **Governance**: BAJO — maquetación estática sin lógica de negocio; la consigna excluye backend, auth y datos sensibles («No se requiere API, base de datos, servidor ni conexión con el backend. Tampoco se requiere un inicio de sesión real.»). Nada califica como CRÍTICO ni ALTO en este ejercicio.
- **Leer antes**:
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 1
  - `docs/consignas_parcial.pdf` § Criterios de evaluación (fila «1. HTML: 20»)
  - `docs/consignas_parcial.pdf` § Formato de entrega (`index.html` como entrada)

### [C-02] `presentacion-con-css-adaptable`

- **Estado**: `[x]` completado
- **Título en la consigna**: Ejercicio 2 · Presentación con CSS y uso adaptable
- **Puntaje**: 20 — «Coherencia y organización: 8; adaptación: 8; accesibilidad básica: 4»
- **Scope**:
  - Identidad visual propia y coherente: colores, tipografía, espaciado, tarjetas, formularios y botones.
  - CSS en archivos externos; reutilización de clases para elementos equivalentes.
  - Flexbox o Grid para organizar el contenido.
  - Comprobación con ancho de 320 px y 1280 px: textos y controles legibles y el contenido no provoca desplazamiento horizontal de toda la página.
  - Si una tabla necesita más espacio, se desplaza dentro de su propio contenedor.
  - Controles con foco visible y recorrido con el teclado.
  - Mensajes de error expresados con texto, sin depender únicamente de un color.
  - Imágenes informativas con texto alternativo; las decorativas no repiten información innecesaria.
- **Dependencias**: `C-01`
- **Governance**: BAJO — presentación y accesibilidad básica sobre estructura existente; sin datos sensibles ni lógica crítica. Nada califica como CRÍTICO ni ALTO.
- **Leer antes**:
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 2
  - `docs/consignas_parcial.pdf` § Criterios de evaluación (fila «2. CSS: 20»)
  - `docs/consignas_parcial.pdf` § Contexto y alcance (recursos incluidos en el proyecto)

---

## FASE 2 — Etapa 2 · Datos, operaciones y cierre

> Consigna, `Organización del trabajo` (Etapa 2): «Se conectan las pantallas con datos locales y se completan los ejercicios 3 a 6, incluidas las validaciones, las ventas y la persistencia.»

### [C-03] `datos-locales-catalogo-y-filtro`

- **Estado**: `[x]` completado
- **Título en la consigna**: Ejercicio 3 · Datos locales, catálogo y filtro
- **Puntaje**: 15 — «Modelo y ejemplos: 5; renderizado: 5; filtro y estados: 5»
- **Scope**:
  - Arrays y objetos con identificadores estables para libros, editoriales, géneros, autores y clientes.
  - Conjunto inicial con al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios. Cada libro se relaciona con una editorial existente y uno o más autores existentes. El género es opcional; si se asigna, corresponde a un género existente.
  - JavaScript genera el catálogo a partir del array de libros.
  - Filtro por título: ignora diferencias entre mayúsculas y minúsculas, busca coincidencias parciales y elimina espacios sobrantes en los extremos. Búsqueda vacía muestra todo el catálogo; búsqueda sin coincidencias muestra un mensaje claro.
  - Eventos y funciones con responsabilidades reconocibles.
  - Los datos escritos por usuarios se insertan como texto en el DOM.
  - No se requiere traer datos con `fetch` ni administrar altas, bajas y modificaciones de editoriales, géneros o autores.
- **Dependencias**: `C-01` (la estructura del Ejercicio 1 «contempla los campos y estados que luego utiliza JavaScript»; no requiere `C-02` terminado)
- **Governance**: BAJO — arrays y objetos ficticios en el navegador; la consigna advierte que «Los datos son ficticios. Las validaciones y el almacenamiento del navegador sirven para la práctica; no representan seguridad ni integridad garantizada por un servidor». Nada califica como CRÍTICO ni ALTO.
- **Leer antes**:
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 3
  - `docs/consignas_parcial.pdf` § Criterios de evaluación (fila «3. Datos y catálogo: 15»)
  - `docs/consignas_parcial.pdf` § Organización del trabajo (Etapa 1: interacción básica de filtro)

### [C-04] `alta-de-libros-y-clientes`

- **Estado**: `[ ]` pendiente
- **Título en la consigna**: Ejercicio 4 · Alta de libros y clientes
- **Puntaje**: 15 — «Libros y selectores: 6; clientes: 4; validación y actualización: 5»
- **Scope**:
  - Formulario de libros: título, ISBN, precio y relaciones con editorial, género y autores. Opciones generadas a partir de los datos locales: editorial y género mediante selectores; autores mediante selector múltiple o controles de selección equivalentes. El selector de género incluye «Sin clasificar» (ausencia de género).
  - Validaciones de libro: título e ISBN no vacíos; ISBN no existente en el conjunto local (comparado sin espacios ni guiones; no se requiere dígito de control); precio numérico y mayor que cero; editorial y todos los autores seleccionados existan en los datos locales; al menos un autor seleccionado; género puede quedar sin asignar, y si se asigna se verifica que exista.
  - Formulario de clientes: nombre completo y email (sin campo de apellido separado). Validaciones: nombre completo y email no vacíos, formato de email válido, y no exista otro cliente con el mismo email (comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas).
  - Control de envío con `preventDefault`; errores cerca del formulario; el registro solo se agrega si todas las comprobaciones pasan.
  - Tras un alta correcta, el listado y las opciones relacionadas se actualizan sin recargar la página. No se exige editar ni eliminar registros.
- **Dependencias**: `C-03` («Las opciones se generan a partir de los datos locales»)
- **Governance**: MEDIO — flujos de formulario con estado propio (validaciones condicionales y actualización del DOM sin recarga); sin auth, pagos ni datos sensibles según la consigna. Nada califica como CRÍTICO ni ALTO.
- **Leer antes**:
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 4
  - `docs/consignas_parcial.pdf` § Criterios de evaluación (fila «4. Altas: 15»)
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 3 (datos locales de referencia)

### [C-05] `venta-simulada-e-historial`

- **Estado**: `[ ]` pendiente
- **Título en la consigna**: Ejercicio 5 · Venta simulada e historial
- **Puntaje**: 20 — «Composición y validaciones: 8; cálculos: 5; confirmación e historial inmutable: 7»
- **Scope**:
  - Selección de un cliente existente; al menos un renglón con un libro existente y una cantidad entera mayor que cero.
  - No se admiten libros repetidos dentro de la misma venta: se modifica la cantidad del renglón existente o se informa el duplicado.
  - Antes de confirmar, se permite cambiar cantidades y quitar renglones.
  - Cada renglón muestra libro, cantidad, precio unitario y subtotal. Subtotal = cantidad por precio; total = suma de subtotales; importes con dos decimales.
  - Se impide confirmar una venta sin cliente, sin renglones o con cantidades inválidas.
  - Al confirmar, se registra identificador, fecha, cliente, renglones y total. El precio unitario se copia al renglón como valor histórico: no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial. Se conservan también los datos descriptivos necesarios para leer esa venta.
  - Historial: muestra identificador, fecha, cliente y total, y permite consultar los renglones. Las ventas confirmadas no se editan ni eliminan desde la interfaz. La confirmación limpia el formulario para una nueva venta y muestra un mensaje de resultado.
  - Sin gestión de stock, cobros ni facturación fiscal (el total es simulado; consigna, `Contexto y alcance`).
- **Dependencias**: `C-03, C-04` (requiere libros y clientes existentes en los datos locales)
- **Governance**: MEDIO — máquina de estados de la venta en memoria (renglones, duplicados, confirmación inmutable); sin pagos reales («sin gestionar stock, cobros ni facturación fiscal»), sin backend ni datos sensibles. Nada califica como CRÍTICO ni ALTO.
- **Leer antes**:
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 5
  - `docs/consignas_parcial.pdf` § Criterios de evaluación (fila «5. Ventas: 20»)
  - `docs/consignas_parcial.pdf` § Contexto y alcance (venta simulada, sin stock/cobros/facturación)

### [C-06] `persistencia-verificacion-y-documentacion`

- **Estado**: `[ ]` pendiente
- **Título en la consigna**: Ejercicio 6 · Persistencia, verificación y documentación
- **Puntaje**: 10 — «Persistencia: 4; pruebas manuales registradas: 3; documentación y entrega: 3»
- **Scope**:
  - `localStorage` para conservar libros, clientes y ventas. En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales.
  - README: explica que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura, y que no comparte información entre usuarios.
  - README: registra el resultado observado de los casos manuales de la consigna (tabla del Ejercicio 6). Si un caso falla o una funcionalidad queda pendiente, se registra el comportamiento real. «No se indica una prueba como aprobada sin ejecutarla.»
  - Comprobación guiada de precio histórico: en una copia del proyecto y con datos de prueba, se confirma una venta y se anotan sus importes; con las herramientas de almacenamiento del navegador se modifica únicamente el precio del libro dentro del catálogo guardado en `localStorage`, sin modificar ni borrar las ventas guardadas; se recarga y se verifica que el detalle de la venta conserva los valores confirmados. La ubicación y estructura del catálogo guardado se identifican en el README para reproducir esta comprobación. No se exige una pantalla para editar precios.
  - Formato de entrega: carpeta o archivo comprimido con `index.html`, los demás HTML si corresponden, carpetas de CSS, JavaScript y recursos locales, y `README.md`; sin dependencias instaladas ni herramientas de compilación.
  - README debe: identificar a quienes realizan el trabajo; pasos para abrir en el navegador sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de `localStorage`; resultados de los casos manuales; procedencia de imágenes ajenas, si existen.
  - El README del avance de la Etapa 1 identifica expresamente qué pantallas son maquetas y qué interacciones ya funcionan; la entrega final reúne el alcance completo.
- **Dependencias**: `C-02, C-03, C-04, C-05` (persiste libros, clientes y ventas; los casos manuales y el README cubren el alcance completo)
- **Governance**: BAJO — persistencia local de datos ficticios y documentación; la consigna explicita que el almacenamiento «sirve para la práctica; no representan seguridad ni integridad garantizada por un servidor». Nada califica como CRÍTICO ni ALTO.
- **Leer antes**:
  - `docs/consignas_parcial.pdf` § Consignas → Ejercicio 6
  - `docs/consignas_parcial.pdf` § Criterios de evaluación (fila «6. Cierre: 10»)
  - `docs/consignas_parcial.pdf` § Formato de entrega (README y empaquetado)

---

## Reglas duras

Cada fila es una restricción **literal de la consigna**. Si algo no está acá, la consigna no lo exige ni lo prohíbe (ver [No definido por la consigna](#no-definido-por-la-consigna)).

| # | Regla | Ubicación exacta en la consigna (cita) |
|---|-------|----------------------------------------|
| 1 | Solo HTML, CSS y JavaScript nativos | `Contexto y alcance`: «Se utilizan únicamente HTML, CSS y JavaScript nativos.» |
| 2 | Sin librerías, frameworks ni CDNs de CSS o JavaScript | `Contexto y alcance`: «No se utilizan librerías, frameworks ni CDNs de CSS o JavaScript.»; `Criterios de evaluación`: «El uso de librerías o frameworks incumple el alcance técnico y se informa en la evaluación» |
| 3 | Sin API, base de datos, servidor ni conexión con backend | `Contexto y alcance`: «No se requiere API, base de datos, servidor ni conexión con el backend.» |
| 4 | Sin inicio de sesión real (ni roles/permisos) | `Contexto y alcance`: «Tampoco se requiere un inicio de sesión real.» |
| 5 | Sin stock, cobros ni facturación fiscal | `Contexto y alcance`: «La venta registra cantidades y precios para obtener un total simulado, sin gestionar stock, cobros ni facturación fiscal.» |
| 6 | `index.html` como punto de entrada | `Ejercicio 1`: «Se organiza el proyecto con index.html como entrada.»; `Formato de entrega`: «una carpeta o archivo comprimido con index.html, los demás HTML si corresponden» |
| 7 | CSS en archivos externos; recursos locales incluidos en el proyecto | `Ejercicio 2`: «El CSS se mantiene en archivos externos»; `Contexto y alcance`: «Los estilos, scripts, imágenes y demás recursos se incluyen en el proyecto.» |
| 8 | Sin dependencias instaladas ni herramientas de compilación | `Formato de entrega`: «No se incluyen dependencias instaladas ni herramientas de compilación.»; README: «pasos para abrir en el navegador sin npm» |
| 9 | Interfaz legible y sin scroll horizontal de página completa a 320 px y 1280 px | `Ejercicio 2`: «La interfaz se comprueba con un ancho de 320 px y otro de 1280 px: los textos y controles resultan legibles y el contenido no provoca desplazamiento horizontal de toda la página.» |
| 10 | Tablas anchas se desplazan dentro de su propio contenedor | `Ejercicio 2`: «Si una tabla necesita más espacio, se desplaza dentro de su propio contenedor.» |
| 11 | Foco visible y recorrido por teclado | `Ejercicio 2`: «Los controles conservan un foco visible y se recorren con el teclado.» |
| 12 | Errores expresados con texto, no solo color | `Ejercicio 2`: «Los mensajes de error se expresan con texto y no dependen únicamente de un color.» |
| 13 | `alt` en imágenes informativas; decorativas sin repetir información | `Ejercicio 2`: «Las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria.» |
| 14 | HTML semántico; campos con etiqueta; botones con texto descriptivo; tablas con encabezados; mensajes de vacío/error/resultado | `Ejercicio 1`: «Se incluyen encabezado, navegación y contenido principal con etiquetas semánticas. Cada campo posee una etiqueta asociada; los botones tienen textos que describen su acción. Las tablas incluyen encabezados. Se incorporan mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.» |
| 15 | Datos de usuarios insertados como texto en el DOM (inyección segura) | `Ejercicio 3`: «Los datos escritos por usuarios se insertan como texto en el DOM.» |
| 16 | Sin `fetch`. La consigna **no exige** CRUD de editoriales/géneros/autores: sin pantallas de administración para esos conjuntos | `Ejercicio 3`: «No se requiere traer datos con fetch ni administrar altas, bajas y modificaciones de editoriales, géneros o autores.» **Excepción autorizada por el propietario del repo (22/10/2026, reversible)**: en el alta de libro, editorial y autor admiten texto libre en la misma barra (listado de los ya registrados + anti-redundancia sin mayúsculas ni tildes); el valor nuevo se suma al conjunto local al guardar el libro. + Decisión del usuario |
| 17 | Sin edición ni eliminación de registros (libros, clientes) | `Ejercicio 4`: «No se exige editar ni eliminar registros.» |
| 18 | Ventas confirmadas inmutables desde la interfaz; precio unitario histórico | `Ejercicio 5`: «Las ventas confirmadas no se editan ni eliminan desde la interfaz.»; «El precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial.» |
| 19 | ISBN comparado sin espacios ni guiones; sin dígito de control | `Ejercicio 4`: «el ISBN se compara sin espacios ni guiones; no se requiere implementar su dígito de control.» |
| 20 | Persistencia con `localStorage` únicamente; sin duplicar ejemplos al reabrir | `Ejercicio 6`: «localStorage para conservar libros, clientes y ventas. En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales.» |
| 21 | README con el contenido mínimo listado en la consigna | `Formato de entrega`: identificación de autores; «pasos para abrir en el navegador sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de localStorage; resultados de los casos manuales y procedencia de imágenes ajenas, si existen.» |
| 22 | Verificación manual; nunca dar un caso por aprobado sin ejecutarlo | `Ejercicio 6`: «Si un caso falla o una funcionalidad queda pendiente, se registra el comportamiento real. No se indica una prueba como aprobada sin ejecutarla.» |

---

## Verificación

La consigna no permite suites de tests automatizadas (reglas 1 y 8: sin dependencias instaladas ni herramientas de compilación; el README debe explicar «pasos para abrir en el navegador sin npm»). **Toda verificación es manual**, mediante los casos de la tabla del Ejercicio 6, y su resultado observado se registra en el README. Los cambios `C-03`…`C-05` deben ejecutar al menos los casos que cubren, antes de cerrar; `C-06` ejecuta la tabla completa y la comprobación guiada de precio histórico.

| # | Caso manual (consigna, Ejercicio 6) | Resultado esperado (verbatim) | Cubierto por |
|---|-------------------------------------|------------------------------|--------------|
| 1 | Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | «Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados.» | C-03 |
| 2 | Alta de libro con ISBN existente y luego con ISBN nuevo | «El duplicado se rechaza; el válido aparece en catálogo y selección de venta.» | C-04 |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | «Se rechazan los dos primeros; el nuevo aparece en listado y selección.» | C-04 |
| 4 | Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | «No se confirma; el duplicado no crea otro renglón.» | C-05 |
| 5 | Venta válida: dos unidades a 1500 y una a 2000 | «Subtotales 3000 y 2000; total 5000; detalle conservado en el historial.» | C-05 |
| 6 | Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba del proyecto | «Al consultar nuevamente el historial después de recargar, el precio unitario, los subtotales y el total de esa venta conservan los valores confirmados.» | C-06 (guiada por el docente) |
| 7 | Recarga después de altas y venta | «Se recuperan datos sin duplicar ejemplos ni ventas.» | C-06 |
| 8 | Navegación por teclado y anchos de 320 px y 1280 px | «Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita.» | C-02, C-06 |

**Prohibido en la verificación**: crear `npm test`, runners de tests, linters obligatorios, CI u otras herramientas — la consigna prohíbe dependencias instaladas y herramientas de compilación (reglas 1 y 8). Si un caso falla, se registra el comportamiento real; no se marca como aprobado sin ejecutarlo (regla 22).

---

## No definido por la consigna

Tópicos sobre los que la consigna **guarda silencio**; no se imponen reglas y cualquier decisión debe documentarse en el README si afecta la reproducibilidad:

- Formato concreto de fecha/hora de las ventas (solo se pide registrar «fecha»).
- Formato monetario más allá de «dos decimales»: separadores de miles, símbolo de moneda.
- Módulos ES (`type="module"`, rutas relativas, CORS local): la consigna no menciona módulos; solo pide abrir `index.html` en el navegador sin npm.
- Resoluciones de pantalla más allá de 320 px y 1280 px; navegador específico (la consigna solo dice «navegador»).
- Convención de nombres de archivos, claves de `localStorage` o estructura exacta de carpetas (la consigna solo exige documentar la ubicación de los datos iniciales y del catálogo guardado en el README).
- Múltiples páginas vs. una sola página: **ambas opciones están permitidas** («Se permite usar varias páginas o secciones de una misma página»); no es un vacío, es una libertad explícita.
- Fechas, canal de entrega y modalidad del parcial: «El docente comunica por separado las fechas, el canal de entrega y la modalidad de trabajo.» No se infiere nada.
- Penalizaciones o mínimo de aprobación: «esta consigna no fija penalizaciones adicionales ni un mínimo de aprobación.»

---

## Resumen

| ID | Change (título de la consigna) | Puntos | Sub-bloques de rúbrica | Dependencias | Governance |
|----|--------------------------------|--------|------------------------|--------------|------------|
| C-01 | Ejercicio 1 · Estructura y pantallas HTML | 20 | Vistas y navegación: 10; semántica, formularios y estados: 10 | ninguna | BAJO |
| C-02 | Ejercicio 2 · Presentación con CSS y uso adaptable | 20 | Coherencia y organización: 8; adaptación: 8; accesibilidad básica: 4 | C-01 | BAJO |
| C-03 | Ejercicio 3 · Datos locales, catálogo y filtro | 15 | Modelo y ejemplos: 5; renderizado: 5; filtro y estados: 5 | C-01 | BAJO |
| C-04 | Ejercicio 4 · Alta de libros y clientes | 15 | Libros y selectores: 6; clientes: 4; validación y actualización: 5 | C-03 | MEDIO |
| C-05 | Ejercicio 5 · Venta simulada e historial | 20 | Composición y validaciones: 8; cálculos: 5; confirmación e historial inmutable: 7 | C-03, C-04 | MEDIO |
| C-06 | Ejercicio 6 · Persistencia, verificación y documentación | 10 | Persistencia: 4; pruebas manuales registradas: 3; documentación y entrega: 3 | C-02, C-03, C-04, C-05 | BAJO |
| | **Total** | **100** | | | |

**Primer change recomendado**: `C-01` (`estructura-y-pantallas-html`) — único punto de arranque (GATE 0); todo lo demás depende, directa o indirectamente, de la estructura de vistas.

Para arrancar: `/opsx:propose C-01-estructura-y-pantallas-html`
