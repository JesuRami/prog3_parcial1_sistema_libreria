# Spec Delta

## Purpose

Permite armar una venta simulada con cliente y renglones, confirmarla con importes históricos y consultar después las ventas confirmadas sin alterar sus valores.

## ADDED Requirements

### Requirement: Composición de la venta en borrador

El sistema SHALL permitir elegir un cliente existente y agregar renglones con un libro existente y una cantidad entera mayor que cero. El borrador SHALL permanecer en memoria hasta que la venta se confirme o se vacíe.

#### Scenario: Renglón válido agregado al borrador

- **WHEN** se elige un cliente existente, se selecciona un libro y se ingresa la cantidad 2
- **THEN** el borrador muestra un renglón con el libro, la cantidad 2, el precio unitario y su subtotal
- **AND** el total del borrador se actualiza
- **AND** la venta todavía no aparece en el historial

#### Scenario: Borrador sin renglones

- **WHEN** no se agregó ningún renglón
- **THEN** la tabla de renglones está vacía y se muestra el mensaje «Todavía no agregaste renglones.»

### Requirement: Cantidad entera mayor que cero

El sistema SHALL aceptar únicamente cantidades enteras mayores que cero y MUST rechazar cero, los valores negativos y los decimales sin agregar ni modificar el renglón.

#### Scenario: Cantidad cero

- **WHEN** se ingresa la cantidad 0 y se intenta agregar el renglón
- **THEN** se muestra en texto el mensaje «La cantidad debe ser un número entero mayor que cero.»
- **AND** no se agrega ningún renglón

#### Scenario: Cantidad negativa

- **WHEN** se ingresa la cantidad -1 y se intenta agregar el renglón
- **THEN** se muestra en texto el mensaje «La cantidad debe ser un número entero mayor que cero.»
- **AND** no se agrega ningún renglón

#### Scenario: Cantidad decimal

- **WHEN** se ingresa la cantidad 1.5 y se intenta agregar el renglón
- **THEN** se muestra en texto el mensaje «La cantidad debe ser un número entero mayor que cero.»
- **AND** no se agrega ningún renglón

### Requirement: Libro repetido en el borrador

El sistema SHALL sumar la cantidad al renglón existente cuando se agrega un libro que ya está en el borrador, sin crear un segundo renglón, y SHALL informar que la cantidad se sumó.

#### Scenario: Duplicado suma sin crear renglón

- **WHEN** el borrador ya tiene el libro con cantidad 2 y se vuelve a agregar el mismo libro con cantidad 3
- **THEN** queda un único renglón para ese libro con cantidad 5
- **AND** se muestra el mensaje «Ese libro ya estaba en la venta: se sumó la cantidad al renglón existente.»

### Requirement: Ajuste del borrador antes de confirmar

El sistema SHALL permitir cambiar la cantidad de un renglón y quitar renglones mientras la venta no esté confirmada, recalculando los importes del borrador.

#### Scenario: Cambio de cantidad

- **WHEN** se modifica la cantidad de un renglón del borrador
- **THEN** el subtotal de ese renglón y el total de la venta se recalculan con la nueva cantidad

#### Scenario: Renglón quitado

- **WHEN** se pulsa «Quitar» en un renglón del borrador
- **THEN** el renglón desaparece de la tabla y el total se recalcula sin él

### Requirement: Cálculo de subtotal y total

El sistema SHALL calcular el subtotal de cada renglón como cantidad por precio unitario y el total como la suma de los subtotales, y SHALL presentar los importes con dos decimales.

#### Scenario: Dos unidades a 1500 y una a 2000

- **WHEN** el borrador tiene dos unidades de un libro de precio 1500 y una unidad de un libro de precio 2000
- **THEN** los subtotales son $ 3000.00 y $ 2000.00
- **AND** el total es $ 5000.00

#### Scenario: Importes con dos decimales

- **WHEN** se muestra un subtotal, un total o un precio unitario
- **THEN** el importe se presenta con exactamente dos decimales

### Requirement: Bloqueo de confirmación inválida

El sistema SHALL impedir la confirmación cuando no hay cliente elegido, cuando el borrador no tiene renglones o cuando alguna cantidad es inválida, y SHALL mostrar los motivos como texto.

#### Scenario: Venta sin cliente

