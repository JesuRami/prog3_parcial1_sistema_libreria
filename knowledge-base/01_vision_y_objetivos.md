# Visión y Objetivos

## Propósito del sistema

Sistema web de una librería que **presenta su catálogo** y **registra libros, clientes y ventas**, con todos los datos y las operaciones simulados íntegramente en el navegador.

El proyecto es el frontend de un Trabajo Práctico Integrador (TPI) de la unidad *HTML, CSS y JavaScript* de Programación III (Tecnicatura Universitaria en Programación a Distancia). El TP backend de la misma materia —a cargo de otro docente— se toma **solo como contexto**: esta consigna desarrolla exclusivamente el frontend, sin API, sin base de datos, sin servidor y sin conexión con el backend.

La consigna es extremadamente prescriptiva: define el alcance completo (5 vistas, ~15 reglas de negocio explícitas, validaciones, requisitos responsive y de accesibilidad, modelo de persistencia y 7 casos de prueba manuales obligatorios). En consecuencia, esta base de conocimiento se **ingiere** desde ese documento y no requiere definición adicional de producto: todo lo que el documento no dice queda registrado en `10_preguntas_abiertas.md` como supuesto explícito, nunca como hecho inventado.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|-------|--------------------|----------------------|
| **Operador de la librería** (único usuario de la interfaz) | Registrar la operatoria del negocio: catálogo, libros, clientes y ventas, en una sola interfaz navegable | Filtrar el catálogo por título con coincidencia parcial e insensible a mayúsculas · Dar de alta libros con editorial, género y autores · Dar de alta clientes con email único · Componer una venta por renglones y confirmar un total simulado · Revisar el historial y el detalle de cada venta con precios históricos |
| **Equipo de desarrollo** (estudiantes de Programación III) | Demostrar dominio de HTML semántico, CSS propio y JavaScript nativo | Separar estructura, estilos y comportamiento · Implementar validaciones de entrada · Usar funciones acotadas y nombres comprensibles · Dejar el sistema funcionando sin dependencias instaladas ni herramientas de compilación |
| **Docente revisor** (Prof. Matías Torres) | Evaluar el resultado observable contra una rúbrica cerrada de 100 puntos | Verificar la correspondencia entre interfaz, datos y documentación · Ejecutar la comprobación guiada del precio histórico sobre una copia del proyecto con datos de prueba · Contrastar los 7 casos manuales registrados en el README |

> El **Cliente** del dominio (quien compra en la librería) es una *entidad de datos*, no un actor del sistema: no accede a la interfaz ni tiene permisos. Ver `03_actores_y_roles.md`.

## Alcance v1.0

El alcance corresponde al **TPI completo** (etapa 2 según la organización del trabajo de la consigna).

### Estructura y navegación (Ejercicio 1 — 20 pts)
- `index.html` como punto de entrada único del proyecto.
- Cinco vistas navegables de forma clara:
  - **Catálogo**: título de la librería, buscador por título y listado de libros.
  - **Libros**: formulario de alta y listado de libros registrados.
  - **Clientes**: formulario de alta y listado de clientes registrados.
  - **Ventas**: selección de cliente, composición de renglones y resumen de la venta.
  - **Historial**: listado de ventas y acceso a sus detalles.
- Estructura semántica con encabezado, navegación y contenido principal.
- Cada campo con etiqueta asociada; botones con texto que describe su acción; tablas con encabezados.
- Mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.

### Presentación y adaptación (Ejercicio 2 — 20 pts)
- Identidad visual propia y coherente: colores, tipografía, espaciado, tarjetas, formularios y botones.
- CSS en archivos externos, con clases reutilizadas para elementos equivalentes.
- Organización con Flexbox o Grid.
- Comprobación de la interfaz a **320 px** y a **1280 px**: textos y controles legibles, sin desplazamiento horizontal de la página; las tablas anchas se desplazan dentro de su propio contenedor.
- Accesibilidad básica: foco visible, recorrido por teclado, errores expresados con texto (no solo con color) y texto alternativo en imágenes informativas.

