# presentacion-adaptable Specification

## Purpose
Define la presentación visual coherente y adaptable del sistema de librería: identidad con tokens, composición con Flexbox y Grid, clases reutilizables y accesibilidad básica verificada en los anchos de 320 px y 1280 px.

## Requirements

### Requirement: Estilos externos incluidos en el proyecto
El sistema SHALL cargar todos los estilos desde archivos CSS externos incluidos en el repositorio. El HTML MUST NOT contener bloques `<style>` ni atributos `style`, y las hojas MUST NOT referenciar recursos remotos, CDNs ni dependencias de terceros.

#### Scenario: HTML sin estilos embebidos
- **WHEN** se inspecciona el encabezado de `index.html`
- **THEN** solo aparecen enlaces a hojas de estilo locales de la carpeta `css/`, sin bloques `<style>` ni atributos `style`

#### Scenario: Hojas sin recursos externos
- **WHEN** se revisan los archivos de `css/`
- **THEN** no hay `@import`, ni `url()` que apunten a dominios externos, ni referencias a librerías o frameworks

### Requirement: Identidad visual mediante custom properties
El sistema SHALL definir color, familias tipográficas, escala de espaciado y radio de borde como custom properties reutilizables, y SHALL aplicarlas de forma consistente en encabezado, navegación, tarjetas, formularios, botones, mensajes y tablas.

#### Scenario: Tokens declarados
- **WHEN** se inspecciona la hoja base de estilos
- **THEN** el selector raíz declara custom properties para color, fuente de títulos, fuente de texto, espaciados y radio

#### Scenario: Cambio de token propagado
- **WHEN** se modifica el valor de un token de color en el selector raíz
- **THEN** los elementos que lo consumen adoptan el nuevo valor sin editar las reglas de los componentes

### Requirement: Clases reutilizables para elementos equivalentes
El sistema SHALL reutilizar una misma clase para elementos equivalentes entre vistas —tarjetas, campos, botones, mensajes, tablas y barras de acciones— en lugar de duplicar reglas por pantalla.

#### Scenario: Misma clase en las cinco vistas
- **WHEN** se comparan los formularios y listados de Catálogo, Libros, Clientes, Ventas e Historial
- **THEN** los elementos equivalentes comparten las mismas clases de tarjeta, campo, botón, mensaje o tabla

### Requirement: Composición con Flexbox y Grid
El sistema SHALL organizar el contenido con Flexbox en encabezado, menú, barras de acciones y formularios, y con Grid en la grilla de tarjetas, la lista de datos y la disposición dividida de formulario y listado.

#### Scenario: Contenedores declaran Flexbox o Grid
- **WHEN** se inspeccionan las hojas de presentación
- **THEN** encabezado, menú, acciones y formulario usan `display: flex`, y grilla, datos y disposición dividida usan `display: grid`

#### Scenario: Dos columnas en pantalla ancha
- **WHEN** la ventana alcanza el ancho de escritorio definido por la media query
- **THEN** las vistas Libros y Clientes muestran el formulario y el listado uno al lado del otro

### Requirement: Sin desplazamiento horizontal de página a 320 px
El sistema SHALL mantener todo el contenido dentro de un ancho de 320 px sin desplazamiento horizontal de la página completa, con textos y controles legibles y utilizables.

#### Scenario: Recorrido de las cinco vistas a 320 px
- **WHEN** se abre `index.html` con un ancho de 320 px y se visitan Catálogo, Libros, Clientes, Ventas e Historial
- **THEN** la página no presenta desplazamiento horizontal y los textos y controles se leen y se usan completos, con controles de altura utilizable

### Requirement: Sin desplazamiento horizontal de página a 1280 px
El sistema SHALL limitar el ancho del contenido principal, centrarlo y ampliar tipografía y espaciado en pantallas anchas, sin provocar desplazamiento horizontal de la página a 1280 px.

#### Scenario: Recorrido de las cinco vistas a 1280 px
- **WHEN** se abre `index.html` con un ancho de 1280 px y se visitan las cinco vistas
- **THEN** la página no presenta desplazamiento horizontal y el contenido se muestra centrado con su ancho máximo

