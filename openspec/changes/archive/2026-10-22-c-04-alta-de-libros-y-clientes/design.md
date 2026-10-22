# Design

## Context

Ver `proposal.md` — Why. El proyecto es una única página (`index.html`) con scripts clásicos cargados en orden y un namespace global `window.Libreria`; cada archivo es un IIFE con `'use strict'` y sin módulos ES ni dependencias. La capa de dominio (`js/domain/`) no toca el DOM, la capa de estado (`js/services/store.js`) es el único punto de escritura de las colecciones y la capa de interfaz (`js/ui/`) construye el DOM con `textContent`.

Las restricciones que condicionan este diseño son las del proyecto: HTML, CSS y JavaScript nativos; sin `fetch`, backend ni administración de editoriales, géneros o autores; sin edición ni eliminación de libros o clientes. La excepción del propietario (22/10/2026, regla 16) habilita editorial y autor con texto libre dentro del alta de libro.

## Goals / Non-Goals

**Goals:**

- Concentrar las reglas de alta en funciones puras que reciban los textos crudos del formulario y las colecciones locales, y devuelvan errores por campo más el registro listo para guardar.
- Mantener una única ruta de actualización de la interfaz tras un alta, sin recarga y sin duplicar lógica entre los dos formularios.
- Resolver la excepción de editorial y autor con texto libre sin abrir pantallas de administración ni introducir CRUD de datos maestros.

**Non-Goals:**

- Persistencia durable: este change escribe en el estado en memoria a través de `store`; la semántica de `localStorage` corresponde a `C-06`.
- Validación con atributos HTML5 como única defensa: los formularios usan `novalidate` y validan en JavaScript.
- Normalización avanzada de ISBN (dígito de control, prefijos) ni de precios con separadores de miles: la consigna no las exige.

## Decisions

### 1. Validación en el dominio, presentación en la interfaz

`js/domain/libros.js` y `js/domain/clientes.js` exponen funciones de validación que no tocan el DOM: reciben `datos` (los valores crudos de los controles) y `contexto`/colecciones, y devuelven `{ errores, libro }` o `{ errores, cliente }`, con `null` en el registro cuando hay errores. `js/ui/forms.js` se limita a leer el formulario, invocar la validación, pintar mensajes y guardar.

- **Por qué**: las reglas quedan legibles y verificables sin navegador, y la interfaz no decide unicidad ni normalizaciones.
- **Alternativas descartadas**: validación solo con atributos HTML5 (`required`, `type="email"`) — no compara ISBN normalizado, no verifica unicidad y no produce mensajes por campo en español; validación dentro del manejador de `submit` — mezcla DOM con reglas y duplica la lógica entre libro y cliente.

### 2. Normalización explícita de ISBN

El ISBN se compara quitando espacios y guiones (`/[\s-]/g`) y pasando a mayúsculas, para que la `x` final de un ISBN-10 no genere un falso duplicado. No se valida el dígito de control.

- **Por qué**: es literalmente lo que pide la consigna y mantiene el formato original en el registro guardado; solo se normaliza para comparar.
- **Alternativas descartadas**: guardar el ISBN normalizado — pierde la legibilidad del dato original; validar el dígito de control — excede el alcance.

### 3. Precio con coma o punto, sin `parseFloat` directo

El precio se recorta, se reemplaza la primera coma por punto y se valida con `/^\d+(\.\d+)?$/` antes de convertirlo con `Number`.

- **Por qué**: `parseFloat("12abc")` devuelve `12` y `parseFloat("1,5")` devuelve `1`; ambos aceptarían entradas que el usuario percibe como inválidas. La expresión exige un número completo y positivo (el signo y el cero se rechazan después).
- **Alternativas descartadas**: `type="number"` como única validación — el navegador rechaza la coma en configuraciones regionales y el mensaje nativo no es consistente ni traducible al alcance del proyecto.

### 4. Clave de nombre compartida para editorial y autor

`js/domain/texto.js` quita tildes conservando la ñ; `libros.js` construye con ella una clave de comparación que colapsa espacios repetidos, recorta y pasa a minúsculas. La misma clave se usa para buscar la editorial existente y para el control anti-redundante de autores.

- **Por qué**: una sola definición de equivalencia evita que la editorial y el autor discrepen; el filtro del catálogo ya reutiliza `quitarTildes`.
- **Alternativas descartadas**: comparación exacta — daría de alta "Editorial Astral" y "editorial ástral" como distintas; comparación solo con `toLowerCase()` — dejaría pasar duplicados por tilde.

### 5. Editorial nueva: se crea antes del libro, en el mismo envío

La validación devuelve `editorialId` cuando el nombre coincide con una editorial local, o `editorialNueva` con el nombre normalizado en espacios cuando no coincide. La interfaz, antes de guardar el libro, agrega la editorial al conjunto local, asigna su `id` al libro y elimina el campo auxiliar.

- **Por qué**: mantiene la integridad referencial que exige el modelo (`Libro.editorialId` siempre apunta a una editorial existente) sin una pantalla de administración.
- **Alternativas descartadas**: guardar el nombre de la editorial como texto dentro del libro — rompe el modelo y el catálogo; crear la editorial al perder el foco del campo — genera altas parciales si el usuario abandona el formulario.

