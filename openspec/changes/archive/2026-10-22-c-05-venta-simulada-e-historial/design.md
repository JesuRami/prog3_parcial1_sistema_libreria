# Design

## Context

Ver `proposal.md` § Why. El proyecto es un frontend estático abierto por `file://` con HTML, CSS y JavaScript nativos, sin build ni dependencias. Ya existen:

- Catálogo con datos locales en `js/data/seed.js` y estado en memoria en `js/services/store.js` (colecciones `libros`, `clientes`, `ventas` y maestros).
- Altas de libros y clientes (`js/ui/forms.js`) que repueblan listados y los selectores `#venta-cliente` y `#venta-libro` desde `js/main.js`.
- Estructura HTML de las vistas `#ventas` y `#historial` con formulario, tablas, mensajes y regiones accesibles (`index.html`).
- Persistencia por colección en `js/services/persistencia.js`, usada por el store.

La consigna fija el contrato de venta en el Ejercicio 5 y las reglas `RN-VTA`/`RN-HIS`. Las specs de `venta-e-historial` son el contrato de comportamiento; este documento explica la implementación as-built.

## Goals / Non-Goals

**Goals:**

- Aislar las reglas de la venta en un módulo de dominio sin DOM, reutilizable y verificable de forma manual.
- Mantener el borrador de la venta separado de las ventas confirmadas.
- Congelar los importes y datos descriptivos al confirmar, de modo que el historial no dependa del catálogo.
- Reutilizar los patrones existentes de render seguro (`textContent`), mensajes de estado y tablas con encabezados.

**Non-Goals:**

- Persistencia entre recargas y su verificación manual: pertenecen a `C-06`.
- Edición, eliminación o anulación de ventas; stock, cobros, facturación fiscal, clientes ocasionales o múltiples monedas.
- Cambios de CSS o de estructura de vistas fuera de las secciones ya maquetadas.
- Tests automatizados o herramientas de compilación (prohibidos por la consigna).

## Decisions

### Separación dominio / vista / store

- **Decisión**: `js/domain/ventas.js` contiene funciones puras (parseo, validaciones, cálculos, armado de la venta, formatos). `js/ui/ventas-ui.js` mantiene el borrador y manipula el DOM. `js/services/store.js` expone `getVentas()` y `agregarVenta()`.
- **Alternativa descartada**: concentrar toda la lógica en la vista. Se descartó porque impide razonar las reglas sin DOM y repite el patrón ya usado por catálogo, libros y clientes.

### Borrador fuera del store

- **Decisión**: el borrador es un array de módulo (`renglones`) dentro de `ventas-ui.js`; solo la venta construida y validada se agrega al store.
- **Alternativa descartada**: guardar renglones incompletos en la colección `ventas`. Contaminaría el historial con estados inválidos y obligaría a filtrar ventas a medio armar.

### Renglón de borrador tolerante a cantidad inválida

- **Decisión**: cada renglón de borrador es `{ libroId, cantidad, texto }`, donde `cantidad` es un entero válido o `null` y `texto` conserva lo escrito. Un renglón inválido permanece visible con subtotal «Cantidad inválida», no suma al total y bloquea la confirmación.
- **Alternativa descartada**: impedir la escritura de valores inválidos en el campo. Se descartó porque oculta el error y no permite explicar por qué la cantidad no sirve; la interfaz ya usa `min`, `step` y mensajes en texto.
- **Consecuencia**: `calcularTotal` ignora los renglones con `cantidad === null` para que el total del borrador no se rompa mientras se corrige.

### Validación estricta de cantidad

- **Decisión**: `parsearCantidad` recorta espacios, exige `/^\d+$/` y luego `> 0`. Rechaza `0`, `-1`, `1.5`, vacío y texto.
- **Alternativa descartada**: `Number(texto)` con comprobación de rango, que aceptaría `1.5`, `''` como `0` y notaciones como `1e3`. La regex expresa directamente «entero positivo escrito en dígitos».

### Duplicado: suma e informa

- **Decisión**: `agregarRenglon` busca el `libroId`; si existe, suma la cantidad y actualiza el texto; devuelve `true` para que la vista muestre «Ese libro ya estaba en la venta: se sumó la cantidad al renglón existente.». Si no existe, agrega el renglón y devuelve `false`.
- **Alternativa descartada**: rechazar el duplicado con error. La consigna admite «se modifica la cantidad del renglón existente o se informa el duplicado»; sumar y avisar cubre ambas sin perder la intención del operador.

### Snapshot al confirmar

