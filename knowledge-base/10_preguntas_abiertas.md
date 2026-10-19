# Preguntas Abiertas

Registro de todo lo que la consigna **no define**, de las inconsistencias detectadas al leerla y de las decisiones que quedan pendientes de confirmación. Ninguna de estas entradas bloquea el trabajo: son puntos a verificar con el docente o a resolver en la implementación.

## Estado de la inferencia de discovery (Mode A)

Los 6 campos de `kb.discovery` se infirieron del documento fuente con **confianza alta**:

| Campo | Valor inferido | Confianza | Evidencia en la consigna |
|-------|----------------|-----------|---------------------------|
| `problem` | Sistema de librería (frontend-only) que presenta su catálogo y registra libros, clientes y ventas, con los datos y operaciones simulados en el navegador. | Alta | *"El proyecto representa una librería que presenta su catálogo y registra libros, clientes y ventas... los datos y las operaciones se simulan en el navegador."* |
| `system_type` | `web_app` | Alta | *"Se utilizan únicamente HTML, CSS y JavaScript nativos"*, *"se comprueba con un ancho de 320 px y otro de 1280 px"*. |
| `domain` | `library / retail (bookstore)` | Alta | Catálogo, libros, clientes, ventas, ISBN, editorial, género, autores. |
| `scale` | `single_user` | Alta | *"No se requiere API, base de datos, servidor ni conexión con el backend"*, *"Tampoco se requiere un inicio de sesión real"*, `localStorage` por navegador/perfil. |
| `stack` | `["HTML5", "CSS3", "JavaScript (nativo, ES2020+)", "localStorage"]` | Alta para HTML/CSS/JS/localStorage; **media** solo para el nivel de versión de JavaScript | *"únicamente HTML, CSS y JavaScript nativos"*, *"No se utilizan librerías, frameworks ni CDNs"*, *"se utiliza localStorage"*. |
| `needs_infra` | `false` | Alta | *"No se requiere API, base de datos, servidor ni conexión con el backend"*, *"No se incluyen dependencias instaladas ni herramientas de compilación"*. |

> **[DISCOVERY] `stack` — nivel de versión de JavaScript.** La consigna solo afirma "JavaScript nativos" y no fija una versión mínima (ni de HTML/CSS). El valor inferido `ES2020+` es un supuesto propio (SU-01) razonable para las funcionalidades pedidas. **Confirmar**: ¿hay una versión mínima de JavaScript o de navegadores a la que haya que ajustarse, o `ES2020+` en navegadores modernos es aceptable?

El resto de los campos no presenta incertidumbre. No se requiere ninguna otra entrada `[DISCOVERY]`.

## Inconsistencias detectadas

### IN-01 — La organización en dos etapas no define el alcance de la entrega evaluable
**Documento A dice**: la consigna organiza el trabajo en "Etapa 1: inicio durante la semana de repaso" (maquetación, datos estáticos) y "Etapa 2: desarrollo del TPI completo", y aclara que "los puntajes siguientes corresponden al TPI completo. Esta organización permite comenzar por la maquetación y **no establece contenidos adicionales, fecha ni modalidad de evaluación del parcial 1**".
**Documento B dice**: "La entrega final reúne el alcance completo" y el formato de entrega exige un único `README.md` con funcionalidades **implementadas y pendientes**.
**Impacto**: no queda claro si la entrega del parcial 1 es la etapa 1 o el TPI completo, ni si el README debe listar pendientes en la entrega final.
**Resolución propuesta**: desarrollar y entregar el **alcance completo** (etapa 2), y en el README distinguir explícitamente qué pantallas fueron maqueta en la etapa 1 y qué quedó implementado, para cubrir ambas lecturas.

### IN-02 — "Recursos locales incluidos" vs. "procedencia de imágenes ajenas"
**Documento A dice**: "Los estilos, scripts, imágenes y demás recursos se incluyen en el proyecto" y "No se utilizan librerías, frameworks ni CDNs de CSS o JavaScript".
**Documento B dice**: el README debe contener "procedencia de imágenes ajenas, **si existen**".
**Impacto**: no se define si se permite usar imágenes alojadas en internet (descargadas al proyecto) ni cómo debe documentarse su procedencia.
**Resolución propuesta**: usar recursos propios o de licencia libre verificada, incluidos en `assets/`, y documentar en el README la procedencia de cada archivo de imagen que no sea propio. Si no hay imágenes ajenas, declarar explícitamente que no las hay.

### IN-03 — El filtro se define solo por título, pero el catálogo muestra seis campos
**Documento A dice**: "El filtro por título ignora diferencias entre mayúsculas y minúsculas, busca coincidencias parciales...".
**Documento B dice**: cada libro muestra "título, ISBN, editorial, género, autores y precio".
**Impacto**: no queda claro si el filtro debería extenderse a ISBN, autor o editorial. La consigna solo **exige** el filtro por título.
**Resolución propuesta**: implementar el filtro por título con exactitud total (es lo evaluado) y, si queda tiempo, sumar campos adicionales como mejora explícita. No reemplaza ni altera el exigido.

### IN-04 — Formato de presentación del ISBN no definido
**Documento A dice**: "El ISBN se compara sin espacios ni guiones; no se requiere implementar su dígito de control".
**Documento B dice**: no hay ninguna indicación sobre si el ISBN se muestra con o sin guiones.
**Impacto**: es una decisión de presentación; la comparación ya está definida sin ambigüedad.
**Resolución propuesta**: mostrar el ISBN tal como se ingresa y comparar siempre contra la forma normalizada (sin espacios ni guiones). Documentarlo en el README.

