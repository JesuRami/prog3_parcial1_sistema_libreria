# Design

## Context

Ver `proposal.md` § Why. El punto de partida es el HTML semántico del Ejercicio 1, donde la vista de catálogo tenía un listado de libros escrito a mano y los elementos de estado (`#catalogo-contador`, `#msg-catalogo-vacio`, `#msg-catalogo-sin-resultados`, `#lista-catalogo`) ya existían. Restricciones que condicionan el diseño:

- Solo HTML, CSS y JavaScript nativos; sin módulos ES, bundler ni dependencias.
- Los scripts se cargan con `<script src>` en orden desde `index.html`; cada archivo se registra en un espacio de nombres global `window.Libreria`.
- El proyecto se abre por `file://`; no hay red ni backend.
- La verificación es manual, en navegador.

## Goals / Non-Goals

**Goals:**

- Separar datos iniciales, estado en memoria, reglas de dominio del catálogo y construcción de DOM, de modo que cada archivo tenga una responsabilidad reconocible.
- Mantener el mínimo de la consigna (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes) con identificadores estables y vínculos íntegros.
- Resolver la búsqueda con una única normalización compartida y proyectar los libros a textos listos para la vista.
- Garantizar que ningún dato de registro llegue al DOM como HTML.

**Non-Goals:**

- Persistencia en `localStorage` como comportamiento especificado (corresponde a `C-06`; acá solo se consume lo que el store ya recupera al arrancar).
- Altas de libros y clientes, validaciones de formulario y actualización de selectores (`C-04`).
- Venta e historial (`C-05`).
- Administración de editoriales, géneros o autores; no hay pantallas de ABM.
- Paginación, orden configurable del catálogo, búsqueda por otros campos o resaltado de coincidencias.

## Decisions

### Espacios de nombres con IIFE en lugar de módulos ES

Cada archivo declara `window.Libreria.<área>` dentro de una función autoejecutable en modo estricto.

- **Por qué**: abrir `index.html` por `file://` con `type="module"` puede fallar por CORS en varios navegadores, y la consigna no pide módulos. El orden de `<script>` resuelve las dependencias de forma explícita.
- **Alternativas descartadas**: módulos ES (riesgo de `file://`), un único archivo monolítico (peor separación de responsabilidades), clases con estado global (sin ventaja para este tamaño).

### Cuatro capas: `data` → `services` → `domain` → `ui`

- `js/data/seed.js`: dataset ficticio inmutable en la práctica, con `id` numéricos estables.
- `js/services/store.js`: estado en memoria; expone colecciones, `buscarPorId` y `siguienteId`. Copia el seed con `JSON.parse(JSON.stringify(...))` antes de sembrar, para que mutaciones posteriores no alteren el objeto literal.
- `js/domain/catalogo.js` y `js/domain/texto.js`: funciones puras, sin DOM.
- `js/ui/render.js` y `js/main.js`: construcción de nodos y cableado de eventos.

**Por qué**: el filtro y la proyección quedan verificables sin navegador y reutilizables por las altas y la venta. **Alternativas descartadas**: renderizar directamente desde `main.js` (mezcla dominio y DOM), o resolver relaciones dentro del render (duplica lógica y acopla la vista al modelo).

### Identificadores numéricos renumerados por posición alfabética de géneros

Los 30 géneros se listan alfabéticamente y sus `id` siguen esa posición (1 = Actualidad … 30 = Viajes). Al ampliar el seed de 2 a 30 géneros se renumeraron los géneros y se actualizaron `generoId` de los libros en el mismo commit.

**Por qué**: el orden visible del selector y las sugerencias es alfabético sin depender de un ordenamiento extra, y los vínculos siguen siendo verificables a ojo. **Costo**: los `id` de género cambiaron una vez; no hay datos de usuario persistidos que dependieran de ellos en ese momento.

### Proyección del libro antes de renderizar

