# Tasks

> Change cerrado en forma retrospectiva (as-built): todas las tareas ya están implementadas y verificadas sobre el código existente. Los identificadores de commit corresponden al historial del repositorio.

## 1. Datos iniciales

- [x] 1.1 Crear `js/data/seed.js` con editoriales, géneros, autores, libros y clientes ficticios, cada uno con `id` numérico estable. Verificado: el archivo define 2 editoriales, 30 géneros, 3 autores, 6 libros y 3 clientes (commit `97970a5`).
- [x] 1.2 Comprobar la integridad referencial del seed: cada `editorialId` resuelve a una editorial, cada `autorIds` a autores existentes y cada `generoId` a un género existente o `null`. Verificado: `js/data/seed.js:62-67` referencia ids 1–2 de editoriales, ids 1–3 de autores y géneros 7, 13 o `null`.
- [x] 1.3 Documentar en el propio seed el significado de `generoId: null` y la regla de ids estables. Verificado: comentario de cabecera de `js/data/seed.js:1-6`.

## 2. Estado en memoria

- [x] 2.1 Crear `js/services/store.js` con las colecciones en memoria y copia defensiva del seed antes de sembrar. Verificado: `copiar()` serializa y deserializa cada colección (`js/services/store.js:11-23`).
- [x] 2.2 Exponer `getEditoriales`, `getGeneros`, `getAutores`, `getLibros`, `getClientes` y `getVentas` sobre el estado en memoria. Verificado: API pública en `js/services/store.js:61-78`.
- [x] 2.3 Implementar `buscarPorId` y `siguienteId` para resolver relaciones y asignar ids en altas posteriores. Verificado: búsqueda lineal por `id` y máximo + 1 en `js/services/store.js:34-51` (commit `2108f07`).

## 3. Dominio del catálogo

- [x] 3.1 Crear `js/domain/texto.js` con `quitarTildes`, que descompone con NFD, preserva la ñ y elimina los diacríticos. Verificado: `js/domain/texto.js:10-15` recompone `n` + U+0303 antes de quitar el rango U+0300–U+036F.
- [x] 3.2 Implementar `normalizarBusqueda` con `trim`, quita de tildes y `toLowerCase`. Verificado: `js/domain/catalogo.js:15-17`.
- [x] 3.3 Implementar `filtrarPorTitulo` con coincidencia parcial (`indexOf`), devolviendo una copia completa cuando la búsqueda normalizada queda vacía. Verificado: `js/domain/catalogo.js:22-30`.
- [x] 3.4 Implementar `proyectarLibro` resolviendo editorial, género y autores a nombres, con `"Sin clasificar"` cuando `generoId` es `null`. Verificado: `js/domain/catalogo.js:37-57`.
- [x] 3.5 Implementar `formatearPrecio` con dos decimales. Verificado: `js/domain/catalogo.js:32-34` usa `Number(precio).toFixed(2)` (commit `2108f07`).
- [x] 3.6 Extraer la quita de tildes a `js/domain/texto.js` y reutilizarla en el filtro. Verificado: `js/domain/catalogo.js:11` toma `window.Libreria.texto.quitarTildes` (commit `f867464`).

## 4. Renderizado del catálogo

- [x] 4.1 Implementar `crearElemento` y `vaciar` en `js/ui/render.js`, asignando texto con `textContent`. Verificado: `js/ui/render.js:6-21`.
- [x] 4.2 Implementar `crearTarjetaLibro` con `<li><article>` y una lista de definiciones para ISBN, editorial, género, autores y precio. Verificado: `js/ui/render.js:28-42`.
- [x] 4.3 Implementar `renderCatalogo` para reconstruir el listado, actualizar el contador y alternar los mensajes de catálogo vacío y de búsqueda sin resultados. Verificado: `js/ui/render.js:54-68` usa `hidden` según `total` y `libros.length`.
- [x] 4.4 Implementar `textoContador` con la variante con y sin búsqueda activa. Verificado: `js/ui/render.js:44-50` distingue "Mostrando N de M" de "Mostrando N".
- [x] 4.5 Confirmar que no se usa `innerHTML` en el renderizado. Verificado: búsqueda en `js/` e `index.html`; la única aparición de `innerHTML` es el comentario de `js/ui/render.js:2` que documenta la prohibición (commit `241b685`).

## 5. Cableado y retiro del HTML estático

- [x] 5.1 Retirar del `index.html` los libros de ejemplo escritos a mano dentro de `#lista-catalogo` y conservar los nodos de estado. Verificado: `index.html:48-52` deja el `<ul>` vacío y mantiene contador y mensajes (commit `47c038d`).
- [x] 5.2 Cargar los scripts en orden de dependencias (`data` → `services` → `domain` → `ui` → `main`). Verificado: `index.html:260-271`.
- [x] 5.3 Implementar `actualizarCatalogo` en `js/main.js`: leer el campo, filtrar, proyectar y renderizar con el total del catálogo. Verificado: `js/main.js:7-22`.
- [x] 5.4 Conectar los eventos `submit` (con `preventDefault`), `reset` (diferido con `setTimeout`) e `input` en el formulario de búsqueda. Verificado: `js/main.js:24-33` y `js/main.js:75-77`.
- [x] 5.5 Invocar la actualización inicial del catálogo y de los listados al arrancar. Verificado: `js/main.js:71-85` llama a `actualizarListadosYOpciones()`, que termina en `actualizarCatalogo()`.

## 6. Ajustes posteriores sobre el mismo alcance

- [x] 6.1 Ampliar el seed a 30 géneros en orden alfabético, renumerar sus ids por posición y actualizar las relaciones de los libros. Verificado: `js/data/seed.js:22-53` (Actualidad id 1 … Viajes id 30) y `generoId` de los libros con ids 7 y 13 (commit `9927596`).
- [x] 6.2 Hacer el filtro insensible a tildes y compartir la utilidad con el alta de libros. Verificado: `js/domain/texto.js:10-15`, uso en `js/domain/catalogo.js:11,16,28` (commit `f867464`).

## 7. Verificación de los casos cubiertos

- [x] 7.1 Verificar por lectura del código que la búsqueda vacía o con solo espacios devuelve el catálogo completo. Verificado: `normalizarBusqueda` recorta y devuelve `''`, y `filtrarPorTitulo` retorna `libros.slice()` (`js/domain/catalogo.js:22-26`).
- [x] 7.2 Verificar por lectura del código que mayúsculas y tildes no afectan la coincidencia. Verificado: búsqueda y título se normalizan igual antes del `indexOf` (`js/domain/catalogo.js:22-29`).
- [x] 7.3 Verificar que no hay `fetch` ni peticiones de datos en la aplicación. Verificado: búsqueda de `fetch(` en `js/` e `index.html` sin resultados.
- [x] 7.4 Registrar el estado real del caso manual 1 ("búsqueda con parte del título en mayúsculas; búsqueda vacía y texto inexistente") en `README.md`. Verificado: la fila figura como _"Pendiente de ejecución"_; no se marca como aprobada porque no se ejecutó en el navegador dentro de este change.
- [x] 7.5 Revisar que el catálogo muestre los seis campos y `"Sin clasificar"` en los libros sin género. Verificado: `crearTarjetaLibro` agrega ISBN, editorial, género, autores y precio, y `proyectarLibro` asigna `SIN_CLASIFICAR` a los libros 3 y 6.

## Workflow follow-up

- Archivar el change cuando el proyecto lo requiera; fuera del alcance de este cierre retrospectivo.
- Ejecutar en el navegador el caso manual 1 y actualizar su resultado en `README.md` antes de la entrega final (`C-06`).
