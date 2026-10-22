# Spec Delta

## Purpose

Define el comportamiento observable del almacenamiento local de la aplicación: qué colecciones se guardan y con qué estructura, cómo se siembran sin duplicar los ejemplos, cómo se recuperan al recargar y cómo responde el sistema ante contenido corrupto o almacenamiento no disponible.

## ADDED Requirements

### Requirement: Claves de almacenamiento por colección

El sistema SHALL persistir cada colección como un array JSON bajo su propia clave de `localStorage`, con el prefijo `libreria.` y las claves `libreria.editoriales`, `libreria.generos`, `libreria.autores`, `libreria.libros`, `libreria.clientes` y `libreria.ventas`.

#### Scenario: Seis claves tras el primer arranque

- **WHEN** se abre la aplicación por primera vez en un navegador con `localStorage` disponible
- **THEN** existen las seis claves `libreria.editoriales`, `libreria.generos`, `libreria.autores`, `libreria.libros`, `libreria.clientes` y `libreria.ventas`
- **AND** el valor de cada clave es un JSON válido que representa un array

#### Scenario: Colección vacía persistida

- **WHEN** se inspecciona `libreria.ventas` en un arranque sin ventas confirmadas
- **THEN** la clave existe y contiene un array vacío `[]`, no un valor ausente

### Requirement: Estructura del catálogo guardado

El sistema SHALL guardar cada libro con `id`, `titulo`, `isbn`, `precio`, `editorialId`, `generoId` y `autorIds`, de modo que el precio del catálogo pueda identificarse dentro de `libreria.libros` sin ambigüedad.

#### Scenario: Precio del libro localizable

- **WHEN** se inspecciona el array guardado en `libreria.libros`
- **THEN** cada elemento expone su `precio` numérico junto a `editorialId`, `generoId` y `autorIds`
- **AND** el título permite identificar el libro modificado en una prueba guiada

#### Scenario: Ventas con importes históricos guardados

- **WHEN** se inspecciona el array guardado en `libreria.ventas`
- **THEN** cada venta contiene `id`, `fecha`, `clienteId`, `clienteNombre`, `renglones` y `total`
- **AND** cada renglón conserva su `precioUnitario` y su `subtotal` confirmados

### Requirement: Semilla idempotente sin duplicar ejemplos

En el primer inicio, cuando la clave de una colección no existe, el sistema SHALL escribir el seed de esa colección; cuando la clave ya existe, SHALL leer lo guardado y MUST NOT reescribir el seed.

#### Scenario: Primer inicio siembra los ejemplos

- **WHEN** se abre la aplicación con el almacenamiento vacío para el origen
- **THEN** cada colección se guarda con los datos de ejemplo y las ventas con un array vacío

#### Scenario: Recarga sin duplicar

- **WHEN** se recarga la página sin haber dado de alta ni confirmado nada
- **THEN** la cantidad de libros, editoriales, géneros, autores y clientes es la misma que antes de recargar
- **AND** no aparecen registros de ejemplo repetidos

### Requirement: Recuperación tras recarga

El sistema SHALL recuperar de `localStorage` las colecciones guardadas al abrir o recargar la aplicación, conservando las altas y las ventas confirmadas con sus identificadores y sin duplicar los datos iniciales.

#### Scenario: Alta de libro conservada

- **WHEN** se da de alta un libro con ISBN nuevo y luego se recarga la página
- **THEN** el libro sigue en el catálogo y en el listado de libros registrados
- **AND** conserva el mismo identificador que tenía antes de recargar

#### Scenario: Alta de cliente conservada

- **WHEN** se da de alta un cliente con email nuevo y luego se recarga la página
- **THEN** el cliente sigue en el listado y en el selector de cliente de la venta
- **AND** conserva el mismo identificador que tenía antes de recargar

#### Scenario: Venta confirmada conservada

- **WHEN** se confirma una venta y luego se recarga la página
- **THEN** la venta aparece en el historial con su identificador, fecha, cliente y total
- **AND** su detalle conserva los renglones y los importes confirmados
- **AND** no aparece una segunda venta duplicada

### Requirement: Persistencia de editoriales y autores creados en runtime

