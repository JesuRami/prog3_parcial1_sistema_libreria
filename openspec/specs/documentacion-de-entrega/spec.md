# documentacion-de-entrega Specification

## Purpose
Define el contrato del README de entrega: qué contenido mínimo debe incluir, cómo registra los resultados reales de los casos manuales sin declarar aprobado lo no ejecutado y cómo ubica y describe el almacenamiento para que el docente reproduzca la comprobación guiada del precio histórico.

## Requirements

### Requirement: Identificación de autores y apertura sin npm

El README SHALL identificar a las personas autoras del trabajo y SHALL explicar los pasos para abrir el proyecto en el navegador sin `npm`, indicando que `index.html` es el punto de entrada.

#### Scenario: Autores identificados

- **WHEN** se revisa el README de entrega
- **THEN** figuran el nombre y el legajo de cada integrante del trabajo
- **AND** no queda un texto de plantilla sin completar en ese apartado

#### Scenario: Pasos de apertura sin npm

- **WHEN** una persona sin el proyecto abierto sigue las instrucciones del README
- **THEN** encuentra los pasos para descargar o clonar el repositorio y abrir `index.html` con doble clic
- **AND** el README aclara que no hay que instalar dependencias ni ejecutar `npm` ni compilar

### Requirement: Navegación entre vistas

El README SHALL describir la navegación entre las vistas de la aplicación y qué muestra cada una.

#### Scenario: Vistas documentadas

- **WHEN** se revisa la sección de navegación del README
- **THEN** se nombran las cinco vistas (Catálogo, Libros, Clientes, Ventas e Historial)
- **AND** se indica cómo se accede a cada una desde el menú de la página

### Requirement: Funcionalidades implementadas y pendientes

El README SHALL enumerar las funcionalidades implementadas y las pendientes, sin declarar como hecha una funcionalidad que el código no ofrece.

#### Scenario: Alcance por ejercicio declarado

- **WHEN** se revisa la lista de funcionalidades del README
- **THEN** cada ejercicio de la consigna figura con su funcionalidad correspondiente
- **AND** las funcionalidades pendientes se declaran como tales o se indica expresamente que no hay pendientes

#### Scenario: Sin funcionalidades inventadas

- **WHEN** se contrasta una funcionalidad declarada como implementada con el código del repositorio
- **THEN** esa funcionalidad existe y es observable en la aplicación

### Requirement: Ubicación de los datos iniciales

El README SHALL indicar la ubicación de los datos iniciales en el proyecto y las cantidades iniciales de cada colección.

#### Scenario: Seed identificado

- **WHEN** se busca en el README dónde están los datos de ejemplo
- **THEN** se identifica el archivo `js/data/seed.js`
- **AND** se informan las cantidades iniciales de editoriales, géneros, autores, libros, clientes y ventas

### Requirement: Funcionamiento y límites de localStorage

El README SHALL explicar el funcionamiento y los límites de `localStorage`, incluyendo que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura y que no comparte información entre usuarios.

#### Scenario: Dependencia del navegador, perfil y ubicación

- **WHEN** se revisa la sección de almacenamiento del README
- **THEN** se explica que los datos quedan asociados al navegador, al perfil y a la ubicación desde donde se abre el proyecto
- **AND** se aclara que no se comparten entre usuarios ni entre navegadores distintos

#### Scenario: Límites operativos descritos

- **WHEN** se revisa la sección de límites del README
- **THEN** se explica que borrar los datos del sitio devuelve el proyecto al estado inicial
- **AND** se advierte que en modo privado o con el almacenamiento restringido los datos pueden perderse al cerrar

### Requirement: Resultados de los ocho casos manuales

El README SHALL registrar en una tabla los ocho casos manuales de la consigna con su resultado esperado y el resultado observado al ejecutarlos.

#### Scenario: Tabla completa de casos

- **WHEN** se revisa la tabla de casos manuales del README
- **THEN** figuran los ocho casos numerados del 1 al 8
- **AND** cada fila incluye el resultado esperado y el resultado observado

#### Scenario: Resultado observado concreto

- **WHEN** se revisa el resultado observado de un caso ejecutado
- **THEN** se describe el comportamiento real obtenido, con los valores o mensajes relevantes
- **AND** no se limita a una marca genérica sin evidencia

### Requirement: No declarar aprobado un caso sin ejecutarlo

El README SHALL registrar como pendiente todo caso no ejecutado o fallido, mostrando el comportamiento real, y MUST NOT indicar como aprobado ningún caso que no se haya ejecutado.

#### Scenario: Caso pendiente declarado

- **WHEN** un caso manual todavía no se ejecutó
- **THEN** su resultado observado se registra como pendiente de ejecución
- **AND** el README no lo cuenta entre los casos aprobados

#### Scenario: Caso fallido declarado

- **WHEN** un caso manual se ejecuta y falla
- **THEN** su resultado observado describe la falla o la funcionalidad pendiente
- **AND** el README no lo declara aprobado

### Requirement: Ubicación y estructura del almacenamiento documentadas

El README SHALL identificar la ubicación y la estructura del catálogo guardado, con las claves de `localStorage` y los campos relevantes de cada colección, para que la comprobación guiada sea reproducible.

#### Scenario: Claves y contenido documentados

- **WHEN** se revisa la sección de almacenamiento del README
- **THEN** se listan las claves `libreria.editoriales`, `libreria.generos`, `libreria.autores`, `libreria.libros`, `libreria.clientes` y `libreria.ventas` con el contenido de cada una
- **AND** se indica que el `precio` del libro vive dentro de `libreria.libros`

#### Scenario: Cómo inspeccionar el almacenamiento

- **WHEN** se sigue la indicación del README para ver los datos guardados
- **THEN** se llega a las herramientas de desarrollo del navegador, sección Application y Local Storage, sobre el origen del archivo abierto

### Requirement: Comprobación guiada del precio histórico

El README SHALL describir los pasos de la comprobación guiada del precio histórico: confirmar una venta, modificar solo el precio del libro en el catálogo guardado, recargar y verificar que el detalle conserva los importes confirmados.

#### Scenario: Pasos reproducibles

- **WHEN** el docente sigue los pasos del README en una copia de prueba
- **THEN** confirma una venta y anota subtotales y total
- **AND** modifica únicamente el `precio` del libro dentro de `libreria.libros` sin tocar `libreria.ventas`
- **AND** al recargar, el detalle de la venta conserva el precio unitario, los subtotales y el total confirmados

### Requirement: Procedencia de las imágenes

El README SHALL indicar la procedencia de las imágenes utilizadas y SHALL aclarar cuándo son propias y cuándo pertenecen a terceros.

#### Scenario: Imágenes locales informadas

- **WHEN** se revisa el apartado de imágenes del README
- **THEN** se identifica cada imagen local incluida en el proyecto
- **AND** se aclara si es propia o de terceros y, si es de terceros, se indica su procedencia

### Requirement: Entrega sin dependencias ni compilación

El README SHALL describir una entrega compuesta por `index.html`, los demás HTML si corresponden, las carpetas de CSS, JavaScript y recursos locales, y el propio `README.md`, sin dependencias instaladas ni herramientas de compilación.

#### Scenario: Entrega autocontenida

- **WHEN** se revisa la estructura de proyecto descrita en el README
- **THEN** se nombran `index.html`, los archivos de estilos y scripts locales, los recursos y el `README.md`
- **AND** se aclara que no existe `package.json`, `node_modules` ni paso de compilación
