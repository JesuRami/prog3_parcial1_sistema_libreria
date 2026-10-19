# Modelo de Datos

## Dominios

| Dominio | Entidades | Descripción |
|---------|-----------|-------------|
| **Catálogo** | `Editorial`, `Género`, `Autor`, `Libro` | Wishlist de datos maestros y libros. Editoriales, géneros y autores son de **solo lectura** (seed); los libros se dan de alta desde la interfaz. |
| **Clientes** | `Cliente` | Compradores registrados por el operador, con nombre completo y email único. |
| **Ventas** | `Venta`, `RenglónVenta` | Operaciones simuladas: cada venta agrupa renglones y congela el precio unitario en el momento de la confirmación. |

Todos los datos son **ficticios** y viven en arrays/objetos JavaScript en memoria, con persistencia opcional en `localStorage`.

## ERD (Entity Relationship Diagram)

```
   Editorial ────1──────< N ────── Libro ────N──────< N ──────1 ──── Autor
                        │            │
                        │            │ (Libros.autores es la relación N:M resuelta
                        │            │  en memoria como array de ids de Autor)
                        │
                        │ N..1 (obligatoria)          0..1 (opcional: puede ir vacío)
                        ▼                                       │
                     Editorial                              Género
                                                          ("Sin clasificar")


   Cliente ─────1──────< N ────── Venta ─────1──────< N ──────1 ────── Libro
                        │                           RenglónVenta
                        │ (1..1)
                        └── snapshot: clienteNombre
                                        (dato descriptivo congelado)
```

**Reglas del diagrama**

- `Libro` → `Editorial`: **exactamente una** editorial, y esa editorial debe existir en los datos locales.
- `Libro` ↔ `Autor`: **uno o más** autores (N:M), todos existentes.
- `Libro` → `Género`: **cero o uno**; si se asigna, debe existir. Si no, la vista muestra «Sin clasificar».
- `Venta` → `Cliente`: **exactamente un** cliente existente.
- `Venta` → `RenglónVenta`: **uno o más** renglones.
- `RenglónVenta` → `Libro`: referencia al libro **y además** guarda un *snapshot* de título y precio unitario.

### Claves, identificadores y desnormalización controlada

| Concepto | Definición |
|----------|-----------|
| Identificador estable | Toda entidad expone un `id` que **no cambia** durante la vida del registro y que se conserva entre recargas (es la clave de la relación y del lookup en memoria). |
| Snapshot / dato histórico | Campos que se copian al momento de confirmar la venta (`precioUnitario`, `libroTitulo`, `clienteNombre`) para que el historial siga siendo legible aunque el catálogo cambie. Es la desnormalización que la consigna exige explícitamente: *"El precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial"*. |
| Índices | No hay índices de base de datos. En su equivalente JS se usan `Map`/búsqueda lineal por `id` sobre los arrays para resolver relaciones en O(1) y para validar existencia. |

## Entidades

### Editorial

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador único dentro de la colección. |
| `nombre` | `string` | Sí | Nombre de la editorial. |

- **Relaciones**: 1editorial → N libros (`Libro.editorialId`).
- **Constraints**: sin duplicados de nombre; es de solo lectura (no se administra).
- **Indices**: `Map` por `id` para el lookup del catálogo.

### Género

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador único. |
| `nombre` | `string` | Sí | Ej.: «Ciencia ficción», «Ensayo». |

- **Relaciones**: 1género → N libros, opcional (`Libro.generoId = null` cuando no está clasificado).
- **Constraints**: solo lectura; la vista de catálogo y el selector del formulario exponen la pseudo-opción **«Sin clasificar»** para el valor `null`.

### Autor

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador único. |
| `nombre` | `string` | Sí | Nombre completo del autor. |

- **Relaciones**: N:1 desde `Libro` a través de `Libro.autorIds` (array de ids, mínimo 1 elemento).
- **Constraints**: solo lectura; la selección en el formulario es múltiple.

