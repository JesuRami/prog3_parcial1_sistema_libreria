# Spec Delta

## Purpose

Define el alta de libros y de clientes desde la interfaz: qué datos se exigen, cómo se validan contra los datos locales, cómo se informan los errores y cómo el registro aceptado queda disponible en el catálogo, los listados y los selectores de venta sin recargar la página.

## ADDED Requirements

### Requirement: Book form uses local data for its options

El formulario de alta de libro SHALL ofrecer título, ISBN, precio, editorial, género y autores; las editoriales y los autores sugeridos SHALL generarse desde los datos locales, y el selector de género SHALL incluir la opción "Sin clasificar".

#### Scenario: Form fields are available

- **WHEN** se abre la vista Libros
- **THEN** el formulario muestra los campos de título, ISBN, precio, editorial, género y autores, cada uno con su etiqueta asociada

#### Scenario: Registered editorials are suggested

- **WHEN** se abre la vista Libros con editoriales en los datos locales
- **THEN** el campo de editorial ofrece los nombres de las editoriales registradas como sugerencias, sin impedir escribir otro nombre

#### Scenario: Registered authors are offered as checkboxes

- **WHEN** se abre la vista Libros con autores en los datos locales
- **THEN** el grupo de autores muestra una casilla por autor registrado

#### Scenario: Genre can be left unclassified

- **WHEN** se abre el selector de género
- **THEN** la primera opción es "Sin clasificar", que representa la ausencia de género

### Requirement: Book title is required

El alta de libro SHALL rechazar un título vacío o compuesto solo por espacios; si el título tiene espacios exteriores, SHALL guardarlo sin ellos.

#### Scenario: Empty title is rejected

- **WHEN** se envía el formulario de libro con el título vacío
- **THEN** no se agrega el libro y se muestra un mensaje de texto junto al campo de título

#### Scenario: Title is trimmed

- **WHEN** se envía un libro válido con el título "  El Jardín  "
- **THEN** el libro se guarda con el título "El Jardín"

### Requirement: ISBN is required and unique

El alta de libro SHALL rechazar un ISBN vacío y uno ya registrado, comparando el ISBN sin espacios ni guiones y sin validar su dígito de control.

#### Scenario: Empty ISBN is rejected

- **WHEN** se envía el formulario de libro con el ISBN vacío
- **THEN** no se agrega el libro y se muestra un mensaje de texto junto al campo de ISBN

#### Scenario: Duplicate ISBN with different separators is rejected

- **WHEN** el catálogo contiene el ISBN "978-950-0001-1" y se intenta registrar "978 950 0001 1"
- **THEN** no se agrega el libro y se informa que ya existe un libro con ese ISBN

#### Scenario: Unregistered ISBN without a valid check digit is accepted

- **WHEN** se envía un libro válido con un ISBN no registrado cuyo dígito de control no corresponde
- **THEN** el libro se guarda, porque el alta no valida el dígito de control

### Requirement: Book price must be a positive number

El alta de libro SHALL exigir un precio numérico mayor que cero, aceptando coma o punto como separador decimal.

#### Scenario: Non-numeric price is rejected

- **WHEN** se envía el formulario de libro con el precio "mil quinientos"
- **THEN** no se agrega el libro y se muestra un mensaje de texto que explica que el precio debe ser un número

#### Scenario: Zero or negative price is rejected

- **WHEN** se envía el formulario de libro con el precio "0" o "-5"
- **THEN** no se agrega el libro y se informa que el precio debe ser mayor que cero

#### Scenario: Comma or point decimal separator is accepted

- **WHEN** se envía un libro válido con el precio "1500,50" y otro con "1500.50"
- **THEN** ambos libros se guardan con el precio numérico 1500.5

### Requirement: Book editorial is required and accepts free text

El alta de libro SHALL exigir una editorial y SHALL aceptar un nombre registrado o uno nuevo; la comparación de nombres SHALL ignorar mayúsculas, tildes y espacios repetidos, y SHALL usar la editorial existente cuando coincida sin duplicarla.

#### Scenario: Empty editorial is rejected

- **WHEN** se envía el formulario de libro con la editorial vacía
- **THEN** no se agrega el libro y se muestra un mensaje de texto junto al campo de editorial

#### Scenario: Existing editorial is matched ignoring case and accents

- **WHEN** el conjunto local contiene "Editorial Astral" y se envía el libro con "editorial ástral"
- **THEN** el libro se guarda relacionado con "Editorial Astral" y no se crea otra editorial

#### Scenario: New editorial is added when saving the book

