# Flujos Principales

Cada flujo se documenta extremo a extremo, mostrando interacciones entre componentes. Todos los flujos ocurren **en el navegador**, sin red.

---

## Flujo 1: Arranque de la aplicación
**Disparador**: el operador abre `index.html` en el navegador.
**Actor**: operador de librería.

**Pasos**:
1. El navegador carga `index.html` y los CSS externos.
2. `main.js` inicializa el `store` (estado en memoria) y el repositorio de `localStorage`.
3. El store lee las colecciones `libreria.libros`, `libreria.clientes` y `libreria.ventas`.
4. Si una colección **no existe**, se escribe el **seed** correspondiente (6+ libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes).
5. Si una colección **ya existe**, se carga tal cual y **no se reescribe** ⇒ no se duplican los datos iniciales.
6. `ui/nav.js` marca la vista activa (Catálogo por defecto).
7. `ui/render.js` renderiza el catálogo, los listados de libros y clientes, el selector de cliente de la venta y el historial.

```
Navegador → main.js → store ←→ localStorage
                 │         (seed solo si la clave no existe)
                 └──→ render → DOM (catálogo, listados, selectores, historial)
```

**Casos de error**:
- JSON corrupto en `localStorage` → se descarta esa colección, se recarga el seed y se deja constancia del comportamiento real en el README.
- `localStorage` no disponible (modo privado restringido) → la app sigue funcionando en memoria; el README documenta el límite.

---

## Flujo 2: Navegación entre vistas
**Disparador**: el operador hace clic en un enlace de la `<nav>` (o usa `Tab` + `Enter`).
**Actor**: operador de librería.

**Pasos**:
1. El evento `click` sobre el enlace se atiende desde un único listener delegado en la navegación.
2. Se actualiza el estado de la vista activa (clase/aria-current).
3. Se muestra la sección correspondiente y se ocultan las demás.
4. Si la navegación usa anclas `#vista`, la URL refleja la sección y el navegador permite volver atrás.

**Casos de error**:
- Enlace a una sección inexistente → no ocurre: las vistas son fijas y validadas en el arranque.
- Teclado: el foco visible se conserva; el control alcanzado con `Tab` se destaca (RN-UI-12).

---

## Flujo 3: Búsqueda en el catálogo
**Disparador**: el operador escribe en el buscador por título y confirma (evento `input` o `submit`).
**Actor**: operador de librería.

**Pasos**:
1. `ui/forms.js` captura el valor del buscador.
2. `domain/catalogo.js` aplica `trim()` al texto (RN-CAT-07).
3. Si el texto queda vacío → se devuelve **todo el catálogo** (RN-CAT-08).
4. Se normaliza a minúsculas y se busca por **coincidencia parcial** sobre el título (RN-CAT-05, RN-CAT-06).
5. `ui/render.js` reconstruye el listado del catálogo con los resultados.
6. Si no hay coincidencias → se muestra un **mensaje claro** de "sin resultados" (RN-CAT-09).
7. Cada fila muestra título, ISBN, editorial, género («Sin clasificar» si no hay), autores y precio.

```
Buscador → trim() → vacío? ── sí → catálogo completo
                      └─ no → minúsculas + includes(título) → render
                                                  sin coincidencias → mensaje
```

**Casos de error**:
- Texto con espacios al inicio y al final → recortado, funciona igual.
- Texto inexistente → mensaje, no lista vacía silenciosa.
- Texto con caracteres especiales → no se interpreta como expresión regular (búsqueda literal de subcadena).

---

## Flujo 4: Alta de libro
**Disparador**: el operador completa el formulario de libros y pulsa el botón de alta.
**Actor**: operador de librería.

