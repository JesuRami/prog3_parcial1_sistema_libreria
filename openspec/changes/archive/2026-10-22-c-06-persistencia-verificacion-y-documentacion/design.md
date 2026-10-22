# Design

## Context

Ver `proposal.md` → Why. El proyecto es un frontend estático abierto por `file://` con HTML, CSS y JavaScript nativos, sin build, sin dependencias y sin backend. Antes de este change el estado vivía solo en arrays en memoria:

- `js/data/seed.js` define los datos iniciales ficticios con identificadores estables.
- `js/services/store.js` construye el estado en memoria al evaluarse y expone las colecciones y las altas.
- `js/main.js` arranca en `DOMContentLoaded`, pinta listados, selectores y catálogo, y actualiza el aviso `#aviso-datos`.
- `index.html` carga los scripts en orden al final del `body`.

La consigna (Ejercicio 6) exige conservar los datos en `localStorage`, no duplicar los ejemplos al reabrir, verificar la persistencia de forma manual y entregar un README con el contenido mínimo. La KB (`knowledge-base/04_modelo_de_datos.md` y `09_decisiones_y_supuestos.md` `DD-02`/`SU-07`) propone una clave por colección con prefijo `libreria.` y considerar editoriales, géneros y autores como datos regenerables desde el seed.

La implementación ya existe en el commit `f7f90d3`; este documento explica sus decisiones as-built.

## Goals / Non-Goals

**Goals:**

- Aislar el acceso a `localStorage` en un servicio sin conocimiento del dominio, de modo que el store y la interfaz no manipulen la API del navegador directamente.
- Garantizar una semilla idempotente: los ejemplos se escriben una sola vez y nunca se duplican al recargar.
- Recuperar altas y ventas con sus identificadores estables después de una recarga.
- No romper el arranque ni la operación del usuario ante contenido corrupto o almacenamiento no disponible.
- Dejar el almacenamiento inspeccionable para la comprobación guiada del precio histórico y documentarlo en el README.

**Non-Goals:**

- Sincronización entre equipos, exportación/importación de datos o copias de seguridad.
- Versionado de esquema, migraciones o reconciliación de datos guardados con un seed nuevo.
- Cifrado, autenticación o cualquier forma de protección del contenido almacenado (los datos son ficticios).
- Avisar en la interfaz sobre colecciones corruptas descartadas: el comportamiento se documenta en el README, no se agrega UI.
- Tests automatizados o herramientas de compilación (prohibidos por la consigna).

## Decisions

### Servicio de persistencia separado del store

- **Decisión**: `js/services/persistencia.js` expone `window.Libreria.persistencia` con `clave(nombre)`, `leer(nombre)`, `escribir(nombre, valor)` y `disponible()`. El store consume ese servicio y la interfaz solo usa `disponible()` para el aviso.
- **Alternativa descartada**: llamar a `window.localStorage` directamente desde `store.js`. Acoplaría el estado a la API del navegador, repetiría el `try/catch` en cada operación y haría más difícil razonar la recuperación ante fallos.
- **Alternativa descartada**: un repositorio con interfaz genérica (`get`/`set` de registros). Para este alcance la unidad de escritura es la colección completa; una abstracción por registro agregaría código sin cambiar el comportamiento observable.

### Persistir las seis colecciones (desviación deliberada de la KB)

- **Decisión**: se persisten `editoriales`, `generos`, `autores`, `libros`, `clientes` y `ventas`.
- **Razón**: la KB asumía que editoriales, géneros y autores podían regenerarse desde el seed y no necesitaban persistirse. Esa suposición dejó de ser válida con la excepción autorizada de la regla 16: el alta de libro permite crear una editorial o un autor nuevos en runtime, y esos registros son claves foráneas (`editorialId`, `autorIds`) de libros que sí se persisten. Si no se guardaran, al recargar el libro persistido apuntaría a identificadores inexistentes y la proyección del catálogo quedaría incompleta.
- **Alternativa descartada**: no persistir los maestros y remapear por nombre al recargar. Reintroduciría trabajo de reconciliación, podría fusionar registros homónimos y rompería la estabilidad de los identificadores.
- **Consecuencia**: el README documenta las seis claves, no solo las tres que nombra la consigna. Es una ampliación compatible: la consigna exige conservar libros, clientes y ventas, y no prohíbe conservar más colecciones locales.
- **Costo**: unos pocos kilobytes adicionales por origen (30 géneros en el seed), irrelevante frente a la cuota típica.

