# Proposal

## Why

El sistema ya permite consultar el catálogo y dar de alta libros y clientes, pero todavía no puede registrar una operación: sin venta simulada no hay importes ni historial que consultar. Este change cierra el Ejercicio 5 (20 puntos) con la composición, validación, confirmación y consulta de ventas dentro del alcance simulado de la consigna, sin stock, cobros ni facturación fiscal.

## What Changes

- La vista **Ventas** permite elegir un cliente existente y componer renglones con un libro existente y una cantidad entera mayor que cero.
- El borrador de la venta vive en memoria mientras se compone; la cantidad rechaza cero, valores negativos y decimales.
- Si se agrega un libro que ya está en el borrador, se suma la cantidad al renglón existente sin crear un segundo renglón y se informa el duplicado.
- Antes de confirmar se pueden cambiar cantidades y quitar renglones; cada renglón muestra libro, cantidad, precio unitario y subtotal, con subtotal = cantidad × precio unitario y total = suma de subtotales, presentados con dos decimales.
- No se confirma una venta sin cliente, sin al menos un renglón o con cantidades inválidas; se muestran mensajes de rechazo en texto.
- Al confirmar se registra identificador, fecha, cliente, renglones y total. El título del libro, el nombre del cliente, el precio unitario y el subtotal se copian al renglón como valores históricos (snapshot): no se recalculan desde el catálogo al consultar el historial.
- El identificador visible de la venta tiene la forma `V-0001`; la fecha se presenta en formato local `dd/mm/aaaa hh:mm`.
- El **Historial** lista las ventas confirmadas con identificador, fecha, cliente y total, y permite consultar el detalle de cada venta con los importes confirmados.
- Las ventas confirmadas no se editan ni se eliminan desde la interfaz y no existe un control para recalcular su precio desde el catálogo.
- Se agregan mensajes para el historial vacío, el detalle sin selección y la confirmación exitosa.
- Se mantiene el alcance simulado: sin gestión de stock, cobros ni facturación fiscal.

## Capabilities

### New Capabilities

- `venta-e-historial`: composición en memoria de una venta simulada, validaciones de cliente/renglones/cantidades, cálculos de subtotal y total, confirmación con snapshot histórico e historial de solo lectura con detalle.

### Modified Capabilities

Ninguna: no existían capacidades previas en `openspec/specs/`.

## Impact

- **HTML**: `index.html`, secciones `#ventas` y `#historial` (formulario de venta, tabla de renglones, resumen, tabla de historial y detalle). No se agregan páginas nuevas.
- **Dominio**: `js/domain/ventas.js` (parseo de cantidad, validación de renglón y de venta, alta de renglón con duplicados, cálculo de subtotal/total, construcción de la venta con snapshot, formato de fecha e identificador).
- **Interfaz**: `js/ui/ventas-ui.js` (estado del borrador, eventos del formulario, render de renglones, historial y detalle).
- **Servicio**: `js/services/store.js` (`agregarVenta`, lectura de ventas en memoria).
- **Arranque**: `js/main.js` inicializa la vista de ventas junto con los listados y selectores existentes.
- **Dependencias**: ninguna externa; HTML, CSS y JavaScript nativos, sin librerías ni backend.
- **Dependencia posterior (fuera de este change)**: la conservación de libros, clientes y ventas entre recargas pertenece a `C-06` (`persistencia-verificacion-y-documentacion`); este change no declara requisitos de persistencia.

## Nota de cierre retrospectivo

Este change se documenta as-built: el comportamiento descrito ya está implementado en el código y fue incorporado por el commit `37fae19` («Ejercicios 4 y 5 fromularios»), previo a la escritura de estos artifacts. Las specs, el design y las tasks describen lo que ese código hace observablemente; no se modificó código, README, CHANGES ni AGENTS al redactarlos, y los tasks se marcan completados con ese commit como referencia.
