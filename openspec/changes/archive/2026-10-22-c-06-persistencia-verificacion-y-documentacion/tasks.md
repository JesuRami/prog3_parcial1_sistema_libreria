# Tasks

> Change retrospectivo (as-built). Todo lo marcado `[x]` ya está en el repositorio: la persistencia y el README se incorporaron en el commit `f7f90d3`; los casos manuales se registraron en los commits `c63938a`, `cd0c3c7` y `16452c0`. Lo que queda `[ ]` no está hecho y no debe marcarse hasta verificarlo.

## 1. Servicio de persistencia

- [x] 1.1 Crear `js/services/persistencia.js` con `clave`, `leer`, `escribir` y `disponible` bajo `window.Libreria.persistencia`, usando el prefijo `libreria.`; verificar en las herramientas del navegador que tras el primer arranque existen las seis claves con arrays JSON (commit `f7f90d3`).
- [x] 1.2 Hacer que `leer` devuelva `null` ante clave ausente, excepción de acceso, JSON inválido o valor que no es array; verificar escribiendo un texto inválido en `libreria.libros`, recargando y comprobando que el catálogo vuelve al seed y la aplicación arranca (commit `f7f90d3`).
- [x] 1.3 Hacer que `escribir` capture los fallos y devuelva `false` sin lanzar; verificar con el almacenamiento bloqueado o la cuota llena que el alta sigue visible en memoria y la aplicación no se interrumpe (commit `f7f90d3`).
- [x] 1.4 Implementar `disponible()` con una escritura, lectura y borrado de prueba en `libreria.__prueba`; verificar que devuelva `true` con el almacenamiento habilitado y `false` cuando el navegador lo bloquea (commit `f7f90d3`).

## 2. Integración con el estado en memoria

- [x] 2.1 Cargar las seis colecciones con `cargar(nombre, semilla)`: leer lo guardado y, si no existe, copiar el seed, escribirlo y usarlo; verificar que una segunda recarga no reescriba ni duplique los ejemplos (commit `f7f90d3`).
- [x] 2.2 Persistir la colección afectada en cada alta (`agregarLibro`, `agregarCliente`, `agregarVenta`, `agregarEditorial`, `agregarAutor`); verificar que un libro, un cliente, una editorial o un autor nuevos y una venta confirmada se recuperen tras recargar con el mismo identificador (commit `f7f90d3`).
- [x] 2.3 Ordenar los scripts en `index.html` como seed, persistencia y store antes del resto de módulos; verificar en la consola que no hay errores de referencia y que el estado arranca con las seis colecciones (commit `f7f90d3`).
- [x] 2.4 Actualizar `#aviso-datos` desde `js/main.js` con un texto de datos conservados y otro de datos que se pierden al recargar; verificar que el aviso cambie según `disponible()` y que se lea como texto, no solo por color (commit `f7f90d3`).

## 3. README de entrega

- [x] 3.1 Redactar pasos para abrir el proyecto sin npm, navegación entre las cinco vistas, funcionalidades implementadas y pendientes, ubicación de los datos iniciales en `js/data/seed.js`, procedencia de la imagen local y estructura del proyecto; verificar que cada sección exista y coincida con el código (commit `f7f90d3`).
- [x] 3.2 Documentar el funcionamiento y los límites de `localStorage`, incluida la dependencia del navegador, del perfil y de la ubicación, la falta de compartición entre usuarios y el efecto de borrar los datos del sitio; verificar que esas afirmaciones figuren en el README (commit `f7f90d3`).
- [x] 3.3 Documentar las seis claves y la estructura del catálogo guardado (`precio` dentro de `libreria.libros`) y los pasos de la comprobación guiada del precio histórico; verificar que un lector pueda reproducirlos con las herramientas del navegador (commit `f7f90d3`).
- [ ] 3.4 Completar el nombre y el legajo de los autores en el README, hoy con el texto de plantilla `[completar con nombre y legajo]`; verificar que no quede ningún texto entre corchetes en ese apartado. **A cargo del dueño del repositorio** (decidió completarlo a mano): no bloquea el cierre técnico del change.

## 4. Casos manuales de la consigna

- [x] 4.1 Ejecutar y registrar el caso 1 (búsqueda en mayúsculas, búsqueda vacía y texto inexistente) con el resultado observado; verificar que la fila describa los tres comportamientos y figure como aprobada (commit `cd0c3c7`).
- [x] 4.2 Ejecutar y registrar los casos 2 a 6 (ISBN duplicado, email inválido y duplicado, venta inválida y libro repetido, venta válida con importes, precio histórico tras cambiar el catálogo) con el resultado observado; verificar que cada fila describa los valores y mensajes reales (commit `c63938a`).
- [x] 4.3 Ejecutar y registrar el caso 8 (navegación por teclado y anchos de 320 px y 1280 px) con el resultado observado; verificar que la fila indique foco visible y ausencia de desplazamiento horizontal de página (commit `16452c0`).
- [x] 4.4 Ejecutar el caso 7 (recarga después de altas y venta) y registrar el resultado observado en el README, reemplazando «Pendiente de ejecución»; verificar que tras recargar se recuperen las altas y la venta sin duplicar ejemplos ni ventas (resultado: 7 libros, 4 clientes y 1 venta, sin duplicar los ejemplos; fila 7 del README).

## 5. Cierre del change

- [x] 5.1 Revisar la tabla de casos manuales del README y verificar que los 8 casos tengan resultado observado y que ninguno figure aprobado sin haber sido ejecutado; registrar la comprobación antes de cerrar el change (8/8 filas con resultado observado; ninguna pendiente).
- [x] 5.2 Marcar `C-06` como completado en `CHANGES.md` con su estado `[x]`; verificar que el cambio de estado coincida con los casos ejecutados y el README actualizado.

## Workflow follow-up

- Archivar el change (`openspec archive c-06-persistencia-verificacion-y-documentacion`) recién después de ejecutar el caso 7 y marcar `C-06` como completado.
- Verificar el resultado archivado contra la capacidad publicada en `openspec/specs/persistencia-local` y `openspec/specs/documentacion-de-entrega`.
