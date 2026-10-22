# Tasks

> Change retrospectivo (as-built): todas las tareas quedaron implementadas en el commit `37fae19` («Ejercicios 4 y 5 fromularios»). Los checkboxes se marcan con el código ya presente en el repositorio; no se modificó código al escribir estos artifacts.

## 1. Estructura de la vista de venta

- [x] 1.1 Definir en `index.html` la sección `#ventas` con formulario, selector de cliente, campo de libro, campo de cantidad y botón «Agregar renglón», verificando que cada campo tenga `label` asociada y `aria-describedby` hacia su mensaje de error (commit `37fae19`).
- [x] 1.2 Agregar la tabla de renglones con encabezados Libro/Cantidad/Precio unitario/Subtotal/Acciones, pie con total, resumen de la venta y contenedor de errores con `role="alert"`; verificar que la tabla se desplace dentro de `.tabla-envoltura` y no ensanche la página (commit `37fae19`).
- [x] 1.3 Incluir los mensajes de estado del borrador («Todavía no agregaste renglones.»), del resultado de la operación y del rechazo; verificar que se muestren como texto y no solo por color (commit `37fae19`).

## 2. Dominio de la venta

- [x] 2.1 Implementar `parsearCantidad` en `js/domain/ventas.js` con recorte de espacios, regex de dígitos y descarte de cero; verificar que `0`, `-1`, `1.5`, vacío y texto devuelvan `null` (commit `37fae19`).
- [x] 2.2 Implementar `calcularSubtotal` y `calcularTotal` con redondeo a dos decimales; verificar que dos unidades a 1500 den $ 3000.00, una a 2000 den $ 2000.00 y el total sea $ 5000.00 (commit `37fae19`).
- [x] 2.3 Implementar `validarRenglon` (libro existente y cantidad válida) y `validarVenta` (cliente existente, al menos un renglón y ninguna cantidad nula), verificando que devuelvan mensajes en texto para cada rechazo (commit `37fae19`).
- [x] 2.4 Implementar `agregarRenglon` para sumar la cantidad al libro repetido sin crear otro renglón y devolver la marca de duplicado; verificar que dos altas del mismo libro dejen un solo renglón con la cantidad acumulada (commit `37fae19`).
- [x] 2.5 Implementar `construirVenta` copiando título, precio unitario y subtotal por renglón, y cliente, fecha, renglones y total por venta; verificar que el objeto resultante no requiera consultar el catálogo para mostrar sus importes (commit `37fae19`).
- [x] 2.6 Implementar `formatearIdentificador` (`V-0001`) y `formatearFecha` (`dd/mm/aaaa hh:mm` local); verificar los formatos con una venta de id 1 y una fecha conocida (commit `37fae19`).

## 3. Composición y confirmación en la interfaz

- [x] 3.1 Mantener el borrador de renglones en estado de módulo dentro de `js/ui/ventas-ui.js` y renderizar la tabla con `textContent`, verificando que los datos del libro no se inserten como HTML (commit `37fae19`).
- [x] 3.2 Conectar «Agregar renglón» con la validación del dominio, el alta o suma de cantidad y el mensaje de duplicado; verificar que un renglón válido aparezca con precio unitario y subtotal y que la venta no se registre todavía (commit `37fae19`).
- [x] 3.3 Permitir editar la cantidad de un renglón y quitarlo con delegación de eventos, recalculando subtotal y total; verificar que una cantidad inválida marque `aria-invalid`, muestre «Cantidad inválida» y bloquee la confirmación (commit `37fae19`).
- [x] 3.4 Implementar la confirmación con `preventDefault`, revalidación de cliente/renglones/cantidades, alta en `store.agregarVenta`, limpieza del formulario y mensaje de resultado con identificador y total; verificar que una venta inválida no se agregue al historial (commit `37fae19`).
- [x] 3.5 Sincronizar el resumen de la venta (cliente, cantidad de renglones y total) y el vaciado del borrador al usar «Vaciar venta»; verificar que el formulario vuelva a su estado inicial sin recargar (commit `37fae19`).

## 4. Historial y detalle

- [x] 4.1 Renderizar en `#historial` una fila por venta confirmada con identificador, fecha, cliente y total; verificar que el identificador sea visible como `V-0001` y la fecha en formato local (commit `37fae19`).
- [x] 4.2 Mostrar el mensaje de historial vacío («Todavía no se confirmó ninguna venta.») cuando la colección no tiene ventas, verificando que no queden filas ni detalle visible (commit `37fae19`).
- [x] 4.3 Implementar «Ver detalle» leyendo solo los renglones guardados (título, cantidad, precio unitario, subtotal) y el total de la venta; verificar que el detalle coincida con lo confirmado (commit `37fae19`).
- [x] 4.4 Comprobar que el historial y el detalle solo ofrezcan consulta: ninguna acción de edición, eliminación ni recálculo de precios; verificar que no existan controles para esas operaciones (commit `37fae19`).
- [x] 4.5 Verificar que un cambio posterior del precio del libro en el catálogo en memoria no altere el precio unitario, los subtotales ni el total de una venta ya confirmada (la comprobación con recarga pertenece a `C-06`) (commit `37fae19`).

## 5. Integración y verificación manual

- [x] 5.1 Inicializar la vista de ventas desde `js/main.js` después de poblar los selectores de cliente y libro, verificando que las opciones provengan de los datos locales y que las altas de C-04 se reflejen sin recargar (commit `37fae19`).
- [x] 5.2 Ejecutar el caso manual 4 de la consigna: venta sin cliente, cantidad cero, negativa o decimal y libro repetido; verificar que no se confirme la venta y que el duplicado no cree otro renglón (commit `37fae19`).
- [x] 5.3 Ejecutar el caso manual 5 de la consigna: venta válida con dos unidades a 1500 y una a 2000; verificar subtotales $ 3000.00 y $ 2000.00, total $ 5000.00 y detalle conservado en el historial (commit `37fae19`).
- [x] 5.4 Verificar los estados accesibles de la vista (foco en el campo con error, mensajes anunciados por `role="alert"`/`role="status"`, recorrido por teclado de renglones e historial) sin salir del alcance nativo de HTML, CSS y JavaScript (commit `37fae19`).

## Workflow follow-up

- Registrar en `C-06` los resultados observados de los casos manuales 4, 5 y 6 y la persistencia entre recargas.
- Archivar el change cuando la revisión del proyecto lo indique.
