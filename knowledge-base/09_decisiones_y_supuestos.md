# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Frontend puro con HTML, CSS y JavaScript nativos
**Decisión**: la solución usa exclusivamente HTML, CSS y JavaScript nativos; sin frameworks, librerías, CDNs, dependencias instaladas ni herramientas de compilación.
**Contexto**: la consigna lo impone como condición de alcance técnico y advierte que su uso "incumple el alcance técnico y se informa en la evaluación".
**Alternativas consideradas**: React/Vue/Svelte con bundler · jQuery · Bootstrap/Tailwind por CDN · plantilla HTML/CSS/CSS-framework.
**Justificación**: es un requisito de evaluación explícito, no una preferencia; además garantiza que la entrega se abra con doble clic en `index.html`.
**Trade-offs aceptados**: se escribe a mano la lógica de estado, el render y las validaciones; no hay reutilización de componentes ni ecosystem.

### DD-02 — Persistencia en `localStorage` con una clave por colección
**Decisión**: se usan las claves `libreria.libros`, `libreria.clientes` y `libreria.ventas` (y opcionalmente `libreria.editoriales`, `libreria.generos`, `libreria.autores`), cada una con un array JSON.
**Contexto**: la consigna exige conservar libros, clientes y ventas en `localStorage`, y exige que el README identifique "la ubicación y la estructura del catálogo guardado" para que el docente pueda reproducir la comprobación guiada del precio histórico.
**Alternativas consideradas**: una sola clave con todo el estado · `sessionStorage` · IndexedDB.
**Justificación**: una clave por colección hace que la comprobación guiada sea precisa (el docente modifica *únicamente* el precio dentro del catálogo guardado, sin tocar las ventas) y documentable en el README.
**Trade-offs aceptados**: más claves que administrar; sin tipado ni esquema por clave más allá del control de forma al leer.

### DD-03 — Scripts clásicos en orden de carga, no ES Modules
**Decisión**: el proyecto carga scripts clásicos (`<script src="...">`) en orden determinista y expone un único espacio de nombres (por ejemplo `window.Libreria`), en lugar de usar `type="module"`.
**Contexto**: la consigna exige entregar "pasos para abrir en el navegador sin npm" y el punto de entrada es `index.html`. Los módulos ES están bloqueados por CORS cuando se abre un archivo con el protocolo `file://` en Chrome/Edge, por lo que usarlos obligaría a documentar un servidor local.
**Alternativas consideradas**: ES Modules con servidor local (`python -m http.server`) · bundler.
**Justificación**: con scripts clásicos, `index.html` funciona con doble clic en cualquier navegador moderno, que es exactamente lo que pide el formato de entrega. Se evita además toda herramienta de compilación.
**Trade-offs aceptados**: sin `import`/`export`; el acoplamiento entre módulos se controla por convención de nombres y por el orden de carga; se pierde el tree-shaking (irrelevante aquí).

### DD-04 — Interfaz, datos y documentación en español rioplatense neutro
**Decisión**: toda la interfaz, los nombres de entidades y campos, los mensajes y la documentación están en español; la documentación del proyecto se escribe en español.
**Contexto**: la materia, la consigna y el `openspec/config.yaml` del repositorio están en español ("Language: es", "All artifacts must be written in es").
**Alternativas consideradas**: identificadores de código en inglés.
**Justificación**: coherencia total entre código, interfaz y documentación; el enunciado no exige identificadores en inglés.
**Trade-offs aceptados**: mezcla inevitable de identificadores en camelCase dentro de un contexto en español (p. ej. `nombreCompleto`).

### DD-05 — Identificadores estables numéricos y enteros autoincrementales
**Decisión**: cada entidad tiene un `id` numérico, único dentro de su colección, que se conserva entre recargas.
**Contexto**: la consigna exige "arrays y objetos con identificadores estables" y que las relaciones (libro→editorial/autor, venta→cliente) sean coherentes.
**Alternativas consideradas**: UUID como texto · clave compuesta natural (ISBN, email).
**Justificación**: los `id` numéricos son simples de generar en memoria, de mostrar (ej.: identificador de venta) y de resolver con `Map`; además permiten localizar huecos si la persistencia se corrompe.
**Trade-offs aceptados**: si el orden de captura de un id se rompe, la generación del siguiente id debe evitar colisiones (se propone `max(ids) + 1`).

