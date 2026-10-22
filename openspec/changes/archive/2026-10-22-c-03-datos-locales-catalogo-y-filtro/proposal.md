# Proposal

## Why

El Ejercicio 1 dejó las vistas maquetadas con ejemplos estáticos: el catálogo era markup escrito a mano, sin modelo de datos detrás. Para avanzar a la Etapa 2 hace falta un dataset local con identificadores estables (el que después consumen el alta de libros, la venta y el historial) y un catálogo generado desde ese dataset, con búsqueda por título que tolere mayúsculas y tildes y que explique con texto los estados vacíos.

## What Changes

- Se incorporan los datos iniciales ficticios en JavaScript (`js/data/seed.js`): 2 editoriales, 30 géneros en orden alfabético, 3 autores, 6 libros y 3 clientes, cada entidad con `id` estable. Los libros referencian una editorial existente, uno o más autores existentes y un género existente o `null`.
- Se agrega el estado en memoria (`js/services/store.js`) que expone las colecciones y resuelve relaciones por `id`; las altas posteriores reutilizan ese estado.
- Se agrega la lógica de dominio del catálogo (`js/domain/catalogo.js`): normalización de la búsqueda, filtro por subcadena del título sin distinguir mayúsculas ni tildes, proyección de un libro a los textos que muestra la vista y formato de precio con dos decimales.
- Se agrega la utilidad de texto compartida (`js/domain/texto.js`) que quita tildes conservando la ñ.
- El catálogo deja de ser HTML estático: `js/ui/render.js` construye las tarjetas del catálogo generadas desde los datos y `js/main.js` conecta la búsqueda (envío, limpieza y escritura) y dibuja el contador y los mensajes de estado.
- Todo texto se inserta con `textContent`; no se usa `innerHTML`.
- Ajustes posteriores sobre el mismo alcance: 30 géneros alfabéticos con ids renumerados por posición y relaciones del seed actualizadas (commit `9927596`), y filtro insensible a tildes compartido con el alta de libros (commit `f867464`).
- Sin cambios de alcance: no hay `fetch`, no hay administración de editoriales, géneros ni autores, no hay edición ni eliminación de registros, no se agregan dependencias ni herramientas de compilación.

## Capabilities

### New Capabilities

- `datos-locales-y-filtro`: modelo de datos local con identificadores estables, generación del catálogo desde los datos, filtro por título sin distinguir mayúsculas ni tildes, estados de búsqueda vacía y sin resultados, e inserción de texto de usuarios como texto en el DOM.

### Modified Capabilities

Ninguna: todas las capacidades de esta entrega se introducen como nuevas; no hay requisitos existentes que modificar.

## Impact

- **Archivos nuevos**: `js/data/seed.js`, `js/services/store.js`, `js/domain/catalogo.js`, `js/domain/texto.js`.
- **Archivos modificados**: `js/ui/render.js` (renderizado del catálogo con `textContent`), `js/main.js` (arranque y eventos del catálogo), `index.html` (se retira el listado estático del catálogo y se agregan los elementos de estado y las referencias a los scripts).
- **Consumidores posteriores**: el alta de libros (`C-04`) toma editoriales, géneros y autores del mismo estado en memoria; la venta (`C-05`) usa los libros del catálogo.
- **Dependencias técnicas**: ninguna. Solo JavaScript nativo del navegador; sin red, sin backend, sin `localStorage` como requisito de este change (la persistencia es `C-06`).

## Nota de cierre retrospectivo

Este change se escribe **después** de implementado (as-built). Los artefactos describen el comportamiento que el código ya tiene, no un plan a futuro.

| Commit | Aporte al alcance |
|--------|-------------------|
| `97970a5` | Datos iniciales con identificadores estables (`js/data/seed.js`). |
| `2108f07` | Estado en memoria (`js/services/store.js`) y lógica del catálogo (`js/domain/catalogo.js`). |
| `241b685` | Renderizado del catálogo con `textContent` (`js/ui/render.js`). |
| `47c038d` | Filtro por título y catálogo generado desde los datos; retiro del listado estático de `index.html` (`js/main.js`). |
| `9927596` | Ajuste posterior: 30 géneros en orden alfabético, ids renumerados y relaciones del seed actualizadas. |
| `f867464` | Ajuste posterior: filtro sin tildes (`js/domain/texto.js`), reutilizado por el alta de libros. |

El estado del change en `CHANGES.md` figura como completado. El tamaño del seed supera el mínimo exigido por la consigna (2 géneros) porque el propietario del repositorio pidió un catálogo de géneros alfabético; el mínimo de la consigna se cumple igual.