### 6. Autor nuevo: alta inmediata y selección marcada

El autor se agrega con el botón "Agregar" (o `Enter` en el campo, que se intercepta para no enviar el libro). Si no existe, se suma al conjunto local, se reconstruyen las casillas con ese autor marcado y se actualizan las sugerencias.

- **Por qué**: el autor nuevo debe poder combinarse con otros autores en el mismo alta; el marcado evita un segundo paso manual.
- **Alternativas descartadas**: crear el autor recién al guardar el libro — exigiría recordar y reconstruir la selección, y complicaría el caso de varios autores nuevos.

### 7. Errores por campo más resumen, con foco en el primero

Cada control tiene un párrafo de error asociado por `aria-describedby`; el formulario tiene un `<ul role="alert">` oculto que se llena con los mismos mensajes. Al rechazar, se limpian los errores previos, se marcan los controles con `aria-invalid`, se muestra el resumen y el foco pasa al primer control inválido. Los grupos de casillas no reciben `aria-invalid` (no hay un control único).

- **Por qué**: cumple los mensajes de operaciones rechazadas y la regla de errores expresados con texto, y guía al usuario sin depender del color.
- **Alternativas descartadas**: `alert()` del navegador — interrumpe y no asocia el mensaje al campo; mostrar solo el resumen — obliga a buscar el campo afectado.

### 8. Un callback de refresco para todas las vistas dependientes

`main.js` entrega a ambos formularios una función `actualizarListadosYOpciones` que redibuja catálogo, tablas de libros y clientes, sugerencias de editorial y autor, casillas de autores y selectores de venta. Los renderizadores conservan la selección previa de los `<select>` y las casillas marcadas.

- **Por qué**: un solo punto de verdad para "qué depende de los datos"; agregar un listado nuevo no obliga a tocar los formularios.
- **Alternativas descartadas**: recargar la página — la consigna pide actualización sin recarga; eventos personalizados — complejidad innecesaria para una página única.

### 9. Identificadores consecutivos calculados en el store

El alta asigna `id = mayor id existente + 1` en la colección destino antes de insertar.

- **Por qué**: cumple identificadores consecutivos y estables y es determinista para la verificación manual; como no hay eliminación, no hay huecos que reutilizar.
- **Alternativas descartadas**: `Date.now()` o UUID — no son consecutivos y complican la lectura del historial y de las pruebas manuales.

### 10. Editorial con `datalist`, autores con casillas

La editorial es un `<input>` con `<datalist>` de las editoriales registradas; los autores son casillas generadas en un `<fieldset>`; el autor nuevo usa un `<input>` con su propio `<datalist>` y un botón. Todo texto se inserta con `textContent`.

- **Por qué**: el texto libre es la excepción autorizada y el `datalist` sugiere sin restringir; las casillas son el "control equivalente" al selector múltiple y muestran todos los autores a la vez.
- **Alternativas descartadas**: `<select>` cerrado para editorial — impediría el texto libre; `<select multiple>` para autores — selección menos visible y más difícil de operar con teclado.

## Risks / Trade-offs

- **[ISBN con separadores distintos de espacio o guion]** → La consigna solo exige ignorar espacios y guiones; un punto o una barra producirían un duplicado. Mitigación: el texto de ayuda del campo lo aclara y la comparación cumple el requisito literal.
- **[Precio con separador de miles]** → `"1.500,50"` se rechaza porque hay dos separadores. Mitigación: el ejemplo del campo usa `1500.50`; la consigna no define formato de miles.
- **[Editorial creada antes que el libro]** → Si el alta del libro fallara después de crear la editorial, quedaría una editorial sin libros. Mitigación: la validación ocurre completa antes de cualquier escritura y agregar a un array en memoria no falla; el riesgo es teórico.
- **[Autor nuevo permanece aunque no se guarde el libro]** → Es consecuencia de la excepción autorizada ("se suma al agregarlo"). Mitigación: el autor queda visible y reutilizable en las casillas; no se crea ningún libro incompleto.
- **[Comparación sin tildes conserva la ñ]** → "Pena" y "Peña" se consideran distintos. Es la decisión ya tomada para el filtro del catálogo; se mantiene por coherencia.
- **[Resumen de errores duplica el texto de cada campo]** → Un lector de pantalla podría anunciar dos veces el mismo mensaje. Mitigación: el resumen es la región `role="alert"` que anuncia el rechazo; los mensajes por campo quedan asociados por `aria-describedby` al enfocar.
- **[`datalist` con soporte variable]** → Algunos navegadores muestran las sugerencias de forma distinta. Mitigación: sigue siendo un campo de texto libre; el valor escrito se acepta igual.

## Migration Plan

No hay migración de datos ni de infraestructura: son archivos estáticos que se abren con `index.html`, sin build ni dependencias. El cambio se entrega en el mismo commit de código y se verifica manualmente con los casos 2 y 3 de la consigna (ISBN duplicado/nuevo y email inválido/repetido/nuevo). Revertir consiste en revertir los commits `37fae19` y `f867464`; no hay datos persistidos por este change que limpiar (la persistencia se incorpora en `C-06`).

## Open Questions

Ninguna: el alcance, la excepción de texto libre y el formato de precio quedaron resueltos por la consigna y la decisión del propietario.
