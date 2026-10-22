# Spec Delta

## Purpose

Define el dataset local ficticio con identificadores estables que alimenta el sistema y el catálogo que se genera desde esos datos, incluida la búsqueda por título y los estados visibles que explican el resultado al operador.

## ADDED Requirements

### Requirement: Datos iniciales con identificadores estables

El sistema SHALL arrancar con un conjunto inicial ficticio de al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes definido en JavaScript, donde cada registro expone un identificador que no cambia entre recargas.

#### Scenario: Conjunto inicial mínimo disponible
- **WHEN** se abre la aplicación por primera vez
- **THEN** existen al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes

#### Scenario: Los identificadores se conservan
- **WHEN** se recarga la página sin haber dado de alta registros
- **THEN** cada editorial, género, autor, libro y cliente conserva el mismo identificador que tenía antes de recargar

### Requirement: Vínculos de cada libro con editorial y autores

Cada libro SHALL referenciar una editorial existente y al menos un autor existente del conjunto local.

#### Scenario: Editorial existente
- **WHEN** se inspecciona cualquier libro del conjunto inicial
- **THEN** su editorial corresponde a una editorial registrada en los datos locales

#### Scenario: Al menos un autor existente
- **WHEN** se inspecciona cualquier libro del conjunto inicial
- **THEN** tiene uno o más autores y todos corresponden a autores registrados en los datos locales

### Requirement: Género opcional del libro

El género de un libro SHALL ser opcional; cuando está asignado SHALL corresponder a un género existente y cuando falta se muestra la leyenda "Sin clasificar".

#### Scenario: Libro con género asignado
- **WHEN** un libro del conjunto inicial tiene género
- **THEN** ese género corresponde a un género registrado en los datos locales y se muestra su nombre en el catálogo

#### Scenario: Libro sin género
- **WHEN** un libro del conjunto inicial no tiene género asignado
- **THEN** el catálogo muestra "Sin clasificar" en el campo de género

### Requirement: Catálogo generado desde los datos locales

El catálogo SHALL construirse en el navegador a partir de la colección de libros en memoria, sin un listado de libros escrito en el HTML.

#### Scenario: Listado construido desde los datos
- **WHEN** se carga la vista de catálogo
- **THEN** las tarjetas de libros se generan a partir de la colección de libros y su cantidad coincide con los libros de esa colección

#### Scenario: HTML sin libros estáticos
- **WHEN** se revisa el marcado de la vista de catálogo antes de ejecutar JavaScript
- **THEN** el contenedor del listado no contiene libros de ejemplo escritos a mano

### Requirement: Campos visibles de cada libro del catálogo

Cada tarjeta del catálogo SHALL mostrar título, ISBN, editorial, género, autores y precio del libro.

#### Scenario: Libro completo visible
- **WHEN** el catálogo muestra un libro
- **THEN** la tarjeta incluye su título, ISBN, editorial, género, autores y precio

#### Scenario: Precio con dos decimales
- **WHEN** el catálogo muestra el precio de un libro
- **THEN** el importe se presenta con dos decimales

### Requirement: Coincidencia parcial del título sin distinguir mayúsculas

El filtro SHALL comparar la búsqueda con el título como subcadena e ignorar las diferencias entre mayúsculas y minúsculas.

#### Scenario: Parte del título
- **WHEN** se busca "jardín"
- **THEN** aparece "El Jardín de las Máquinas"

#### Scenario: Búsqueda en mayúsculas
- **WHEN** se busca "EL JARDIN"
- **THEN** aparece "El Jardín de las Máquinas"

### Requirement: Búsqueda insensible a tildes

El filtro SHALL ignorar las tildes tanto en el texto buscado como en el título, sin confundir la ñ con la n.

#### Scenario: Búsqueda sin tilde
- **WHEN** se busca "jardin"
- **THEN** aparece "El Jardín de las Máquinas"

#### Scenario: Búsqueda con tilde
- **WHEN** se busca "máquinas"
- **THEN** aparece "El Jardín de las Máquinas"

#### Scenario: La ñ se distingue de la n
- **WHEN** se busca "senor" sobre un título que contiene "señor"
- **THEN** ese título no se considera coincidencia