### Una clave por colección, con JSON de array

- **Decisión**: cada colección se serializa completa como array JSON bajo `libreria.<nombre>`.
- **Alternativa descartada**: una única clave con todo el estado. Un JSON corrupto perdería todas las colecciones a la vez y la comprobación guiada exigiría navegar una estructura anidada; con claves separadas, la corrupción queda acotada y el precio del catálogo se localiza directamente en `libreria.libros`.
- **Alternativa descartada**: `IndexedDB`. La consigna pide `localStorage` y la API asíncrona complicaría el arranque sin beneficio para este volumen.
- **Consecuencia**: la escritura es por colección completa (no por registro). Es aceptable para decenas de registros y evita mantener índices o claves compuestas.

### Semilla idempotente al construir el estado

- **Decisión**: `cargar(nombre, semilla)` lee la clave; si `leer` devuelve `null`, copia el seed con `JSON.parse(JSON.stringify(...))`, lo escribe y lo usa; si devuelve un array, lo usa tal cual. El estado se construye al evaluar `store.js` (antes de `DOMContentLoaded`).
- **Alternativa descartada**: sembrar de forma diferida en el primer evento de interfaz. Dejaría una ventana en la que el almacenamiento no refleja lo que la pantalla muestra y complicaría el diagnóstico manual.
- **Alternativa descartada**: usar el objeto del seed por referencia. Las altas mutarían `window.Libreria.seed` y, tras descartar una colección corrupta, el seed podría venir ya contaminado por la sesión.
- **Consecuencia**: el seed se escribe antes de que la interfaz esté lista; si la escritura falla, la aplicación igual arranca con la copia en memoria.

### Corrupción tratada por colección

- **Decisión**: `leer` devuelve `null` si `getItem` lanza, si la clave no existe, si el JSON no parsea o si el valor parseado no es un array. El store interpreta `null` como «sembrar» y reescribe la colección con el seed.
- **Alternativa descartada**: propagar el error o mostrar un diálogo. La consigna no pide una pantalla de recuperación y un error bloqueante impediría usar la aplicación.
- **Consecuencia**: una colección corrupta se reemplaza por el seed en la siguiente escritura, sin conservar el contenido inválido ni avisar en pantalla. El README lo documenta como comportamiento real.

### Escritura tolerante a fallos

- **Decisión**: `escribir` envuelve `setItem` en `try/catch` y devuelve `true` o `false`; el store ignora el resultado y mantiene la colección en memoria.
- **Alternativa descartada**: lanzar el error para que la interfaz muestre un fallo. La operación del usuario ya se completó en memoria; interrumpirla por una limitación del navegador empeoraría la experiencia y no aporta al alcance.
- **Consecuencia**: la interfaz no distingue «guardado» de «solo en memoria» en cada operación; el aviso general de `#aviso-datos` comunica el estado del almacenamiento.

### Sonda de disponibilidad separada de las operaciones

- **Decisión**: `disponible()` escribe un valor de prueba en `libreria.__prueba`, lo lee, lo elimina y compara; devuelve `false` si cualquier paso lanza.
- **Alternativa descartada**: deducir la disponibilidad del resultado de `escribir` durante el sembrado. Una escritura fallida por cuota podría confundirse con un almacenamiento bloqueado y el aviso aparecería tarde.
- **Consecuencia**: la sonda prueba lectura y escritura básicas, no la cuota real; si el almacenamiento está lleno para un array grande pero admite un carácter, `disponible()` puede devolver `true` y la escritura real fallará igual (cubierto por la tolerancia a fallos). La clave de prueba se elimina siempre que el navegador lo permita.

### Aviso en texto, sin depender del color