**Pasos**:
1. `ui/forms.js` intercepta el `submit` y ejecuta `preventDefault()` (RN-LIB-14).
2. `domain/libros.js` recopila los valores del formulario.
3. Se ejecutan las validaciones en orden: título no vacío → ISBN no vacío → ISBN no duplicado (comparado sin espacios ni guiones) → precio numérico y > 0 → editorial existente → al menos un autor → todos los autores existen → género existente si fue asignado.
4. Si alguna comprobación falla → se limpian los errores previos y se muestran **cerca del formulario**, en texto (RN-LIB-15). No se agrega nada.
5. Si todas pasan → se crea el `Libro` con `id` estable, se agrega al store y se persiste la colección.
6. Se re-renderizan el listado de libros, el catálogo y el selector de libro de la venta, **sin recargar la página** (RN-LIB-16).
7. Se muestra un mensaje de resultado y el formulario queda limpio.

```
Formulario → preventDefault → validaciones
                             ├─ falla → errores en texto → fin
                             └─ ok → alta en store → localStorage → re-render → mensaje
```

**Casos de error**:
- ISBN duplicado → se rechaza con mensaje; el catálogo no cambia.
- Precio vacío o `"abc"` o `0` o negativo → se rechaza.
- Sin autores seleccionados → se rechaza.
- Editorial o género inexistentes (manipulados en el DOM) → se rechazan por la validación contra los datos locales.

---

## Flujo 5: Alta de cliente
**Disparador**: el operador completa el formulario de clientes y pulsa el botón de alta.
**Actor**: operador de librería.

**Pasos**:
1. `ui/forms.js` intercepta el `submit` con `preventDefault()`.
2. `domain/clientes.js` valida: nombre completo no vacío → email no vacío → formato de email válido → unicidad del email normalizado (`trim()` + minúsculas).
3. Si falla → se muestran los errores cerca del formulario; no se agrega nada.
4. Si pasa → se crea el `Cliente`, se agrega al store y se persiste la colección.
5. Se re-renderizan el listado de clientes y el selector de cliente de la vista Ventas, **sin recargar**.
6. Se muestra el mensaje de resultado y el formulario queda limpio.

**Casos de error**:
- Email inválido (`"correo"`, `"a@b"`) → rechazado.
- Email duplicado en mayúsculas o con espacios exteriores → rechazado.
- Nombre vacío → rechazado.

---

## Flujo 6: Composición y confirmación de venta
**Disparador**: el operador selecciona un cliente, agrega renglones y pulsa "Confirmar venta".
**Actor**: operador de librería.

**Pasos**:
1. El operador **selecciona un cliente existente** en la vista Ventas (RN-VTA-01).
2. El operador **agrega un renglón**: libro existente + cantidad **entera mayor que cero** (RN-VTA-02).
3. `domain/ventas.js` verifica que el `libroId` **no esté repetido** en la venta:
   - si está repetido, **se modifica la cantidad del renglón existente** o **se informa el duplicado** (RN-VTA-03).
4. Antes de confirmar, el operador puede **cambiar cantidades** y **quitar renglones** (RN-VTA-04).
5. En cada cambio se recalculan **subtotal = cantidad × precio unitario** y **total = Σ subtotales**, mostrados con **dos decimales** (RN-VTA-06, RN-VTA-07, RN-VTA-08).
6. Al pulsar "Confirmar venta" se re-validan las condiciones: hay cliente, hay al menos un renglón, todas las cantidades son enteras > 0. Si algo falla → no se confirma y se informa (RN-VTA-09).
7. Se construye la `Venta`: `id`, `fecha`, `clienteId`, `clienteNombre` (snapshot), `renglones[]` y `total` (RN-VTA-10, RN-VTA-12).
8. En cada renglón se copia `precioUnitario` **desde el catálogo en ese momento** y queda congelado como valor histórico (RN-VTA-11).
9. Se guarda la venta en el store y se persiste la colección.
10. Se limpia el formulario para una nueva venta y se muestra un mensaje de resultado (RN-VTA-13).