### IN-05 — "Se conservan también los datos descriptivos necesarios para leer esa venta" no detalla cuáles
**Documento A dice**: al confirmar se registra "un identificador, fecha, cliente, renglones y total... El precio unitario se copia al renglón como valor histórico... Se conservan también los datos descriptivos necesarios para leer esa venta."
**Documento B dice**: el historial muestra "identificador, fecha, cliente y total" y permite consultar los renglones.
**Impacto**: un historial legible sin acceder a las colecciones actuales exige snapshot de, al menos, título del libro y nombre del cliente. La consigna no lo enumera.
**Resolución propuesta**: snapshot de `precioUnitario`, `libroTitulo` y `clienteNombre` en el momento de la confirmación (ver `DD-06` y `04_modelo_de_datos.md`).

### IN-06 — Contenido exacto del `README.md` de entrega vs. el README de esta KB
**Documento A dice**: el README de la entrega "identifica a quienes realizan el trabajo" y lista 8 contenidos obligatorios.
**Documento B dice**: esta base de conocimiento produce un `knowledge-base/README.md` con otro propósito (índice de la KB).
**Impacto**: riesgo de confundir dos README distintos o de entregar el índice de la KB en lugar del README exigido por la consigna.
**Resolución propuesta**: el `README.md` de la **raíz del entregable** es el de la consigna; el de `knowledge-base/` es documentación interna del proyecto y no forma parte de la entrega evaluable (ver `SU-11`).

### IN-07 — El repositorio incluye carpetas de tooling que no son parte del TPI
**Documento A dice**: la entrega es "una carpeta o archivo comprimido con `index.html`, los demás HTML si corresponden, carpetas de CSS, JavaScript y recursos locales, y un `README.md`" y "No se incluyen dependencias instaladas ni herramientas de compilación".
**Documento B dice**: el repositorio contiene además `openspec/`, `.opencode/` y `.active-orchestrator-state.json`.
**Impacto**: comprimir la raíz completa del repositorio puede leerse como incluir herramientas de desarrollo y restar puntos en el criterio "documentación y entrega".
**Resolución propuesta**: comprimir solo la carpeta del TPI (`index.html`, `css/`, `js/`, `assets/`, `README.md`).

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|-----------|----------|---------|---------|
| Alta | ¿La entrega del parcial 1 es la etapa 1 (maqueta) o el TPI completo? ¿El README debe listar funcionalidades pendientes? | Cierre de la entrega (Ejercicio 6) | Docente |
| Alta | ¿Hay una versión mínima de JavaScript o una lista de navegadores objetivo a la que haya que ajustarse? (ver `[DISCOVERY] stack`) | Decisión de sintaxis (SU-01) | Docente |
| Alta | ¿Se espera que el `README.md` documente una estructura de `localStorage` concreta (nombre de claves)? La comprobación guiada del precio histórico depende de ella | Ejercicio 6 y comprobación guiada (RN-PER-06) | Docente / equipo |
| Media | ¿Se puede usar material visual de terceros (descargado al proyecto) y cómo debe declararse su procedencia? | Assets y README (IN-02) | Docente |
| Media | ¿Qué carpetas exactas deben incluirse en el `.zip` de entrega? | Empaquetado final (IN-07) | Equipo / docente |
| Media | ¿Debe haber una pantalla o sección que muestre de forma visible el estado de la persistencia (por ejemplo, "datos guardados en este navegador")? La consigna no la pide, pero el README debe explicar los límites de `localStorage` | Cierre (RN-PER-04) | Docente |
| Media | ¿La venta debe associate alguna forma de pago, documento o comprobante? La consigna lo excluye explícitamente, pero conviene confirmarlo | Ejercicio 5 | Docente |
| Baja | ¿Se espera un formato de fecha e identificador de venta concreto en el historial? | Ejercicio 5 (SU-05) | Docente |
| Baja | ¿La moneda y el formato de importes deben ser los locales (`1.500,00`) o un formato neutro? | Ejercicio 5 (SU-06) | Docente |
| Baja | ¿Conviene ofrecer filtros adicionales (ISBN, autor, editorial) además del exigido por título? | Mejora opcional (IN-03) | Equipo |
| Baja | ¿Se espera algún tipo de prueba automatizada o solo los 7 casos manuales? | Cierre (Ejercicio 6) | Docente |
| Baja | ¿Los nombres de los archivos de CSS/JS están fijados por el docente? La consigna solo exige carpetas de CSS y JavaScript | Estructura de carpetas | Docente |

## Puntos resueltos por decisión propia (no requieren pregunta)

Estos puntos se resolvieron con una decisión documentada en `09_decisiones_y_supuestos.md`; se listan aquí para que quede registro de que fueron ambiguos en la consigna:

| Punto ambiguo | Decisión | Referencia |
|---------------|----------|-----------|
| Vistas en una página o en varias | Una sola `index.html` con secciones y anclas | `DD-08` |
| `type="module"` vs. scripts clásicos | Scripts clásicos (compatibilidad con `file://`) | `DD-03` |
| Formato de los identificadores | Numéricos autoincrementales y estables | `DD-05` |
| Valores concretos del seed | Conjunto de ejemplo con 6+ libros, 2/2/3/3 | `SU-04`, `DD-10` |
| Campos de snapshot de la venta | precio unitario, título del libro, nombre del cliente | `DD-06`, `IN-05` |
| Criterio de email válido | Regex simple `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `DD-12` |
| Alcance del filtro | Solo por título, como exige el enunciado | `SU-02`, `IN-03` |