### DD-06 — Snapshot del precio unitario en el renglón de venta
**Decisión**: al confirmar, el precio unitario, el título del libro y el nombre del cliente **se copian** al registro de la venta; nunca se recalculan desde el catálogo.
**Contexto**: requisito explícito de la consigna ("El precio unitario se copia al renglón como valor histórico...") y del criterio de evaluación "confirmación e historial inmutable".
**Alternativas consideradas**: recalcular el total desde el catálogo al mostrar el historial.
**Justificación**: es la única forma de que la comprobación guiada del docente (modificar el precio guardado del catálogo y recargar) conserve los importes confirmados.
**Trade-offs aceptados**: duplicación de datos; si el precio de un libro cambia, las ventas viejas siguen mostrando el precio de su momento (comportamiento correcto y esperado).

### DD-07 — Sin edición ni eliminación de registros
**Decisión**: la interfaz no ofrece editar ni eliminar libros, clientes ni ventas; tampoco permite administrar editoriales, géneros o autores.
**Contexto**: la consigna dice "No se exige editar ni eliminar registros" y "No se requiere administrar altas, bajas y modificaciones de editoriales, géneros o autores"; las ventas confirmadas "no se editan ni eliminan desde la interfaz".
**Alternativas consideradas**: ofrecer edición/baja por completitud.
**Justificación**: el alcance es explícito; agregar esas funciones consume puntaje de los ejercicios 3, 4 y 5 sin sumar valor en la rúbrica y agrega riesgo de inconsistencias.
**Trade-offs aceptados**: el usuario que se equivoca al cargar un libro debe corregirlo recargando con el almacenamiento limpiado; se documenta en el README.