```
Cliente + Renglón(libro, cant)
      │
      ├─ libro repetido → ajusta cantidad del renglón existente / informa
      │
      ├─ subtotal = cantidad × precio unitario (snapshot)
      ├─ total = Σ subtotales
      │
      └─ Confirmar → valida (cliente + renglones + cantidades)
            ├─ falla → no confirma
            └─ ok → Venta{id, fecha, cliente, renglones[], total} → localStorage
                    → limpia formulario → mensaje
```

**Casos de error**:
- Sin cliente → no confirma.
- Sin renglones → no confirma.
- Cantidad 0, negativa o decimal → no confirma.
- Libro repetido → no crea un segundo renglón.
- El total nunca se recalcula a partir del catálogo: usa el snapshot del renglón.

---

## Flujo 7: Consulta del historial y detalle de venta
**Disparador**: el operador entra a la vista Historial y pulsa "Ver detalle" sobre una venta.
**Actor**: operador de librería.

**Pasos**:
1. El historial se renderiza desde la colección `ventas`: **identificador, fecha, cliente y total** (RN-HIS-01).
2. Si no hay ventas → mensaje de lista vacía.
3. Al pedir el detalle, se muestran los renglones: **libro, cantidad, precio unitario y subtotal**, leyendo **solo los valores guardados** (RN-HIS-02, RN-HIS-03).
4. No hay controles de edición ni de eliminación en el historial (RN-VTA-14).

**Casos de error**:
- Venta sin renglones (estado inválido manipulado) → el detalle muestra la lista vacía con mensaje, sin romper el render.

---

## Flujo 8: Recarga y persistencia (incluye la comprobación guiada del precio histórico)
**Disparador**: el operador recarga la página, o el docente ejecuta la comprobación guiada.
**Actor**: operador de librería / docente revisor.

**Pasos**:
1. El arranque (Flujo 1) recupera libros, clientes y ventas desde `localStorage` **sin duplicar los ejemplos**.
2. El historial vuelve a mostrar las ventas confirmadas con sus importes.
3. **Comprobación guiada** (la realiza el docente sobre una copia del proyecto, con datos de prueba):
   1. Se confirma una venta y se anotan sus importes.
   2. Con las herramientas de almacenamiento del navegador se modifica **únicamente el precio del libro** dentro del catálogo guardado, **sin modificar ni borrar las ventas guardadas**.
   3. Se recarga la página y se consulta el detalle de la venta anterior.
   4. El precio unitario, los subtotales y el total **conservan los valores confirmados** (RN-PER-05).
4. El README documenta la **ubicación y la estructura del catálogo guardado** para que la comprobación sea reproducible (RN-PER-06).

```
                  ┌──────────────────────┐
                  │ localStorage          │
Alta / Confirmación│  libros / clientes /  │
      ───────────▶│  ventas               │
                  └──────────┬───────────┘
                             │ recarga
                             ▼
Arranque: seed solo si falta la clave ⇒ sin duplicados
                             │
Venta confirmada ──▶ precio histórico intacto (snapshot)
```

**Casos de error**:
- Se modificó el precio en el catálogo ⇒ el catálogo muestra el precio nuevo, la venta mantiene el viejo (comportamiento **esperado**).
- Se borró la colección `libreria.ventas` ⇒ el historial vuelve al seed y la venta deja de estar: es comportamiento de `localStorage`, documentado como tal.

---

## Flujo 9: Verificación manual documentada
**Disparador**: cierre del TPI.
**Actor**: equipo de desarrollo.

**Pasos**:
1. Se ejecutan los 7 casos manuales definidos en la consigna (ver `06_funcionalidades.md`, US-023.1 a US-023.7).
2. Se anota en el README el **resultado observado** de cada caso (no el esperado).
3. Si un caso falla o queda una funcionalidad pendiente, se registra el **comportamiento real**.
4. No se declara ninguna prueba como aprobada sin haberla ejecutado.

**Casos de error**: no aplica — este flujo es el mecanismo de rendición de cuentas de la entrega.