- **WHEN** se intenta confirmar con al menos un renglón válido pero sin cliente elegido
- **THEN** no se registra la venta
- **AND** se muestra el mensaje «Elegí un cliente.»

#### Scenario: Venta sin renglones

- **WHEN** se intenta confirmar con un cliente elegido y el borrador vacío
- **THEN** no se registra la venta
- **AND** se muestra el mensaje «Agregá al menos un renglón.»

#### Scenario: Venta con cantidad inválida

- **WHEN** el borrador contiene un renglón cuya cantidad no es un entero mayor que cero
- **THEN** no se registra la venta
- **AND** se muestra un mensaje en texto que pide corregir las cantidades

### Requirement: Confirmación de la venta

El sistema SHALL registrar al confirmar el identificador, la fecha, el cliente, los renglones y el total de la venta, SHALL limpiar el formulario para una nueva venta y SHALL mostrar un mensaje de resultado.

#### Scenario: Confirmación exitosa

- **WHEN** se confirma una venta con cliente y al menos un renglón con cantidad válida
- **THEN** la venta se agrega al historial con su identificador, fecha, cliente, renglones y total
- **AND** el formulario queda limpio y el borrador queda vacío
- **AND** se muestra un mensaje que identifica la venta confirmada y su total

### Requirement: Identificador y fecha visibles

El sistema SHALL mostrar cada venta con un identificador visible con la forma `V-0001` y con la fecha de confirmación en formato local `dd/mm/aaaa hh:mm`.

#### Scenario: Primera venta confirmada

- **WHEN** se confirma la primera venta
- **THEN** el historial muestra el identificador `V-0001`
- **AND** la fecha se muestra como día, mes, año y hora local con el formato `dd/mm/aaaa hh:mm`

### Requirement: Snapshot histórico al confirmar

El sistema SHALL copiar al renglón el título del libro, el precio unitario y el subtotal vigentes al momento de confirmar, y SHALL conservarlos como valores históricos de esa venta.

#### Scenario: Copia del precio y del título

- **WHEN** se confirma una venta con un libro de precio 1500
- **THEN** el renglón confirmado conserva el título del libro y el precio unitario 1500
- **AND** el subtotal y el total se calculan con ese precio copiado

#### Scenario: Cambio posterior del precio en el catálogo

- **WHEN** después de confirmar una venta se modifica el precio del libro en el catálogo
- **THEN** el detalle de la venta confirmada sigue mostrando el precio unitario, los subtotales y el total originales
- **AND** los importes del historial no se recalculan desde el catálogo

### Requirement: Historial de ventas confirmadas

El sistema SHALL listar las ventas confirmadas con identificador, fecha, cliente y total, y SHALL permitir consultar el detalle de los renglones de cada venta.

#### Scenario: Listado de ventas

- **WHEN** existe al menos una venta confirmada
- **THEN** el historial muestra una fila por venta con identificador, fecha, cliente y total

#### Scenario: Consulta del detalle

- **WHEN** se pulsa «Ver detalle» en una venta del historial
- **THEN** se muestran sus renglones con libro, cantidad, precio unitario y subtotal
- **AND** se muestra el total confirmado de esa venta

### Requirement: Historial vacío

El sistema SHALL mostrar un mensaje de lista vacía cuando no hay ventas confirmadas.

#### Scenario: Historial sin ventas

- **WHEN** se consulta el historial y no hay ventas confirmadas
- **THEN** la tabla no muestra filas y aparece el mensaje «Todavía no se confirmó ninguna venta.»

### Requirement: Ventas confirmadas inmutables

El sistema SHALL tratar las ventas confirmadas como inmutables desde la interfaz y MUST NOT ofrecer controles para editarlas, eliminarlas ni recalcular sus importes desde el catálogo.

#### Scenario: Solo acciones de consulta

- **WHEN** se consulta el historial de ventas confirmadas
- **THEN** la única acción disponible sobre cada venta es «Ver detalle»
- **AND** no existen controles para editar o eliminar la venta

### Requirement: Venta simulada sin stock ni facturación

El sistema SHALL registrar la venta como una operación simulada y MUST NOT modificar stock ni generar cobros o comprobantes fiscales; el total es solo un cálculo.

#### Scenario: Confirmación sin efectos de inventario ni fiscales

- **WHEN** se confirma una venta
- **THEN** el catálogo de libros conserva sus datos y precios
- **AND** no se genera ningún comprobante fiscal ni movimiento de stock
