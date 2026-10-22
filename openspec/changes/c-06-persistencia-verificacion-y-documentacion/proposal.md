# Proposal

## Why

El sistema ya consulta el catálogo, da de alta libros y clientes y registra ventas simuladas, pero todo eso vivía solo en memoria: al recargar se perdía el trabajo del operador. El Ejercicio 6 (10 puntos) exige conservar los datos en `localStorage` sin duplicar los ejemplos iniciales, verificar manualmente la persistencia y entregar un README con el contenido mínimo, incluidos los resultados reales de los 8 casos manuales. Sin este cierre el proyecto no cumple la consigna aunque el resto de las funcionalidades esté completo.

## What Changes

- El estado de la aplicación se inicializa desde `localStorage`: cada colección se guarda como un array JSON bajo una clave propia con prefijo `libreria.` (`editoriales`, `generos`, `autores`, `libros`, `clientes`, `ventas`).
- La semilla es **idempotente**: si la clave de una colección no existe se escribe el seed; si existe se lee y no se reescribe, de modo que al reabrir no se duplican los ejemplos iniciales ni las ventas.
- Cada alta de libro, alta de cliente, editorial o autor nuevos y cada venta confirmada persisten la colección afectada completa.
- La lectura tolera corrupción: un JSON inválido o un valor que no es array descarta esa colección y el store vuelve a cargar el seed sin interrumpir el arranque.
- La escritura tolera fallos (cuota llena, modo privado, almacenamiento bloqueado): la operación del usuario continúa en memoria y la aplicación no se rompe.
- La interfaz informa si el almacenamiento está disponible mediante el aviso `#aviso-datos`, con dos textos alternativos (datos que se conservan o datos que se pierden al recargar).
- Se registran los resultados observados de los 8 casos manuales del Ejercicio 6 en el README; un caso sin ejecutar queda como pendiente y nunca como aprobado.
- El README identifica la ubicación y la estructura del catálogo guardado para que el docente reproduzca la comprobación guiada del precio histórico, y documenta el funcionamiento y los límites de `localStorage` (depende del navegador, del perfil y de la ubicación; no se comparte entre usuarios).
- **Desviación deliberada respecto de la KB**: se persisten las 6 colecciones, no solo libros, clientes y ventas. Las excepciones autorizadas de la regla 16 hacen crecer editoriales y autores en runtime y ambos son FK de los libros persistidos; sin persistirlos se romperían las referencias al recargar. La decisión se documenta en `design.md`.
- Queda pendiente de ejecución el caso manual 7 (recarga después de altas y venta); su resultado real se registrará antes de archivar el change.

## Capabilities

### New Capabilities

- `persistencia-local`: comportamiento observable del almacenamiento en `localStorage` — claves y estructura, semilla idempotente sin duplicar, recuperación tras recarga, corrupción, indisponibilidad del almacenamiento, datos ficticios e independencia entre navegadores, perfiles y ubicaciones.
- `documentacion-de-entrega`: contrato del README de entrega — contenido mínimo obligatorio, resultados reales de los 8 casos manuales, regla de no aprobar sin ejecutar y ubicación/estructura del almacenamiento para la verificación del docente.

### Modified Capabilities

Ninguna: no cambian requisitos de `estructura-y-navegacion`, `presentacion-adaptable`, `datos-locales-y-filtro`, `altas-de-libros-y-clientes` ni `venta-e-historial`; este change agrega persistencia y documentación de entrega sin alterar esos comportamientos.

## Impact

- **Persistencia**: `js/services/persistencia.js` (nuevo módulo con `clave`, `leer`, `escribir`, `disponible`).
- **Servicio**: `js/services/store.js` carga cada colección desde `localStorage` con semilla idempotente y persiste en cada alta.
- **Arranque**: `js/main.js` actualiza el aviso `#aviso-datos` según `persistencia.disponible()`.
- **HTML**: `index.html` incluye `js/services/persistencia.js` antes de `js/services/store.js` y mantiene el párrafo `#aviso-datos`.
- **Documentación**: `README.md` (autores, apertura sin npm, navegación, funcionalidades, datos iniciales, límites de `localStorage`, casos manuales, imágenes).
- **Datos**: datos ficticios de práctica; no hay datos sensibles ni credenciales.
- **Dependencias**: ninguna externa; HTML, CSS y JavaScript nativos, sin build, sin `fetch`, sin backend.
- **Fuera de alcance**: sincronización entre equipos, exportación/importación, migraciones de esquema, edición o eliminación de registros y tests automatizados (prohibidos por la consigna).

## Nota de cierre retrospectivo

Este change se documenta **as-built**: la persistencia y el README ya están implementados e incorporados por el commit `f7f90d3` («Mejoradas las funciones en la sección de catálogo y libros.»). Los artifacts se escriben después de la implementación y describen lo que ese código hace observablemente; no se modificó código, `README.md`, `CHANGES.md` ni `AGENTS.md` al redactarlos.

La verificación final del change **sigue pendiente**: el caso manual 7 (recarga después de altas y venta) figura como «Pendiente de ejecución» en el README y debe ejecutarse y registrarse con su comportamiento real antes de marcar `C-06` como completado y archivar el change.