- **Decisión**: `main.js` llama a `actualizarAvisoDeDatos()` al iniciar y escribe en `#aviso-datos` uno de dos textos: datos que se conservan al recargar o datos que se pierden. El HTML deja un texto de respaldo para cuando JavaScript no se ejecuta.
- **Alternativa descartada**: indicar el estado solo con un ícono o un color. Incumpliría la regla 12 (los errores y estados no dependen solo del color) y no sería legible para lectores de pantalla.
- **Consecuencia**: el aviso describe el almacenamiento del navegador, no confirma que cada operación se haya guardado.

### Orden de carga de scripts

- **Decisión**: `index.html` carga `js/data/seed.js`, luego `js/services/persistencia.js` y luego `js/services/store.js`, antes del resto de módulos.
- **Razón**: `store.js` lee `window.Libreria.persistencia` y el seed en el momento de evaluarse; invertir el orden dejaría referencias indefinidas.
- **Consecuencia**: el estado queda construido antes de que `main.js` se suscriba a `DOMContentLoaded`.

### README como contrato de entrega verificable

- **Decisión**: el README registra el estado real (funcionalidades implementadas y pendientes, caso 7 pendiente), las claves y campos del almacenamiento, los pasos de la comprobación guiada y los resultados observados de los casos 1 a 6 y 8.
- **Alternativa descartada**: documentar el «deber ser» y no el estado observado. La consigna prohíbe declarar aprobado un caso sin ejecutarlo; el README debe reflejar lo que realmente ocurrió.
- **Consecuencia**: el README se actualiza cuando se ejecute el caso 7, sin reescribir resultados ya observados.

## Risks / Trade-offs

- **Almacenamiento lleno o restringido** → la operación sigue en memoria y la interfaz no falla; `escribir` devuelve `false` y el dato se pierde al recargar. Mitigación: aviso general en `#aviso-datos` y límites documentados en el README.
- **Sonda de disponibilidad optimista** → `disponible()` puede devolver `true` aunque una escritura grande falle por cuota. Mitigación: la escritura real es tolerante y no interrumpe la operación.
- **Corrupción silenciosa** → una colección inválida se reemplaza por el seed sin avisar en pantalla, lo que puede percibirse como pérdida de datos. Mitigación: comportamiento documentado en el README como real; recuperar la colección exigiría UI fuera de alcance.
- **Sin versionado de esquema** → si cambia la forma de los registros, los datos ya guardados conservan la forma vieja y la proyección puede fallar. Mitigación: el proyecto es una práctica; la recuperación es borrar los datos del sitio, documentado en el README.
- **Origen de `file://` variable entre navegadores** → algunos navegadores tratan los archivos locales como un origen especial y el alcance del almacenamiento puede variar. Mitigación: el README pide abrir siempre la misma copia desde la misma ubicación y explica que el almacenamiento depende del navegador, del perfil y de la ubicación.
- **Persistir seis colecciones** → más datos escritos que los tres que nombra la consigna. Mitigación: volumen mínimo y ganancia de integridad referencial; documentado como decisión deliberada.
- **Estado construido antes del DOM** → si `localStorage` tarda o falla, el costo se paga en el arranque. Mitigación: las operaciones son sincrónicas y locales; no hay red.
- **Verificación incompleta al escribir el change** → el caso 7 sigue pendiente y su resultado no puede darse por aprobado. Mitigación: figura como pendiente en el README y como tarea abierta hasta ejecutarlo.

## Migration Plan

- No hay migración de datos: antes de este change no existía nada persistido; el primer arranque siembra las seis colecciones.
- El código ya está incorporado en el commit `f7f90d3`; el despliegue es abrir `index.html` en el navegador.
- Para volver al estado inicial en una máquina de prueba: borrar los datos del sitio del origen y recargar.
- Rollback: revertir `f7f90d3` (persistencia, integración en el store, aviso y README) y borrar las claves `libreria.*` del origen para evitar datos huérfanos.

## Open Questions

Ninguna que afecte las specs, el enfoque o las tareas. La desviación de persistir seis colecciones está resuelta y documentada arriba; el único pendiente es de verificación (caso manual 7), no de diseño.
