# Parcial 1: Librería con SDD, Programación III (UTN), 2pro1. Grupo Saferazi.

Aplicación de gestión de una librería hecha **únicamente con HTML, CSS y JavaScript nativos**,
sin librerías, frameworks, CDNs, compilación ni backend. Los datos viven en el navegador.

**Alumnos y legajos:**  
Lautaro Fernández, .  
Daniela Díaz, .  
Jesús Ramírez, 54010.  
Danilo Serrano, .  

**Docente:** Matías Torres.  

---

## Cómo abrir el proyecto (sin npm)

1. Descargar o clonar el repositorio en una carpeta local.
2. Abrir el archivo **`index.html`**. Y ya.


## Navegación entre vistas
Es una sola página con cinco vistas, todas enlazadas desde el menú superior:

| Vista | Qué muestra |
|-------|-------------|
| **Catálogo** (`#catalogo`) | Búsqueda por título y tarjetas con los libros registrados. Es la vista inicial. |
| **Libros** (`#libros`) | Alta de libro y listado de libros registrados. |
| **Clientes** (`#clientes`) | Alta de cliente y listado de clientes. |
| **Ventas** (`#ventas`) | Arma una venta simulada (cliente, libro y cantidad por renglón) y la confirma. |
| **Historial** (`#historial`) | Ventas confirmadas y detalle de una venta con sus importes históricos. |

La navegación funciona con enlaces de ancla (`#vista`) y CSS (`:target`): no requiere
JavaScript para cambiar de vista, y el foco de teclado acompaña el recorrido.

## Funcionalidades implementadas

- **Estructura y pantallas (Ejercicio 1):** HTML semántico con encabezado, navegación,
  contenido principal, secciones y pie; formularios con etiquetas asociadas; tablas con
  encabezados; mensajes para listas vacías, búsquedas sin resultados y operaciones
  correctas o rechazadas.
- **Presentación y uso adaptable (Ejercicio 2):** CSS en archivos externos con variables,
  Flexbox/Grid y media queries; sin desplazamiento horizontal de página a 320 px; las tablas
  se desplazan dentro de su propio contenedor; foco visible y navegación por teclado; los
  errores se comunican con texto además del color.
- **Datos locales, catálogo y filtro (Ejercicio 3):** datos iniciales en JavaScript con
  identificadores estables; catálogo generado desde esos datos; búsqueda por parte del título
  sin distinguir mayúsculas; los textos ingresados por el usuario se insertan como texto
  (`textContent`), nunca como HTML.
- **Alta de libros y clientes (Ejercicio 4):** validación de campos obligatorios, precio
  numérico mayor que cero, ISBN comparado sin espacios ni guiones (duplicados rechazados) y
  email válido y único sin distinguir mayúsculas. El libro dado de alta aparece en el catálogo
  y en el selector de venta; el cliente, en el listado y en el selector de venta.
- **Venta simulada e historial (Ejercicio 5):** renglones con libro y cantidad; rechazo de
  cantidades cero, negativas o decimales, de libros repetidos y de ventas sin cliente; el
  precio unitario se copia al renglón como valor histórico al confirmar, así el historial
  conserva los importes aunque cambie el catálogo.
- **Persistencia y verificación (Ejercicio 6):** estado guardado en `localStorage`; al
  reabrir se recuperan los datos sin duplicar los ejemplos iniciales ni las ventas.

Extras dentro de las reglas del proyecto (no exigidos por la consigna, sin dependencias):
búsqueda que además ignora tildes; alta de una editorial o un autor nuevos desde el formulario
de libro (se suman al conjunto local al guardar y quedan seleccionados), con aviso cuando el
nombre ya existe.

## Datos iniciales

Los datos de ejemplo están en **`js/data/seed.js`** (todo ficticio):

| Colección | Cantidad inicial |
|-----------|------------------|
| Editoriales | 2 |
| Géneros | 30 |
| Autores | 3 |
| Libros | 6 |
| Clientes | 3 |
| Ventas | 0 (se crean al confirmar) |

## Almacenamiento en `localStorage`

### Ubicación y estructura

Cada colección se guarda como un array JSON bajo su propia clave:

| Clave | Contenido |
|-------|-----------|
| `libreria.editoriales` | `Editorial[]` |
| `libreria.generos` | `Género[]` |
| `libreria.autores` | `Autor[]` |
| `libreria.libros` | `Libro[]` (cada uno con `precio`, `editorialId`, `generoId`, `autorIds`) |
| `libreria.clientes` | `Cliente[]` |
| `libreria.ventas` | `Venta[]` (cada venta con sus `renglones[]` y el `precioUnitario` histórico) |

Para inspeccionarlas: herramientas de desarrollo del navegador (F12) → **Application** →
**Local Storage** → el origen del archivo abierto.