### Datos locales, catálogo y filtro (Ejercicio 3 — 15 pts)
- Libros, editoriales, géneros, autores y clientes representados con arrays y objetos de **identificadores estables**.
- Colección inicial: **≥ 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes** ficticios.
- Catálogo generado por JavaScript a partir del array de libros.
- Filtro por título: insensible a mayúsculas/minúsculas, con coincidencias parciales y recorte de espacios sobrantes.

### Altas (Ejercicio 4 — 15 pts)
- Alta de **libros** con título, ISBN, precio y relaciones con editorial, género y autores; selectores generados desde los datos locales; opción de género «Sin clasificar».
- Alta de **clientes** con nombre completo y email.
- Validación completa en ambos formularios, control del envío con `preventDefault`, errores mostrados cerca del formulario y actualización del listado y de las opciones relacionadas **sin recargar la página**.

### Venta simulada e historial (Ejercicio 5 — 20 pts)
- Selección de cliente, composición de renglones, modificación de cantidades, eliminación de renglones y confirmación.
- Cálculo de subtotales y total, con importes presentados a dos decimales.
- Registro de la venta con identificador, fecha, cliente, renglones y total, conservando el **precio unitario como valor histórico**.
- Historial con identificador, fecha, cliente, total y acceso al detalle de renglones; ventas confirmadas inmutables desde la interfaz.

### Persistencia, verificación y documentación (Ejercicio 6 — 10 pts)
- `localStorage` para conservar libros, clientes y ventas; carga inicial de ejemplos sin duplicarlos al reabrir.
- `README.md` de entrega con: autores, pasos para abrir en el navegador sin npm, navegación entre vistas, funcionalidades implementadas y pendientes, ubicación de los datos iniciales, funcionamiento y límites de `localStorage`, resultados de los 7 casos manuales y procedencia de imágenes ajenas.

## Fuera de alcance

Explícitamente **no** se implementa:

- API, base de datos, servidor o cualquier conexión con el backend.
- Inicio de sesión real, sesiones, autenticación, autorización o roles con credenciales.
- Librerías, frameworks, CDNs de CSS o JavaScript, dependencias instaladas o herramientas de compilación.
- Gestión de stock, cobros, pagos o facturación fiscal: la venta solo registra cantidades y precios para obtener un total simulado.
- Envío de correos, notificaciones, o integración con servicios externos de cualquier tipo.
- Sincronización entre dispositivos, navegadores o usuarios.
- Edición y eliminación de libros y clientes (no exigidas por la consigna).
- Edición o eliminación de ventas confirmadas.
- Alta, baja o modificación de editoriales, géneros y autores.
- Pruebas automatizadas o frameworks de testing: la verificación es **manual, reproducible y documentada**.
- Puertos, módems, pasarelas de pago, facturación, proveedores de email y cualquier servicio de terceros.
- El backend de Programación III del otro docente, que solo se toma como contexto.

## Métricas de éxito

| Métrica | Objetivo | Fuente |
|---------|----------|--------|
| Puntuación según rúbrica | 100/100 (20 + 20 + 15 + 15 + 20 + 10) | Criterios de evaluación |
| Cumplimiento técnico | 0 librerías, frameworks, CDNs, dependencias o build tools | Contexto y alcance |
| Apertura del entregable | `index.html` se abre en el navegador con doble clic, sin npm | Formato de entrega |
| Casos manuales | Los 7 casos ejecutados y registrados con el **resultado observado** | Ejercicio 6 |
| Verificación guiada | El precio unitario de una venta se conserva aunque cambie el precio del catálogo | Ejercicio 6 |
| Responsive | Sin scroll horizontal de página a 320 px ni a 1280 px | Ejercicio 2 |
| Accesibilidad | Foco visible, recorrido por teclado, errores en texto, `alt` en imágenes informativas | Ejercicio 2 |
| Coherencia | Interfaz, datos y documentación se corresponden entre sí | Criterios de evaluación |
| Calidad de código | Legible, con nombres comprensibles, funciones acotadas y separación estructura/estilos/comportamiento | Criterios de evaluación |
