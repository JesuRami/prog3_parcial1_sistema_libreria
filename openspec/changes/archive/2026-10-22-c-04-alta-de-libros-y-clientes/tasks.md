# Tasks

## 1. Dominio del alta de libro

- [x] 1.1 Normalizar el ISBN para compararlo sin espacios ni guiones y sin distinguir mayúsculas; verificado por inspección de `js/domain/libros.js` (commit `37fae19`).
- [x] 1.2 Implementar el parseo del precio con coma o punto decimal y rechazar valores no numéricos, cero o negativos; verificado por inspección de `parsearPrecio` y su uso en `validarLibro` (commit `37fae19`).
- [x] 1.3 Validar título e ISBN obligatorios, ISBN no repetido, editorial obligatoria, género opcional existente y al menos un autor existente, devolviendo un mensaje por campo; verificado por inspección de `validarLibro` contra los requisitos del spec (commit `37fae19`).
- [x] 1.4 Resolver la editorial escrita contra el conjunto local y devolver el `editorialId` existente o el nombre de la editorial nueva; verificado por inspección de `buscarEditorialPorNombre` y del objeto devuelto (commit `37fae19`, ampliado en `f867464`).

## 2. Dominio del alta de cliente

- [x] 2.1 Normalizar el email sin espacios exteriores y sin distinguir mayúsculas, y validar el formato `algo@dominio.ext` sin espacios; verificado por inspección de `js/domain/clientes.js` (commit `37fae19`).
- [x] 2.2 Validar nombre completo y email obligatorios y email no repetido, devolviendo un mensaje por campo; verificado por inspección de `validarCliente` contra los requisitos del spec (commit `37fae19`).

## 3. Formularios y mensajes de la interfaz

- [x] 3.1 Maquetar los formularios de libro y cliente con etiquetas asociadas, sugerencias de editorial, selector de género con "Sin clasificar", casillas de autores y campo de autor nuevo; verificado en `index.html` y en el formulario renderizado (commit `37fae19`, ampliado en `f867464`).
- [x] 3.2 Controlar el envío con `preventDefault`, leer los valores crudos del formulario y guardar solo cuando la validación no devuelve errores; verificado por inspección de `js/ui/forms.js` (commit `37fae19`).
- [x] 3.3 Limpiar los errores previos, pintar un mensaje por campo y un resumen con `role="alert"`, marcar `aria-invalid` y enfocar el primer control inválido; verificado por inspección de `mostrarErrores` y `limpiarErrores` (commit `37fae19`).
- [x] 3.4 Mostrar el mensaje de resultado de alta o de rechazo, limpiar el formulario tras un alta correcta y devolver el foco al primer campo; verificado por inspección de ambos manejadores de `submit` (commit `37fae19`).

## 4. Estado y actualización sin recarga

- [x] 4.1 Dar de alta libros y clientes en el estado en memoria con identificador consecutivo al mayor existente, e incorporar editoriales y autores nuevos con la misma regla; verificado por inspección de `js/services/store.js` (commit `37fae19`, ampliado en `f867464`).
- [x] 4.2 Redibujar tras el alta el catálogo, las tablas de libros y clientes, las sugerencias, las casillas y los selectores de venta, conservando la selección previa; verificado por inspección de `actualizarListadosYOpciones` en `js/main.js` y de los renderizadores que preservan la selección (commit `37fae19`).
- [x] 4.3 Insertar títulos, nombres, emails e ISBN como texto en el DOM, sin `innerHTML`; verificado por inspección de `js/ui/render.js` y de la construcción de opciones y casillas (commit `37fae19`).

## 5. Editorial y autor con texto libre

- [x] 5.1 Aceptar una editorial registrada o nueva en el campo con sugerencias, reutilizar la existente cuando el nombre coincide sin mayúsculas, tildes ni espacios repetidos, y sumar la nueva al conjunto local al guardar el libro; verificado por inspección de `iniciarFormularioLibro` y `buscarEditorialPorNombre` (commit `f867464`).
- [x] 5.2 Permitir agregar un autor nuevo con botón o `Enter` sin enviar el libro, avisar sin duplicar cuando ya existe, y sumarlo marcado en las casillas y en las sugerencias; verificado por inspección de `iniciarAltaAutorNuevo` (commit `f867464`).
- [x] 5.3 Compartir la utilidad que quita tildes conservando la ñ y usarla en la clave de comparación de nombres; verificado por inspección de `js/domain/texto.js` y de `claveDeNombre` (commit `f867464`).

## 6. Verificación e integración

- [x] 6.1 Contrastar por inspección las reglas implementadas con `RN-LIB-01`…`RN-LIB-17` y `RN-CLI-01`…`RN-CLI-08` de `knowledge-base/05_reglas_de_negocio.md`; no quedan reglas del alcance sin implementación en el código revisado.
- [x] 6.2 Confirmar que los casos manuales 2 y 3 de la consigna siguen registrados como "Pendiente de ejecución" en `README.md`: no se declaran aprobados sin ejecutarlos (regla dura 22; su ejecución y registro corresponden a `C-06`).
- [x] 6.3 Confirmar que los listados no exponen acciones de edición ni eliminación y que no existen pantallas de administración de editoriales, géneros o autores; verificado por inspección de `index.html` y de `js/ui/render.js`.

## Workflow follow-up

- Ejecutar en el navegador y registrar el resultado real de los casos manuales 2 y 3 durante `C-06`, antes de darlos por aprobados.
- Archivar el change una vez satisfecha la revisión del proyecto.