### Requirement: Espacios sobrantes en los extremos

El filtro SHALL eliminar los espacios sobrantes en los extremos del texto buscado antes de comparar.

#### Scenario: Búsqueda con espacios alrededor
- **WHEN** se busca "  el jardín  "
- **THEN** el resultado es el mismo que buscar "el jardín"

### Requirement: Búsqueda vacía muestra el catálogo completo

El sistema SHALL mostrar todos los libros registrados cuando la búsqueda queda vacía o contiene solo espacios.

#### Scenario: Búsqueda vacía
- **WHEN** el campo de búsqueda está vacío
- **THEN** el catálogo muestra todos los libros registrados

#### Scenario: Limpiar la búsqueda
- **WHEN** se limpia el campo de búsqueda con el control de limpieza
- **THEN** el catálogo vuelve a mostrar todos los libros registrados

#### Scenario: Búsqueda solo con espacios
- **WHEN** se busca un texto compuesto solo por espacios
- **THEN** el catálogo muestra todos los libros registrados

### Requirement: Mensaje cuando no hay resultados

El sistema SHALL mostrar un mensaje de texto claro cuando la búsqueda no coincide con ningún libro, en lugar de dejar el listado vacío sin explicación.

#### Scenario: Búsqueda sin coincidencias
- **WHEN** se busca un texto que no aparece en ningún título
- **THEN** el listado queda vacío y se muestra un mensaje que indica que no se encontraron libros para esa búsqueda

#### Scenario: El mensaje desaparece al haber coincidencias
- **WHEN** después de una búsqueda sin resultados se busca un texto que sí coincide
- **THEN** el mensaje de "sin resultados" deja de mostrarse

### Requirement: Mensaje cuando no hay libros registrados

El sistema SHALL distinguir el estado de catálogo sin libros del estado de búsqueda sin coincidencias mediante mensajes de texto diferentes.

#### Scenario: Catálogo sin libros
- **WHEN** la colección de libros está vacía
- **THEN** se muestra un mensaje que indica que no hay libros registrados y no se muestra el mensaje de "sin resultados"

### Requirement: Contador de resultados

El sistema SHALL informar por texto cuántos libros se muestran y, cuando hay una búsqueda activa, cuántos libros tiene el catálogo completo.

#### Scenario: Sin búsqueda activa
- **WHEN** el campo de búsqueda está vacío
- **THEN** el contador indica cuántos libros se muestran

#### Scenario: Con búsqueda activa
- **WHEN** hay un texto de búsqueda
- **THEN** el contador indica cuántos libros se muestran y cuántos libros tiene el catálogo completo

### Requirement: Actualización del catálogo al interactuar con la búsqueda

El sistema SHALL actualizar el catálogo al confirmar la búsqueda, al escribir en el campo y al limpiarlo, sin recargar la página.

#### Scenario: Confirmar la búsqueda
- **WHEN** se envía el formulario de búsqueda
- **THEN** el catálogo se actualiza sin recargar la página

#### Scenario: Escribir en el campo
- **WHEN** se escribe o se borra texto en el campo de búsqueda
- **THEN** el catálogo se actualiza con el valor actual del campo sin recargar la página

### Requirement: Texto de usuarios insertado como texto en el DOM

Todo dato proveniente de los registros SHALL insertarse como texto en el DOM y nunca interpretarse como HTML.

#### Scenario: Título con marcas de HTML
- **WHEN** un libro tiene un título que incluye etiquetas o marcas de HTML
- **THEN** el catálogo muestra esos caracteres de forma literal y no crea elementos a partir de ellos

### Requirement: Datos exclusivamente locales

El sistema SHALL obtener los datos del catálogo únicamente de las colecciones locales en memoria, sin peticiones de red ni dependencias externas.

#### Scenario: Apertura local sin red
- **WHEN** se abre `index.html` directamente en el navegador sin conexión
- **THEN** el catálogo se muestra con los datos locales

#### Scenario: Sin peticiones de datos
- **WHEN** se carga y se filtra el catálogo
- **THEN** no se realiza ninguna petición de red para obtener libros, editoriales, géneros o autores