`proyectarLibro(libro, contexto)` resuelve editorial, género y autores a nombres y formatea el precio (`$ 1234.00`), devolviendo un objeto plano con los campos de la tarjeta.

**Por qué**: la vista recibe textos finales y no necesita conocer las claves foráneas; un género ausente se resuelve a `"Sin clasificar"` en un único lugar. **Alternativa descartada**: pasar el libro crudo y las colecciones al render (repetiría la resolución en catálogo, tabla de libros y venta).

### Normalización de la búsqueda centralizada en `js/domain/texto.js`

`quitarTildes` descompone con `normalize('NFD')`, recompone `n` + virgulilla a `ñ` y luego elimina los diacríticos del rango `U+0300`–`U+036F`. `catalogo.normalizarBusqueda` aplica `trim` y `toLowerCase` sobre ese resultado.

**Por qué**: la consigna exige ignorar mayúsculas y recortar extremos; el propietario pidió además ignorar tildes. La ñ se preserva porque su virgulilla no es una tilde diacrítica, así "senor" no encuentra "señor". **Alternativa descartada**: `localeCompare` con `sensitivity: 'base'` para el filtro (sirve para ordenar, no para subcadena).

### Eventos: `input` para actualización inmediata, `submit` y `reset` para el formulario

`main.js` escucha `input` en el campo, `submit` con `preventDefault` y `reset` con `setTimeout(..., 0)` porque el evento `reset` se dispara antes de vaciar el campo.

**Por qué**: el usuario ve el resultado mientras escribe y el botón de limpieza funciona con el mismo camino de actualización. **Trade-off**: no hay `debounce`; con 6–decenas de libros el costo es despreciable.

### DOM construido con `createElement` + `textContent`

`render.crearElemento` asigna `textContent`; `renderCatalogo` vacía el `<ul>` y agrega un `<li><article>` por libro. Nunca se usa `innerHTML`.

**Por qué**: cumple la regla de insertar datos de usuarios como texto y evita inyección de marcado. **Alternativa descartada**: plantillas con `innerHTML` (más compactas, pero reintroducen el riesgo que la consigna prohíbe).

### Estados separados por elemento y atributo `hidden`

El contador usa `role="status"`; los mensajes de catálogo vacío y de búsqueda sin resultados son párrafos distintos que se muestran u ocultan según `total` y `libros.length`.

**Por qué**: el HTML ya tenía los tres nodos y el lector de pantalla anuncia el contador; ocultar con `hidden` evita mensajes contradictorios. **Alternativa descartada**: un solo nodo con texto variable (no distingue "no hay libros" de "no hubo coincidencias" en el marcado).

## Risks / Trade-offs

- [El seed supera el mínimo de la consigna y sus `id` de género ya se renumeraron una vez] → Los vínculos se actualizan en el mismo commit y el dataset es ficticio; cualquier renumeración futura debe repetir ese procedimiento.
- [`quitarTildes` depende de `String.prototype.normalize`] → Soportado por navegadores modernos, que es el requisito de runtime del proyecto.
- [Sin `debounce`, cada tecla reconstruye el listado completo] → Aceptable con el volumen de datos local; si el catálogo creciera, se agrega `debounce` sin cambiar el contrato.
- [El filtro no pliega la ñ, así que "senor" no encuentra "señor"] → Es intencional y está documentado en el código y en la spec.
- [El estado en memoria se siembra leyendo `localStorage`] → El comportamiento de persistencia se especifica en `C-06`; acá solo importa que el catálogo refleje las colecciones del store.
- [Scripts en orden manual] → Una referencia faltante rompe el arranque; se mitiga con el orden fijo de `index.html` y la verificación manual de los casos del catálogo.

## Migration Plan

No aplica migración de datos: es la primera carga del modelo local. El cambio se entrega reemplazando el listado estático del catálogo por el contenedor vacío y agregando los archivos JavaScript en el orden de dependencias (`data` → `services` → `domain` → `ui` → `main`). Rollback: restaurar el listado estático del HTML y quitar las referencias a los scripts nuevos.