### DD-08 — Una sola página con secciones (`index.html`) y anclas `#vista`
**Decisión**: las 5 vistas son `<section>` dentro de `index.html`, con navegación por anclas (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`).
**Contexto**: la consigna admite ambas formas ("Se permite usar varias páginas o secciones de una misma página, siempre que exista navegación clara") y exige `index.html` como entrada.
**Alternativas consideradas**: una página HTML por vista con navegación por enlaces relativos.
**Justificación**: reduce la cantidad de archivos y de formularios compartidos, simplifica el arranque (un solo `main.js`) y satisface el formato de entrega ("los demás HTML si corresponden" ⇒ no corresponde).
**Trade-offs aceptados**: `index.html` crece en tamaño; el estado de la vista vive en la URL (ventaja: el historial del navegador y el botón "atrás" funcionan).

### DD-09 — Separación de dominio, datos y UI en tres capas
**Decisión**: `js/domain/` (reglas y cálculos puros), `js/services/` (estado y persistencia), `js/ui/` (render y binding de eventos), con `main.js` como único punto de composición.
**Contexto**: la consigna valora "código legible, nombres comprensibles, funciones acotadas y separación entre estructura, estilos y comportamiento".
**Alternativas consideradas**: un único `app.js` con todo; scripts sin ningún orden explícito.
**Justificación**: refleja directamente lo que evalúa la rúbrica y hace que cada regla `RN-XX-NN` tenga un hogar identificable.
**Trade-offs aceptados**: más archivos; el orden de carga de los scripts debe respetarse.

### DD-10 — Seed idempotente y con claves de persistencia separadas
**Decisión**: el seed se escribe **solo si la clave de la colección no existe**; una vez guardado, los datos del usuario **no se pisan** con una nueva ejecución del seed.
**Contexto**: requisito literal ("al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales") y caso manual 7 ("se recuperan datos sin duplicar ejemplos ni ventas").
**Alternativas consideradas**: marcar cada registro con un flag `esSeed`; comparar por contenido.
**Justificación**: la comprobación por existencia de clave es la más simple y la que evita por completo el duplicado.
**Trade-offs aceptados**: si el usuario borra una colección desde las herramientas del navegador, la app la repuebla con el seed (comportamiento razonable, documentado).

### DD-11 — El catálogo se renderiza siempre desde los datos, incluso en la etapa 1
**Decisión**: la maqueta de la etapa 1 ya renderiza con JavaScript (con el seed), aunque la consigna permita datos estáticos en esa etapa.
**Contexto**: la consigna pide "La estructura contempla los campos y estados que luego utiliza JavaScript" y prioriza "navegación, catálogo, alta y listado" en la etapa 1.
**Alternativas consideradas**: HTML estático para la etapa 1 y JS en la etapa 2.
**Justificación**: evita una reescritura posterior de las vistas y cumple desde el inicio con "no se presentan como operaciones completas" los controles pendientes.
**Trade-offs aceptados**: la etapa 1 requiere escribir el seed y el render antes que una maqueta puramente visual.

### DD-12 — Validación de email con expresión regular simple
**Decisión**: se valida el formato del email con una expresión regular del tipo `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
**Contexto**: la consigna pide "que el email tenga un formato válido" sin definir el criterio.
**Alternativas consideradas**: `<input type="email">` como única validación · validadores exhaustivos (RFC 5322).
**Justificación**: `type="email"` no alcanza por sí solo (el navegador permite valores malformados si el campo no se valida con `checkValidity()` y hay que mostrar el error en texto propio), y una regex simple es suficiente para el alcance académico y verificable manualmente.
**Trade-offs aceptados**: acepta direcciones formalmente inválidas pero plausibles (p. ej. con dominio inexistente) — irrelevante para datos ficticios.

## Supuestos inferidos

### SU-01 — Versión mínima de JavaScript ES2020+
**Supuesto**: se asume JavaScript ES2020+ (sintaxis moderna: `const`/`let`, arrow functions, template literals, optional chaining `?.`, nullish coalescing `??`).
**Origen**: la consigna solo dice "JavaScript nativos" y menciona `fetch` y `preventDefault` como APIs conocidas; no fija versión.
**Riesgo si es falso**: el desarrollo podría usar sintaxis no soportada en navegadores muy antiguos, o la revisión podría esperar un nivel de modernidad distinto.
**Cómo validar**: revisar la matriz de compatibilidad de los navegadores objetivo antes de codificar; la KB recomienda navegadores modernos (Chrome/Edge/Firefox actuales), que soportan ES2020 sin problema.

### SU-02 — Semántica de coincidencia del filtro por título
**Supuesto**: el filtro busca coincidencias **parciales** por subcadena sobre el **título** solamente (no por autor, editorial, género ni ISBN).
**Origen**: "El filtro por título ignora diferencias entre mayúsculas y minúsculas, busca coincidencias parciales...".
**Riesgo si es falso**: el docente podría esperar un filtro más amplio; el enunciado solo exige el de título, por lo que la ampliación es opcional.
**Cómo validar**: si el tiempo lo permite, agregar campos de filtro adicionales sin romper el comportamiento exigido por título.

### SU-03 — Nombres de módulos y funciones
**Supuesto**: los nombres de archivos y funciones propuestos (`store`, `storage`, `render`, `validarLibro`, `calcularTotal`, etc.) son una recomendación de la KB, no un requisito.
**Origen**: la consigna exige "eventos y funciones con responsabilidades reconocibles" y "nombres comprensibles", sin fijarlos.
**Riesgo si es falso**: ninguno funcional; solo impide comparar contra un naming preexistente (que no existe: el proyecto no tiene código).
**Cómo validar**: mantener el criterio "una responsabilidad por función" y nombres en español.

### SU-04 — Valores concretos del seed
**Supuesto**: los nombres, ISBN y precios concretos propuestos en `04_modelo_de_datos.md` son un ejemplo válido; la consigna solo fija **cantidades mínimas**.
**Origen**: Ejercicio 3 ("al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios").
**Riesgo si es falso**: ninguno: cualquier conjunto que cumpla los mínimos y las relaciones es válido. Se eligieron precios 1500 y 2000 para poder reproducir el caso manual de venta (2×1500 + 1×2000 = 5000).
**Cómo validar**: comprobar que el seed cumple RN-CAT-01 a RN-CAT-03 y que existen dos libros con esos precios.

### SU-05 — Formato del identificador y de la fecha de la venta
**Supuesto**: la venta usa un `id` numérico incremental y una fecha en formato local legible (por ejemplo `dd/mm/aaaa hh:mm`), guardada internamente como ISO 8601 o epoch.
**Origen**: la consigna pide registrar "un identificador, fecha, cliente, renglones y total" sin especificar formatos.
**Riesgo si es falso**: bajo; es una decisión de presentación.
**Cómo validar**: verificar en la vista de Historial que identificador y fecha se leen sin ambigüedad.

### SU-06 — Presentación de importes
**Supuesto**: los importes se presentan con dos decimales, separador de miles y símbolo de moneda local (formato `es-AR`), por ejemplo `1.500,00`.
**Origen**: la consigna solo fija "los importes se presentan con dos decimales".
**Riesgo si es falso**: bajo; es formato de presentación.
**Cómo validar**: comprobar que el total del caso manual (5000) se lea como `5000,00` o `5.000,00` de forma inequívoca.

### SU-07 — Nombres de las claves de `localStorage`
**Supuesto**: prefijo `libreria.` + nombre de la colección (`libreria.libros`, `libreria.clientes`, `libreria.ventas`).
**Origen**: la consigna exige que el README identifique la ubicación del catálogo guardado, pero no fija la clave.
**Riesgo si es falso**: la comprobación guiada del docente depende de que la estructura documentada coincida con la implementada ⇒ si se cambia la clave, hay que actualizar el README.
**Cómo validar**: el README de entrega debe listar las claves exactas y su estructura JSON.

### SU-08 — Fuentes de imagen y recursos
**Supuesto**: los recursos visuales son **locales** (generados por el equipo o de licencia libre con procedencia declarada). Si se usan imágenes ajenas, se declara su procedencia en el README.
**Origen**: "Los estilos, scripts, imágenes y demás recursos se incluyen en el proyecto", sin CDNs, y el README debe incluir "procedencia de imágenes ajenas, si existen".
**Riesgo si es falso**: medio: usar imágenes de internet implicaría o bien un CDN (prohibido) o bien subir archivos con licencia no verificada.
**Cómo validar**: revisar cada archivo de `assets/` y documentar la procedencia en el README.

### SU-09 — Alcance del email como campo único de contacto
**Supuesto**: el email es el único dato de contacto del cliente; no se requieren teléfono ni dirección.
**Origen**: la consigna lista solo "nombre completo y email" y dice "No se requiere un campo de apellido separado".
**Riesgo si es falso**: bajo.
**Cómo validar**: si el docente lo pide, agregar campos es trivial; el modelo ya los admite sin cambios estructurales.

### SU-10 — Ventana de consentimiento sobre `localStorage`
**Supuesto**: la app escribe en `localStorage` desde el arranque, sin pantalla de consentimiento previa.
**Origen**: la consigna no menciona consentimiento ni privacidad de navegador, y el proyecto es académico.
**Riesgo si es falso**: bajo en el contexto del TPI.
**Cómo validar**: documentar en el README el funcionamiento y los límites de `localStorage` (RN-PER-04).

### SU-11 — Entrega comprimida con solo el proyecto
**Supuesto**: la carpeta o `.zip` de entrega contiene únicamente los artefactos del TPI (`index.html`, `css/`, `js/`, `assets/`, `README.md`), sin `.git`, `openspec/`, `.opencode/` ni `.active-orchestrator-state.json`.
**Origen**: el formato de entrega describe "una carpeta o archivo comprimido con index.html, los demás HTML si corresponden, carpetas de CSS, JavaScript y recursos locales, y un README.md"; el repositorio, en cambio, contiene además carpetas de tooling.
**Riesgo si es falso**: medio: entregar tooling de desarrollo puede leerse como "dependencias instaladas o herramientas de compilación" y restar puntos en el cierre.
**Cómo validar**: comparar el contenido del `.zip` contra la lista de la consigna antes de entregar.

### SU-12 — Navegadores objetivo
**Supuesto**: navegadores modernos en escritorio (Chrome, Edge, Firefox actuales) y, por responsive, también móviles.
**Origen**: la consigna exige verificación a 320 px y 1280 px, lo que implica uso en pantallas angostas; no fija navegadores ni versiones.
**Riesgo si es falso**: bajo.
**Cómo validar**: documentar en el README los navegadores con los que se probó.
