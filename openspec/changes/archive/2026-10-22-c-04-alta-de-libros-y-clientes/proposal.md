# Proposal

## Why

El catálogo ya se genera desde los datos locales, pero los conjuntos solo contienen los ejemplos del seed: no hay forma de ampliar la librería desde la interfaz. El Ejercicio 4 (15 puntos) exige dar de alta libros y clientes con validaciones estrictas y sin recargar la página, y esos registros nuevos son los que después consumen las ventas y el historial.

## What Changes

- Se agrega la validación de dominio del alta de libros (`js/domain/libros.js`): título e ISBN obligatorios, ISBN comparado sin espacios ni guiones (duplicados rechazados, sin dígito de control), precio numérico mayor que cero aceptando coma o punto como separador decimal, editorial obligatoria, género opcional ("Sin clasificar" cuando no se elige) y al menos un autor existente.
- Se agrega la validación de dominio del alta de clientes (`js/domain/clientes.js`): nombre completo obligatorio, email con formato válido y email único comparado sin espacios exteriores y sin distinguir mayúsculas.
- Se conectan ambos formularios (`js/ui/forms.js`) con control de envío mediante `preventDefault`: los errores se muestran junto a cada campo y en un resumen con `role="alert"`, el registro solo se agrega si todas las comprobaciones pasan, y el resultado de la operación se anuncia en un mensaje de estado.
- Tras un alta correcta, el listado correspondiente, el catálogo, el selector de venta y las opciones relacionadas se actualizan sin recargar la página (`js/main.js`); el formulario queda limpio y el foco vuelve al primer campo.
- Los libros y clientes nuevos reciben un `id` consecutivo estable a partir del mayor `id` existente (`js/services/store.js`) y se insertan como texto en el DOM (`js/ui/render.js`).
- Excepción autorizada por el propietario del repositorio (22/10/2026, reversible) al alcance de la regla 16: editorial y autor admiten texto libre en el alta de libro. La editorial se escribe en un campo con sugerencias de las ya registradas; el autor nuevo se agrega con un botón dentro del formulario y queda marcado. La comparación de nombres ignora mayúsculas, tildes y espacios repetidos: si el nombre ya existe se avisa y no se duplica; si es nuevo, la editorial se suma al conjunto local al guardar el libro y el autor al agregarlo, y ambos quedan disponibles en las casillas y sugerencias.
- Sin cambios de alcance: no se implementa edición ni eliminación de libros o clientes, no hay `fetch`, no se administran editoriales, géneros ni autores en pantallas propias, y no se agregan dependencias ni herramientas de compilación.

## Capabilities

### New Capabilities

- `altas-de-libros-y-clientes`: alta de libros y de clientes desde la interfaz, con opciones generadas desde los datos locales, validaciones por campo y de unicidad (ISBN y email), mensajes de error y de resultado, excepción de editorial y autor con texto libre, e incorporación del registro al catálogo, a los listados y a los selectores de venta sin recarga.

### Modified Capabilities

Ninguna: todas las capacidades de esta entrega se introducen como nuevas; no hay requisitos existentes que modificar.

## Impact

- **Archivos nuevos**: `js/domain/libros.js`, `js/domain/clientes.js`.
- **Archivos modificados**: `js/ui/forms.js` (envío, errores y resultado de ambos formularios), `js/ui/render.js` (opciones de selectores, sugerencias y casillas de autores), `js/services/store.js` (altas de libro, cliente, editorial y autor), `js/main.js` (redibujo de listados y selectores tras el alta), `index.html` (formularios de libro y cliente con sus mensajes, y vista de clientes registrados).
- **Consumidores posteriores**: la venta (`C-05`) toma los libros y clientes recién dados de alta de los mismos selectores que este change actualiza; el historial conserva los datos descriptivos de esos registros.
- **Dependencias técnicas**: ninguna. Solo JavaScript nativo del navegador; sin red, sin backend y sin `localStorage` como requisito de este change (la persistencia es `C-06`).

## Nota de cierre retrospectivo

Este change se escribe **después** de implementado (as-built). Los artefactos describen el comportamiento que el código ya tiene, no un plan a futuro.

| Commit | Aporte al alcance |
|--------|-------------------|
| `37fae19` | Formularios de alta de libro y de cliente: validación de dominio, conexión de los formularios y actualización de listados y selectores (`js/domain/libros.js`, `js/domain/clientes.js`, `js/ui/forms.js`, `js/ui/render.js`, `js/services/store.js`, `js/main.js`, `index.html`). |
| `f867464` | Ajuste posterior: editorial y autor con texto libre (excepción de la regla 16), comparación de nombres sin mayúsculas ni tildes, sugerencias y casillas actualizadas (`js/domain/libros.js`, `js/domain/texto.js`, `js/ui/forms.js`, `js/ui/render.js`, `js/services/store.js`, `index.html`). |

El commit `f7f90d3` es posterior y no forma parte del alcance funcional de este change: incorpora la persistencia en `js/services/persistencia.js`, que corresponde a `C-06`.