### Libro

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador único; se conserva entre recargas. |
| `titulo` | `string` | Sí | No vacío. Se muestra en el catálogo, en el selector de venta y en el detalle de la venta. |
| `isbn` | `string` | Sí | No vacío. Se **compara** sin espacios ni guiones (RN-LIB-04/05). |
| `isbnNormalizado` | `string` (derivado) | Sí | Clave de comparación = `isbn` con espacios y guiones eliminados. Puede calcularse al vuelo o cachearse; no se muestra. |
| `precio` | `number` | Sí | Numérico y **mayor que cero**. Se muestra con dos decimales. |
| `editorialId` | `number` (FK) | Sí | Debe existir en la colección `Editoriales`. |
| `generoId` | `number` \| `null` (FK) | No | Si no es `null`, debe existir en la colección `Generos`. `null` ⇒ «Sin clasificar». |
| `autorIds` | `number[]` (FKs) | Sí | Mínimo un autor; todos deben existir en la colección `Autores`. |

- **Relaciones**: N:1 con Editorial, N:1 opcional con Género, N:M con Autor.
- **Constraints**:
  - `isbnNormalizado` único dentro de la colección local.
  - `precio > 0`.
  - `autorIds.length >= 1`.
  - Coherencia referencial estricta con `Editoriales`, `Generos` y `Autores`.
- **Vistas de proyección**:
  - Catálogo: título, ISBN, editorial, género («Sin clasificar» si no hay), autores y precio.
  - Selector de venta: título + precio.

### Cliente

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador único. |
| `nombreCompleto` | `string` | Sí | No vacío. No se exige campo de apellido separado. |
| `email` | `string` | Sí | Formato válido (RN-CLI-04) y **único** comparado sin espacios exteriores y sin distinguir mayúsculas/minúsculas (RN-CLI-05). |
| `emailNormalizado` | `string` (derivado) | Sí | `email.trim().toLowerCase()`. Clave de unicidad. No se muestra. |

- **Relaciones**: 1cliente → N ventas (`Venta.clienteId`).
- **Constraints**: unicidad de `emailNormalizado`; solo lectura del `id` y creación por alta (no se edita ni elimina).
- **Índice**: `Map` por `emailNormalizado` para la comprobación de duplicados en O(1).

### Venta

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador de la venta, visible en el historial. |
| `fecha` | `string` (ISO 8601) o `number` (epoch ms) | Sí | Momento de la confirmación, tomado del navegador. Formato de presentación a definir (`SU-05`). |
| `clienteId` | `number` (FK) | Sí | Debe existir en la colección `Clientes`. |
| `clienteNombre` | `string` (snapshot) | Sí | Copia del nombre al momento de confirmar; permite leer la venta sin volver a consultar el cliente. |
| `renglones` | `RenglónVenta[]` | Sí | Mínimo un renglón. |
| `total` | `number` | Sí | Suma de los subtotales; se presenta con dos decimales. |

- **Relaciones**: N:1 con Cliente, 1:N con RenglónVenta.
- **Constraints**: **inmutable desde la interfaz** — no se edita ni se elimina una vez confirmada.

### Renglón de venta

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | `number` (estable) | Sí | Identificador único dentro de la venta. |
| `libroId` | `number` (FK) | Sí | Libro existente. |
| `libroTitulo` | `string` (snapshot) | Sí | Título copiado al confirmar. |
| `cantidad` | `number` | Sí | **Entero mayor que cero**. |
| `precioUnitario` | `number` (snapshot) | Sí | Precio del libro **copiado al confirmar**. No se vuelve a leer del catálogo. |
| `subtotal` | `number` | Sí | `cantidad × precioUnitario`. |

- **Relaciones**: N:1 con Venta, N:1 con Libro.
- **Constraints**:
  - Dentro de una misma venta **no puede repetirse el mismo libro** (`libroId`): se modifica la cantidad del renglón existente o se informa el duplicado (RN-VTA-03).
  - `cantidad` entera y `> 0` (RN-VTA-02).
  - `precioUnitario` y `subtotal` son valores históricos: no se recalculan desde el catálogo.