### Requirement: Tablas con desplazamiento dentro de su contenedor
El sistema SHALL contener cada tabla ancha en un contenedor con desplazamiento horizontal propio. Una tabla MUST NOT ensanchar la página.

#### Scenario: Tabla ancha a 320 px
- **WHEN** se abre Libros, Clientes, Ventas o Historial con un ancho de 320 px y la tabla excede el espacio disponible
- **THEN** la tabla se desplaza dentro de su contenedor y la página no se desplaza horizontalmente

#### Scenario: Aviso de desplazamiento propio
- **WHEN** el contenido de una tabla supera el ancho del contenedor
- **THEN** aparece una barra de desplazamiento horizontal dentro del contenedor de la tabla

### Requirement: Contenedores de tabla accesibles por teclado
El sistema SHALL hacer alcanzables con el teclado los contenedores de tabla con desplazamiento propio, exponerlos como regiones con nombre accesible y conservar en ellos el foco visible.

#### Scenario: Foco en un contenedor desplazable
- **WHEN** se recorre la vista con Tab hasta un contenedor de tabla desplazable
- **THEN** el contenedor recibe el foco, muestra el contorno visible y anuncia su nombre accesible como región

#### Scenario: Desplazamiento con teclado
- **WHEN** un contenedor de tabla desplazable tiene el foco y su contenido excede el ancho
- **THEN** las teclas de desplazamiento mueven el contenido dentro del contenedor sin mover la página

### Requirement: Foco visible y recorrido por teclado
El sistema SHALL conservar un foco visible en todos los controles interactivos y MUST NOT eliminar ni ocultar el contorno de foco. El recorrido con Tab SHALL alcanzar el enlace de salto, el menú, los formularios, los botones, los enlaces y los contenedores desplazables.

#### Scenario: Foco visible en cada control
- **WHEN** se recorre la interfaz con la tecla Tab desde el inicio del documento
- **THEN** cada control enfocado muestra un contorno visible de alto contraste

#### Scenario: Enlace de salto al contenido
- **WHEN** se enfoca con Tab el primer enlace de la página
- **THEN** aparece el enlace «Saltar al contenido» y al activarlo el foco pasa al contenido principal

### Requirement: Errores comunicados con texto además del color
El sistema SHALL comunicar los mensajes de error con texto —mensaje escrito y prefijo textual— además de cualquier diferencia de color, y MUST NOT depender únicamente del color.

#### Scenario: Error legible sin distinguir colores
- **WHEN** una validación rechaza una operación y se muestra el mensaje de error
- **THEN** el mensaje incluye texto explicativo y un prefijo textual, y sigue siendo comprensible en una vista sin color

#### Scenario: Campo marcado como inválido
- **WHEN** un campo falla una validación
- **THEN** además del color, el campo muestra un estilo de borde diferenciado y un mensaje de texto asociado junto al campo

### Requirement: Imágenes con texto alternativo adecuado
El sistema SHALL proporcionar texto alternativo a las imágenes informativas y MUST usar texto alternativo vacío en las decorativas, sin repetir información ya presente como texto.

#### Scenario: Logotipo decorativo del encabezado
- **WHEN** se inspecciona el encabezado
- **THEN** el logotipo se marca como decorativo y el nombre «Librería Lomo» se lee como texto visible, sin repetición en el texto alternativo

#### Scenario: Imágenes informativas
- **WHEN** se agrega una imagen que aporta información
- **THEN** la imagen incluye un texto alternativo que describe su contenido

### Requirement: Respeto por la preferencia de movimiento reducido
El sistema SHALL desactivar transiciones, animaciones y desplazamiento suave cuando el usuario configura la preferencia de movimiento reducido.

#### Scenario: Movimiento reducido activo
- **WHEN** el sistema operativo informa preferencia por movimiento reducido
- **THEN** la interfaz no aplica transiciones, animaciones ni desplazamiento suave