### Funcionamiento

- **Semilla idempotente:** si una clave no existe, se escribe el seed; si ya existe, se lee y
  no se reescribe. Por eso al recargar no se duplican los ejemplos.
- **Escritura por colección:** cada alta o venta confirmada guarda la colección afectada.
- **Corrupción:** si el contenido guardado no es un JSON válido o no es una lista (array),
  esa colección se descarta y se vuelve a cargar el seed; la aplicación no se interrumpe.
- **Si el navegador no permite escribir** (modo privado, cuota llena o almacenamiento
  bloqueado), la aplicación sigue funcionando en memoria y lo avisa en pantalla.

### Límites

- El almacenamiento depende del **navegador, del perfil y de la ubicación** desde donde se abre
  el proyecto; no se comparte entre usuarios ni entre navegadores.
- Borrar los datos del sitio (o limpiar el almacenamiento) devuelve el proyecto a su estado
  inicial con los ejemplos.

### Comprobación guiada del precio histórico (para el docente)

1. Confirmar una venta y anotar subtotales y total.
2. En una copia de prueba del proyecto, con las herramientas del navegador, modificar
   **solo** el `precio` del libro dentro de `libreria.libros`, sin tocar `libreria.ventas`.
3. Recargar la página y abrir el detalle de la venta anterior: los importes siguen siendo los
   confirmados.

## Casos manuales

Resultado registrado según lo observado al ejecutar cada caso (los casos se corren abriendo
`index.html` en el navegador). **No se marca un caso como aprobado sin ejecutarlo.**

| # | Caso | Resultado esperado | Resultado observado |
|---|------|--------------------|---------------------|
| 1 | Búsqueda con parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | Aprobado: «MAQUINAS» encontró «El Jardín de las Máquinas» sin distinguir mayúsculas; la búsqueda vacía mostró el catálogo completo; un texto inexistente mostró el mensaje sin resultados |
| 2 | Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta | Aprobado: ISBN `978 950 0001 1` rechazado con «Ya existe un libro con ese ISBN.»; con ISBN nuevo se guardó y apareció en catálogo y selector de venta |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección | Aprobado: `ana@` rechazado por formato y `MARIA.GOMEZ@EJEMPLO.COM` rechazado como existente; el email nuevo se guardó y apareció en listado y selector |
| 4 | Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón | Aprobado: sin cliente y cantidades `0`, `-2` y `1.5` rechazadas; el libro repetido sumó la cantidad (2+3=5) sin crear otro renglón |
| 5 | Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial | Aprobado: subtotales 3000 y 2000, total 5000; el detalle del historial muestra ambos renglones, fecha e identificador |
| 6 | Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba | El historial conserva precio unitario, subtotales y total confirmados | Aprobado: tras cambiar el precio en `libreria.libros` y recargar, el historial conservó 1500, 3000 y 5000 |
| 7 | Recarga después de altas y venta | Se recuperan los datos sin duplicar ejemplos ni ventas | Aprobado: tras recargar se conservaron el libro y el cliente nuevos y la venta confirmada con su total; los ejemplos iniciales no se duplicaron (7 libros, 4 clientes, 1 venta) |
| 8 | Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita | Aprobado: recorrido completo con Tab (incluido «Saltar al contenido») con foco visible en todos los controles; a 320 px y a 1280 px no hubo desplazamiento horizontal de página y las tablas se desplazaron dentro de su contenedor |

> Si algún caso falla o queda pendiente, se reemplaza esta columna por el comportamiento real
> observado, sin declararlo aprobado.

## Imágenes

- `assets/img/logo.svg`: logotipo creado para este proyecto (SVG propio). No hay imágenes de
  terceros ni recursos externos; todas las imágenes son locales y están incluidas en el repo.

## Estructura del proyecto

```
index.html              Punto de entrada (única página, cinco vistas)
css/                    Estilos externos (base, layout, componentes)
js/data/seed.js         Datos iniciales ficticios
js/services/store.js    Estado en memoria; altas y ventas
js/services/persistencia.js  Lectura y escritura en localStorage
js/domain/              Reglas de negocio puras (catálogo, libros, clientes, ventas, texto)
js/ui/                  Render, formularios y venta (eventos de interfaz)
assets/img/logo.svg     Logotipo local
knowledge-base/         Base de conocimiento del dominio
docs/                   Consigna del parcial
```

## Restricciones respetadas

Solo HTML, CSS y JavaScript nativos; sin librerías, frameworks ni CDNs; sin `fetch`, API,
base de datos ni backend; sin inicio de sesión real; sin gestión de stock, cobros ni
facturación; sin edición ni eliminación de registros; datos solo en `localStorage`.