- **Decisión**: `construirVenta` copia por renglón `libroId`, `titulo`, `cantidad`, `precioUnitario` y `subtotal`, y por venta `fecha`, `clienteId`, `clienteNombre`, `renglones` y `total`. El render del historial y del detalle lee exclusivamente esos valores guardados; nunca consulta el precio actual del libro.
- **Alternativa descartada**: guardar solo `libroId` y resolver título/precio al mostrar. Perdería el valor histórico y haría que un cambio de catálogo alterara ventas pasadas.

### Redondeo de importes

- **Decisión**: `redondear` aplica `Math.round(importe * 100) / 100` a cada subtotal y al total. La presentación usa `formatearPrecio` (`$ ` + `toFixed(2)`).
- **Alternativa descartada**: acumular flotantes sin redondear y confiar solo en el formato. Podría producir totales con centavos espurios al sumar precios con decimales.

### Identificador y fecha

- **Decisión**: el `id` numérico lo asigna el store con `siguienteId` (mayor + 1) y se muestra como `V-` + cuatro dígitos (`formatearIdentificador`). La fecha se guarda como ISO (`toISOString()`) y se muestra en hora local como `dd/mm/aaaa hh:mm` con padding manual.
- **Alternativa descartada**: guardar el identificador visible como clave de la colección. Rompe la convención numérica de las demás entidades y complica el lookup por id.
- **Alternativa descartada**: `Intl.DateTimeFormat` para la fecha. El padding manual alcanza para el formato requerido y evita depender de la configuración regional del navegador.

### Interacción y render

- **Decisión**: el formulario usa `submit` con `preventDefault`; la tabla de renglones usa delegación de `change` (editar cantidad) y `click` (quitar); el historial usa delegación de `click` para «Ver detalle». El botón de reset dispara el evento antes de restaurar los valores, por lo que el redibujado se difiere con `setTimeout(renderBorrador, 0)`.
- **Alternativa descartada**: listeners por fila. Se regeneran las filas en cada render y se perderían; la delegación es estable.
- **Seguridad**: todo dato dinámico se inserta con `textContent`; no se usa `innerHTML` para valores de usuario o del catálogo. Los botones incluyen texto oculto para lectores de pantalla que contextualiza la acción.

### Accesibilidad y estados

- **Decisión**: los errores se escriben en párrafos asociados con `aria-describedby`, se marca `aria-invalid` en el control, el resumen usa `role="alert"` y los resultados/estados usan `role="status"`. Las tablas conservan `thead`, `tfoot` y contenedores con scroll propio.
- **Alternativa descartada**: mensajes visuales efímeros sin región viva. No serían anunciados por lectores de pantalla ni quedarían disponibles para corrección.

## Risks / Trade-offs

- **Renglón inválido visible pero no sumado** → el total puede no coincidir con la suma «a ojo» de los renglones. Mitigación: subtotal «Cantidad inválida», `aria-invalid`, resumen de errores y bloqueo de confirmación.
- **Duplicado que suma cantidades grandes** → el subtotal puede crecer sin límite práctico. Mitigación: se acepta por alcance simulado; no hay stock que controlar.
- **Precios con centavos y aritmética de punto flotante** → diferencias de un centavo. Mitigación: redondeo por subtotal y del total antes de mostrar y guardar.
- **Fecha guardada en UTC y mostrada en local** → dos usuarios en husos distintos ven horas distintas para el mismo instante. Mitigación: es el comportamiento esperado de «fecha local»; la consigna no fija formato ni zona.
- **Reset diferido con `setTimeout`** → si cambia el orden de eventos del navegador, el borrador podría redibujarse con valores viejos. Mitigación: el timeout a 0 se ejecuta después del reset y el render vuelve a leer el estado del módulo.
- **Venta referenciada por id para el detalle** → si la colección cambiara por fuera de la interfaz, el detalle quedaría sin venta. Mitigación: `renderDetalle` trata el `null` y muestra el mensaje de detalle vacío sin romper el render.

## Migration Plan

- No hay migración de datos: la colección `ventas` parte vacía en el seed y no existían ventas previas.
- El código ya está incorporado en el commit `37fae19`; el despliegue es abrir `index.html` en el navegador.
- Rollback: revertir ese commit y las referencias de scripts de la vista; no hay estado persistido que limpiar en este change.

## Open Questions

Ninguna que afecte las specs, el enfoque o las tasks. El formato de fecha y la convención de identificador son decisiones documentadas arriba; la consigna no los fija.
