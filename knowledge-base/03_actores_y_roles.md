# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa con el sistema |
|-------|-------------|--------------------------------|
| **Operador de librería** | Persona que usa la interfaz para llevar el registro de la librería: consulta el catálogo, da de alta libros y clientes, compone ventas y revisa el historial. Es el único rol de uso de la aplicación. | Navega entre las 5 vistas, usa el buscador del catálogo, completa y envía los formularios de alta, arma la venta y consulta el detalle de ventas confirmadas. Sus datos quedan persistidos en el `localStorage` del navegador donde trabaja. |
| **Equipo de desarrollo** | Estudiantes de Programación III responsables de construir y documentar el TPI. | Escribe el HTML, el CSS y el JavaScript; define el modelo de datos y las validaciones; redacta el `README.md` de entrega con los casos manuales. No interactúa con la aplicación como usuario final: la usa para verificar. |
| **Docente revisor** | Revisor de la unidad (Prof. Matías Torres). Evalúa el resultado observable contra la rúbrica de 100 puntos. | Abre la entrega tal como se entrega, revisa la correspondencia entre interfaz, datos y documentación, ejecuta los casos manuales y realiza la comprobación guiada del precio histórico **sobre una copia del proyecto con datos de prueba**. |

### Actores que NO existen en el sistema

| Candidato habitual | Por qué no aplica |
|--------------------|-------------------|
| **Cliente de la librería como usuario** | El `Cliente` es una entidad de datos registrada por el operador (nombre completo + email). No accede a la interfaz, no tiene credenciales y no realiza compras por su cuenta: las ventas las registra el operador. |
| **Administrador /anonimato con permisos** | La consigna dice que "no se requiere un inicio de sesión real". No hay cuentas, sesiones ni permisos diferenciados. |
| **Proveedor / editorial** | Las editoriales, géneros y autores son datos semilla de solo lectura; no se gestionan altas, bajas ni modificaciones. |
| **Procesador de pagos / sistema fiscal** | Fuera de alcance: "sin gestionar stock, cobros ni facturación fiscal". |
| **Backend de Programación III** | Solo se toma como contexto; esta entrega desarrolla exclusivamente el frontend. |

## RBAC — Matriz de permisos

**No hay control de acceso real.** Al no existir autenticación, el único rol efectivo es el operador, con permisos completos sobre su propio navegador. La matriz documenta los límites de negocio (lo que la interfaz *no* permite hacer) más que una autorización de seguridad.

| Rol | Recurso | Permisos | Observación |
|-----|---------|----------|-------------|
| Operador de librería | Catálogo | Ver (leer) | Filtro por título; lectura de libros, editorial, género, autores y precio. Sin alta, baja ni modificación. |
| Operador de librería | Libros | Crear, Ver | Alta con validaciones. **No** editar, **no** eliminar. |
| Operador de librería | Clientes | Crear, Ver | Alta con email único. **No** editar, **no** eliminar. |
| Operador de librería | Ventas | Crear, Ver | Composición, confirmación y consulta de detalle. Confirmada ⇒ **no** editar, **no** eliminar. |
| Operador de librería | Historial | Ver | Listado y detalle de renglones de ventas confirmadas. |
| Operador de librería | Editoriales / Géneros / Autores | Ver (leer) | Solo lectura; provienen del seed. Sin administración. |
| Operador de librería | `localStorage` | Lectura / Escritura | Acotado a su navegador, su perfil y la ubicación de apertura. No se comparte entre usuarios. |
| Equipo de desarrollo | Todo el código y la documentación | Escribir | Es una actividad de construcción, no un permiso de runtime. |
| Docente revisor | Entrega y datos de prueba | Leer / Verificar | Verifica sobre una **copia** del proyecto; no se exige que modifique la entrega original. |

### Restricciones transversales del rol

- Todo lo que el operador hace queda registrado en el `localStorage` de su navegador; no hay sincronización con otros equipos o dispositivos.
- Las validaciones y el almacenamiento del navegador son de práctica: "no representan seguridad ni integridad garantizada por un servidor" (RN-EXC-01).

## Rutas públicas

**Todas las vistas son públicas**: no hay login, no hay rutas protegidas, no hay redirección por falta de sesión.

| Ruta / ancla | Vista | Contenido | Accesibles sin autenticación |
|--------------|-------|-----------|-------------------------------|
| `index.html` | Catálogo (raíz) | Título de la librería, buscador por título, listado de libros | Sí |
| `index.html#catalogo` | Catálogo | Catálogo completo con filtro por título | Sí |
| `index.html#libros` | Libros | Formulario de alta y listado de libros registrados | Sí |
| `index.html#clientes` | Clientes | Formulario de alta y listado de clientes registrados | Sí |
| `index.html#ventas` | Ventas | Selección de cliente, composición de renglones y resumen de la venta | Sí |
| `index.html#historial` | Historial | Listado de ventas confirmadas y acceso al detalle de renglones | Sí |
| `README.md` | Documentación | Entrega: pasos de apertura, navegación, funcionalidades, `localStorage`, casos manuales | Sí (archivo del proyecto) |

> Si en la implementación se opta por páginas HTML separadas en lugar de secciones, las rutas pasan a ser `catalogo.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, manteniendo `index.html` como entrada. La consigna permite ambas formas (`DD-08`).