- **WHEN** se envía un libro válido con la editorial "Editorial Sur", que no está registrada
- **THEN** el libro se guarda, "Editorial Sur" se suma al conjunto local y queda disponible en las sugerencias de editorial

#### Scenario: Repeated spaces do not create a duplicate editorial

- **WHEN** se envía una editorial equivalente a una registrada pero con espacios repetidos entre palabras
- **THEN** se reutiliza la editorial registrada y el conjunto local no incorpora un duplicado

### Requirement: Book genre is optional but must exist when chosen

El alta de libro SHALL permitir guardar sin género y SHALL rechazar un género que no pertenezca a los datos locales.

#### Scenario: Book without genre is saved as unclassified

- **WHEN** se envía un libro válido con el género en "Sin clasificar"
- **THEN** el libro se guarda sin género y el catálogo lo muestra como "Sin clasificar"

#### Scenario: Unknown genre is rejected

- **WHEN** se envía el formulario de libro con un género que no existe en los datos locales
- **THEN** no se agrega el libro y se muestra un mensaje de texto junto al campo de género

### Requirement: Book requires at least one existing author

El alta de libro SHALL exigir al menos un autor seleccionado y SHALL rechazar un autor que no pertenezca a los datos locales.

#### Scenario: No author selected is rejected

- **WHEN** se envía un formulario de libro válido sin ninguna casilla de autor marcada
- **THEN** no se agrega el libro y se muestra un mensaje de texto en el grupo de autores

#### Scenario: Unknown author is rejected

- **WHEN** se envía el formulario de libro con la identificación de un autor inexistente
- **THEN** no se agrega el libro y se informa que alguno de los autores elegidos no existe

#### Scenario: Multiple existing authors are accepted

- **WHEN** se envía un libro válido con dos autores registrados marcados
- **THEN** el libro se guarda con ambos autores y el catálogo muestra sus nombres separados por coma

### Requirement: New author can be added from the book form

El formulario de libro SHALL permitir agregar un autor nuevo por su nombre; la comparación SHALL ignorar mayúsculas, tildes y espacios repetidos, SHALL avisar sin duplicar si el autor ya existe, y SHALL sumar y marcar el autor nuevo cuando no existe.

#### Scenario: New author is added and selected

- **WHEN** se escribe el nombre de un autor no registrado y se activa "Agregar"
- **THEN** el autor se suma al conjunto local, aparece marcado en las casillas y queda disponible en las sugerencias de autores

#### Scenario: Existing author is not duplicated

- **WHEN** se escribe "nicolas ferrari" y el conjunto local ya contiene "Nicolás Ferrari"
- **THEN** se avisa que ese autor ya está en la lista, no se agrega otro registro y se indica marcarlo en las casillas

#### Scenario: Empty new author is rejected

- **WHEN** se activa "Agregar" con el campo de autor nuevo vacío o solo con espacios
- **THEN** se muestra un mensaje de texto y no se modifica el conjunto de autores

### Requirement: Book errors are reported and block the save

Cuando el alta de libro tiene errores, el sistema SHALL mostrar un mensaje de texto por cada campo inválido y un resumen de errores, SHALL marcar los controles inválidos y SHALL no agregar el registro.

#### Scenario: All field errors are listed

- **WHEN** se envía un formulario de libro con título vacío y precio inválido
- **THEN** se muestran ambos mensajes junto a sus campos, el resumen enumera los dos errores y el libro no se agrega

#### Scenario: First invalid control receives focus

- **WHEN** el formulario de libro se rechaza por errores de validación
- **THEN** el foco pasa al primer control inválido y el resultado informa que el libro no se guardó

#### Scenario: Error messages do not rely on color

- **WHEN** se rechaza un alta de libro
- **THEN** cada error se comunica con texto visible, además del estilo visual

### Requirement: Successful book registration updates the interface

Un libro válido SHALL guardarse con un identificador numérico consecutivo al mayor existente y estable, y tras el alta SHALL aparecer en el catálogo, en el listado de libros y en el selector de libro de la venta sin recargar la página.

#### Scenario: New book appears in catalog, list and sale selector

- **WHEN** se guarda un libro válido
- **THEN** el libro aparece en el catálogo, en la tabla de libros registrados y en el selector de libro de la venta, sin recargar la página

#### Scenario: Identifier follows the highest existing one

- **WHEN** el mayor identificador de libro registrado es 6 y se guarda un libro válido
- **THEN** el libro nuevo recibe el identificador 7 y ese identificador no cambia en las actualizaciones posteriores de la vista

#### Scenario: Form is cleared and success is announced