## Seed data inicial

La consigna fija **cantidades mínimas** ("al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios"), no los valores concretos. La KB propone un seed que además **permite reproducir los 7 casos manuales** de la consigna (en particular el caso de venta con unidades a 1500 y 2000). Los valores concretos son un **supuesto** (`SU-08`).

### Editoriales (mínimo 2)

| id | nombre |
|----|--------|
| 1 | Editorial Astral |
| 2 | Editorial Norte |

### Géneros (mínimo 2)

| id | nombre |
|----|--------|
| 1 | Ciencia ficción |
| 2 | Ensayo |

### Autores (mínimo 3)

| id | nombre |
|----|--------|
| 1 | Valeria Ortiz |
| 2 | Nicolás Ferrari |
| 3 | Camila Sosa |

### Libros (mínimo 6)

| id | titulo | isbn | precio | editorialId | generoId | autorIds |
|----|--------|------|--------|-------------|----------|----------|
| 1 | El Jardín de las Máquinas | 978-950-0001-1 | 1500 | 1 | 1 | [1] |
| 2 | Cartografías del Silencio | 978-950-0002-2 | 2000 | 2 | 2 | [2] |
| 3 | Manual de Senderos | 978-950-0003-3 | 1800 | 1 | `null` → «Sin clasificar» | [3] |
| 4 | El Peso del Agua | 978-950-0004-4 | 2500 | 2 | 1 | [1, 2] |
| 5 | Diarios de un Viajero | 978-950-0005-5 | 1200 | 1 | 2 | [3] |
| 6 | Códigos y Sombras | 978-950-0006-6 | 3000 | 2 | `null` → «Sin clasificar» | [2, 3] |

> El libro 1 (precio 1500) y el libro 2 (precio 2000) existen para poder reproducir el caso manual de venta válida: *"dos unidades a 1500 y una a 2000"*.
> Los libros 3 y 6 ejercitan la rama «Sin clasificar» del catálogo y del selector de género.

### Clientes (mínimo 3)

| id | nombreCompleto | email |
|----|----------------|-------|
| 1 | María Gómez | maria.gomez@ejemplo.com |
| 2 | Juan Pérez | juan.perez@ejemplo.com |
| 3 | Lucía Ramírez | lucia.ramirez@ejemplo.com |

> Se usa el dominio reservado `ejemplo.com` para no exponer datos ni correos reales.

## Estructura de persistencia en `localStorage`

El enunciado no fija nombres de claves; la KB propone un espacio de nombres por colección (supuesto `SU-07`). El README de entrega debe documentar esta ubicación y estructura porque de ella depende la **comprobación guiada del precio histórico** que realiza el docente.

| Clave propuesta | Contenido | Se persiste |
|----------------|-----------|-------------|
| `libreria.libros` | `Libro[]` serializado a JSON | Sí |
| `libreria.clientes` | `Cliente[]` serializado a JSON | Sí |
| `libreria.ventas` | `Venta[]` serializado a JSON (cada `Venta` con sus `renglones[]` anidados) | Sí |
| `libreria.editoriales` | `Editorial[]` | Seed — no requerido persistir; se puede regenerar |
| `libreria.generos` | `Género[]` | Seed — no requerido persistir |
| `libreria.autores` | `Autor[]` | Seed — no requerido persistir |

### Reglas de escritura y lectura

1. **Semilla idempotente**: en el arranque, si la clave de una colección no existe, se escribe el seed; si ya existe, se lee y **no se reescribe** ⇒ al recargar no se duplican los datos iniciales.
2. **Escritura por colección**: cada alta o confirmación dispara el guardado de la colección afectada.
3. **Corrupción**: si el JSON guardado no se puede parsear o no cumple la forma esperada, se descarta silenciosamente esa colección y se vuelve a cargar el seed, dejando constancia en el README como comportamiento real (no como aprobado sin ejecutar).
4. **Sin datos sensibles**: el contenido almacenado es ficticio y de práctica; no hay credenciales ni secretos (RN-EXC-01).