El sistema SHALL persistir editoriales y autores además de libros, clientes y ventas, para que un libro guardado conserve sus referencias cuando la editorial o el autor se crearon desde el formulario de alta.

#### Scenario: Editorial nueva referenciada tras recargar

- **WHEN** se da de alta un libro indicando una editorial nueva y luego se recarga la página
- **THEN** la editorial aparece en el conjunto local y el libro guardado la sigue referenciando por su identificador

#### Scenario: Autor nuevo referenciado tras recargar

- **WHEN** se da de alta un libro con un autor nuevo y luego se recarga la página
- **THEN** el autor aparece en el conjunto local y el libro guardado lo sigue referenciando en `autorIds`

### Requirement: Recuperación ante contenido corrupto

Cuando el contenido guardado de una colección no es JSON válido o no es un array, el sistema SHALL descartar esa colección, volver a cargar su seed y continuar el arranque sin bloquear la aplicación.

#### Scenario: JSON inválido en una colección

- **WHEN** `libreria.libros` contiene un texto que no es JSON válido y se abre la aplicación
- **THEN** la aplicación arranca y el catálogo muestra los libros del seed
- **AND** el resto de las colecciones guardadas se conserva

#### Scenario: Valor que no es un array

- **WHEN** `libreria.clientes` contiene un objeto JSON en lugar de un array y se abre la aplicación
- **THEN** la aplicación arranca y el listado de clientes muestra los clientes del seed
- **AND** el arranque no se interrumpe ni muestra un error bloqueante

### Requirement: Tolerancia a fallos de escritura

Cuando el navegador no permite escribir en `localStorage` por cuota llena, modo privado o almacenamiento bloqueado, el sistema SHALL continuar operando en memoria y MUST NOT interrumpir la operación iniciada por el usuario.

#### Scenario: Alta con escritura rechazada

- **WHEN** el almacenamiento rechaza la escritura y se da de alta un libro válido
- **THEN** el libro aparece en el catálogo y en el listado de libros registrados durante la sesión
- **AND** la aplicación no muestra un error bloqueante ni pierde el estado en memoria

#### Scenario: Datos no recuperados si no se pudo escribir

- **WHEN** el almacenamiento rechazó las escrituras y se recarga la página
- **THEN** la aplicación arranca con los datos que sí pudo guardar o con el seed
- **AND** no se presenta como error de la aplicación

### Requirement: Aviso del estado del almacenamiento

El sistema SHALL mostrar en la interfaz un aviso en texto que indique si los datos se conservan en este navegador o si se pierden al recargar; el aviso MUST NOT depender únicamente del color.

#### Scenario: Almacenamiento disponible

- **WHEN** el navegador permite leer y escribir en `localStorage`
- **THEN** el aviso indica que los datos de ejemplo se cargan la primera vez y que lo agregado se conserva al recargar

#### Scenario: Almacenamiento no disponible

- **WHEN** el navegador bloquea o rechaza el acceso a `localStorage`
- **THEN** el aviso indica que no se pueden guardar datos y que lo nuevo se pierde al recargar
- **AND** el aviso se expresa con texto legible, no solo con un color

### Requirement: Contenido ficticio sin datos sensibles

El contenido persistido SHALL ser ficticio y de práctica; MUST NOT incluir credenciales, secretos ni datos personales reales.

#### Scenario: Revisión de las colecciones guardadas

- **WHEN** se inspeccionan las seis claves de `localStorage`
- **THEN** los nombres, correos, títulos e importes son ficticios
- **AND** no hay contraseñas, tokens ni credenciales almacenadas

### Requirement: Independencia entre navegadores, perfiles y ubicaciones

El almacenamiento SHALL quedar acotado al navegador, al perfil y a la ubicación desde donde se abre el proyecto, y MUST NOT compartirse entre usuarios, navegadores o perfiles distintos.

#### Scenario: Otro navegador no ve los datos guardados

- **WHEN** se abre el proyecto en un navegador distinto del que ya tenía datos guardados
- **THEN** la aplicación arranca con los datos iniciales y no con las altas del otro navegador

#### Scenario: Limpiar los datos del sitio devuelve al estado inicial

- **WHEN** se borran los datos de sitio del origen del proyecto y se recarga la página
- **THEN** las seis colecciones vuelven a sembrarse con los datos de ejemplo y sin ventas