- **WHEN** se guarda un libro válido
- **THEN** el formulario queda limpio, el foco vuelve al campo de título y se muestra un mensaje de resultado con el título guardado

#### Scenario: New editorial is announced in the result

- **WHEN** se guarda un libro con una editorial nueva
- **THEN** el mensaje de resultado informa que el libro se guardó e indica el nombre de la editorial agregada

### Requirement: Client form requires full name and email

El formulario de alta de cliente SHALL pedir nombre completo y email, sin campo separado de apellido, y SHALL rechazar un nombre completo vacío o compuesto solo por espacios.

#### Scenario: Form has full name and email only

- **WHEN** se abre la vista Clientes
- **THEN** el formulario muestra los campos "Nombre completo" y "Email", cada uno con su etiqueta, y no muestra un campo de apellido

#### Scenario: Empty full name is rejected

- **WHEN** se envía el formulario de cliente con el nombre completo vacío
- **THEN** no se agrega el cliente y se muestra un mensaje de texto junto al campo de nombre

#### Scenario: Full name is trimmed

- **WHEN** se envía un cliente válido con el nombre "  Ana Pérez  "
- **THEN** el cliente se guarda con el nombre completo "Ana Pérez"

### Requirement: Client email must have a valid format

El alta de cliente SHALL rechazar un email vacío o con un formato inválido, entendido como texto sin espacios con la forma algo@dominio.ext.

#### Scenario: Empty email is rejected

- **WHEN** se envía el formulario de cliente con el email vacío
- **THEN** no se agrega el cliente y se muestra un mensaje de texto junto al campo de email

#### Scenario: Email without domain extension is rejected

- **WHEN** se envía un cliente con el email "ana@libreria"
- **THEN** no se agrega el cliente y se informa que el email no tiene un formato válido

#### Scenario: Well-formed email is accepted

- **WHEN** se envía un cliente válido con el email "ana.perez@ejemplo.com"
- **THEN** el cliente se guarda como nuevo registro

### Requirement: Client email is unique

El alta de cliente SHALL rechazar un email ya registrado, comparándolo sin espacios exteriores y sin distinguir mayúsculas de minúsculas.

#### Scenario: Email repeated with different case is rejected

- **WHEN** existe el cliente con email "ana@ejemplo.com" y se intenta registrar " Ana@Ejemplo.com "
- **THEN** no se agrega el cliente y se informa que ya existe un cliente con ese email

#### Scenario: Different email is accepted

- **WHEN** se envía un cliente válido con un email no registrado
- **THEN** el cliente se agrega al conjunto local

### Requirement: Client errors are reported and block the save

Cuando el alta de cliente tiene errores, el sistema SHALL mostrar un mensaje de texto por cada campo inválido y un resumen de errores, SHALL marcar los controles inválidos y SHALL no agregar el registro.

#### Scenario: Invalid email is reported without saving

- **WHEN** se envía el formulario de cliente con un email inválido
- **THEN** se muestra el mensaje junto al campo, el resumen enumera el error y el cliente no se agrega

#### Scenario: First invalid control receives focus

- **WHEN** el formulario de cliente se rechaza por errores de validación
- **THEN** el foco pasa al primer control inválido y el resultado informa que el cliente no se guardó

### Requirement: Successful client registration updates the interface

Un cliente válido SHALL guardarse con un identificador numérico consecutivo al mayor existente y estable, y tras el alta SHALL aparecer en el listado de clientes y en el selector de cliente de la venta sin recargar la página.

#### Scenario: New client appears in list and sale selector

- **WHEN** se guarda un cliente válido
- **THEN** el cliente aparece en la tabla de clientes registrados y en el selector de cliente de la venta, sin recargar la página

#### Scenario: Identifier follows the highest existing one

- **WHEN** el mayor identificador de cliente registrado es 3 y se guarda un cliente válido
- **THEN** el cliente nuevo recibe el identificador 4 y ese identificador no cambia en las actualizaciones posteriores de la vista

#### Scenario: Form is cleared and success is announced

- **WHEN** se guarda un cliente válido
- **THEN** el formulario queda limpio, el foco vuelve al campo de nombre completo y se muestra un mensaje de resultado con el nombre guardado

### Requirement: Books and clients are not edited or deleted

La interfaz SHALL NOT ofrecer acciones para editar ni eliminar libros o clientes registrados.

#### Scenario: Lists expose no edit or delete actions

- **WHEN** se revisan el listado de libros y el listado de clientes
- **THEN** cada fila solo muestra los datos del registro y no hay controles de edición ni de eliminación
